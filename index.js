const fs = require('fs');
const chalk = require('chalk');

function mdLinks(pathFile) {
  return new Promise((resolve, reject) => {
    const fileExists = fs.existsSync(pathFile);
    const fileSize = fs.statSync(pathFile).size;

    if (!fileExists || fileSize === 0) {
      reject(chalk.red('\u2717') + ' ' + `O arquivo: ${chalk.red(pathFile)} está vazio ou não existe.`);
    } else {
      fs.readFile(pathFile, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const regex =/\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
          const searchLinks = data.match(regex);

          const extraiLinks = searchLinks.map(link => {
            const removeItens = link.replace(/.$/, '').replace('[', '');
            const split = removeItens.split('](');
            const newObj = {
              href: split[1],
              text: split[0],
              file: pathFile,
            };
            return newObj;
          });
          resolve(extraiLinks);
        }
      });
    }
  });
}

module.exports = mdLinks;
