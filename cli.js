#!/usr/bin/env node
const chalk = require('chalk');
const mdLinks = require('./index.js');
const fetch = require('node-fetch');

const pathFile = process.argv[2];
const option = process.argv[3];

//function cli () {
if (option === '--stats' && process.argv.includes('--validate')) {
  mdLinks(pathFile)
    .then(result => {
      const promises = result.map(element => {
        return fetch(element.href)
          .then(response => {
            element.status = response.status;
            element.statusText = response.statusText;
            return element;
          })
          .catch(error => {
            element.status = 'Não Encontrado';
            element.statusText = error.message;
            return element;
          });
      });

      Promise.all(promises)
        .then(linksArray => {
          const linknique = [...new Set(linksArray.map(element => element.href))];
          const stats = {
            total: linksArray.length,
            unique: linknique.length,
            broken: linksArray.filter(element => element.status !== 200).length,
          };
          console.log(chalk.grey('Total:'), stats.total);
          console.log(chalk.grey('Unique:'), stats.unique);
          console.log(chalk.grey('Broken:'), stats.broken);
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch(error => {
      console.log('Erro');
      console.error(error);
    });
} else if (option === '--validate') {
  mdLinks(pathFile)
    .then(result => {
      const promises = result.map(element => {
        return fetch(element.href)
          .then(response => {
            element.status = response.status;
            element.statusText = response.statusText;
            return element;
          })
          .catch(error => {
            element.status = 'Não Encontrado';
            element.statusText = error.message;
            return element;
          });
      });

      Promise.all(promises)
        .then(linksArray => {
          linksArray.forEach(element => {
            const statusColor = element.status >= 200 && element.status < 300 ? chalk.green : chalk.red;
            console.log(
              statusColor('\u2714'),
              chalk.grey(element.file),
              chalk.grey(element.href),
              statusColor(`${element.status} ${element.statusText}`),
              chalk.grey(element.text)
            );
          });
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch(error => {
      console.log('Erro');
      console.error(error);
    });
} else if (option === '--stats') {
  mdLinks(pathFile)
    .then(result => {
      const linknique = [...new Set(result.map(element => element.href))];
      const stats = {
        total: result.length,
        unique: linknique.length,
      };
      console.log(chalk.grey('Total:'), stats.total);
      console.log(chalk.grey('Unique:'), stats.unique);
    })
    .catch(error => {
      console.log('Erro');
      console.error(error);
    });
} else {
  console.log(`Comando inválido.`);
}
//};
//module.exports = cli;