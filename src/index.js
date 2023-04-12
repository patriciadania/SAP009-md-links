import fs from 'fs';
import chalk from 'chalk';

function extraiLinks(texto) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const capturas = texto.matchAll(regex);
  const resultados = Array.from(capturas, captura => ({[captura[1]]: captura[2]}))
  return resultados.length !== 0 ? resultados : 'não há links no arquivo';
}

function trataErro(erro) {
  console.log(erro);
  throw new Error(chalk.red(erro.code, 'não há arquivo no diretório'));
}

function pegaArquivo(caminhoDoArquivo) {
  const encoding = 'utf-8';
  return fs.promises.readFile(caminhoDoArquivo, encoding)
    .then(texto => extraiLinks(texto))
    .catch(trataErro)
}

export default pegaArquivo;
