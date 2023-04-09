import fs from 'fs';
import chalk from 'chalk';

function extraiLinks(texto) {
    const regex = /\\[[^[\]]*?\]\(https?:\/\/[^\s?#.].[^\s]*\)/gm;
    const capturas = [...texto.matchAll(regex)]; //array expandido
    const resultados = capturas.map(captura => ({[captura[1]]: captura[2]}));
    return resultados;
}

function trataErro(erro) {
    throw new Error(chalk.red(erro.code, 'não há arquivo no diretório'));
}

function pegaArquivo(caminhoDoArquivo) {
    const encoding = 'utf-8';
    fs.promises
        .readFile(caminhoDoArquivo, encoding)
        .then((texto) => console.log(extraiLinks(texto)))
        .catch(trataErro);
}
pegaArquivo('./arquivos/texto.md');

