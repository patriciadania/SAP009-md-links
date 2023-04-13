import fs from 'fs';
import checaStatus from './http-validacao.js';
import calculaStats from './stats.js';

function trataErro(erro) {
  console.log(erro)
  throw new Error(chalk.red(erro.code, 'Não há arquivo no diretório'));
}

function extrairLinks(caminhoDoArquivo) {
  const encoding = 'utf-8';
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;

  return fs.promises.readFile(caminhoDoArquivo, encoding)
    .then(texto => {
      const capturas = [...texto.matchAll(regex)];
      const resultados = capturas.map(captura => ({
        href: captura[2],
        text: captura[1],
        file: caminhoDoArquivo
      }));
      return resultados;
    })
    .catch(erro => trataErro(erro));
}

function mdLinks(path, options = {}) {
  const extensao = path.substr(path.lastIndexOf('.') + 1);
  const caminho = fs.realpathSync(path);
  const stats = { total: 0, unicos: 0 };

  if (extensao !== 'md') {
    return Promise.reject(new Error('extensao-invalida'));
  }

  if (fs.lstatSync(caminho).isDirectory()) {
    const listaArquivos = fs.readdirSync(caminho);
    const promises = listaArquivos.map(arquivo => {
      const caminhoCompleto = `${caminho}/${arquivo}`;
      return extrairLinks(caminhoCompleto);
    });
    return Promise.all(promises)
      .then(links => links.flat())
      .then(links => {
        stats.total = links.length;
        stats.unicos = new Set(links.map(link => link.href)).size;
        if (options.validate) {
          return checaStatus(links).then(validatedLinks => {
            if (options.stats) {
              return { ...calculaStats(validatedLinks), ...stats };
            }
            return validatedLinks;
          });
        }
        if (options.stats) {
          return { ...stats };
        }
        return links;
      })
      .catch(erro => trataErro(erro));
  }

  return extrairLinks(caminho)
    .then(links => {
      stats.total = links.length;
      stats.unicos = new Set(links.map(link => link.href)).size;
      if (options.validate) {
        return checaStatus(links).then(validatedLinks => {
          if (options.stats) {
            return { ...calculaStats(validatedLinks), ...stats };
          }
          return validatedLinks;
        });
      }
      if (options.stats) {
        return { ...stats };
      }
      return links;
    })
    .catch(erro => trataErro(erro));
}

export default mdLinks;
