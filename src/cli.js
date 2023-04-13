import chalk from 'chalk';
import fs from 'fs';
import mdLinks from './index.js';
import listaValidada from './http-validacao.js';

const caminho = process.argv;

function imprimeLista(valida, resultado, identificador = '') {
  if (valida) {
    listaValidada(resultado)
      .then(lista => {
        console.log(
          chalk.yellow('Lista validada'),
          chalk.black.bgGreen(identificador),
          lista);
      })
      .catch(console.error);
  } else {
    console.log(
      chalk.yellow('Lista de links'),
      chalk.black.bgGreen(identificador),
      resultado);
  }
}

function processaArquivo(nomeDoArquivo, valida) {
  return mdLinks(nomeDoArquivo)
    .then(resultado => imprimeLista(valida, resultado))
    .catch(console.error);
}

function processaDiretorio(caminho, valida) {
  return fs.promises.readdir(caminho)
    .then(arquivos => {
      arquivos.forEach(nomeDeArquivo => {
        processaArquivo(`${caminho}/${nomeDeArquivo}`, valida);
      });
    })
    .catch(console.error);
}

function processaTexto(argumentos) {
  const caminho = argumentos[2];
  const valida = argumentos[3] === '--validate';

  try {
    fs.lstatSync(caminho);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      console.log('Arquivo ou diretório não existe');
      return;
    }
  }

  if (fs.lstatSync(caminho).isFile()) {
    processaArquivo(caminho, valida);
  } else if (fs.lstatSync(caminho).isDirectory()) {
    processaDiretorio(caminho, valida);
  }
}

processaTexto(caminho);
