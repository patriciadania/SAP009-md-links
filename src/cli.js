import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './index.js';
import listaValidada from './http-validacao.js';

const caminho = process.argv;

function imprimeLista(valida, resultado, identificador = '') {
  if (valida) {
    listaValidada(resultado).then(lista => {
      console.log(
        chalk.yellow('lista validada'),
        chalk.black.bgGreen(identificador),
        lista);
    }).catch(console.error);
  } else {
    console.log(
      chalk.yellow('lista de links'),
      chalk.black.bgGreen(identificador),
      resultado);
  }
}

function processaTexto(argumentos) {
  const caminho = argumentos[2];
  const valida = argumentos[3] === '--valida';

  try {
    fs.lstatSync(caminho);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      console.log('arquivo ou diretório não existe');
      return;
    }
  }

  if (fs.lstatSync(caminho).isFile()) {
    pegaArquivo(argumentos[2]).then(resultado => {
      imprimeLista(valida, resultado);
    }).catch(console.error);
  } else if (fs.lstatSync(caminho).isDirectory()) {
    fs.promises.readdir(caminho).then(arquivos => {
      arquivos.forEach(nomeDeArquivo => {
        pegaArquivo(`${caminho}/${nomeDeArquivo}`).then(lista => {
          imprimeLista(valida, lista, nomeDeArquivo);
        }).catch(console.error);
      })
    }).catch(console.error);
  }
}

processaTexto(caminho);
