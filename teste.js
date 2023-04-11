import fs from 'fs';
import chalk from 'chalk';

// const fs = required('fs');
// const chalk = required('chalk')

function trataErro(erro) {
    console.log(erro);
    throw new Error(chalk.red(erro.code, 'não há arquivo no diretório'));
}

function extraiLinks(texto) {
    const regex = /\\[[^[\]]*?\]\(https?:\/\/[^\s?#.].[^\s]*\)/gm;
    const capturas = [...texto.matchAll(regex)]; //array expandido
    const resultados = capturas.map(captura => ({ [captura[1]]: captura[2] }));
    return resultados;
}

async function pegaArquivo(caminhoDoArquivo) {
    try {
        const encoding = 'utf-8';
        const texto = await fs.promises.readFile(caminhoDoArquivo, encoding)
        return extraiLinks(texto);
    } catch (erro) {
        trataErro(erro)
    }
}

export default pegaArquivo;