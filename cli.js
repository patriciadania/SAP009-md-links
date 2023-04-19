#!/usr/bin/env node
const chalk = require('chalk');
const mdLinks = require('./index.js');
const fetch = require('node-fetch');

const pathFile = process.argv[2];
const option = process.argv[3];

const statusMessages = {
  '200': 'OK',
  '201': 'Criado',
  '204': 'Nenhum conteúdo',
  '400': 'Requisição inválida',
  '401': 'Não autorizado',
  '403': 'Proibido',
  '404': 'Não encontrado',
  '500': 'Erro interno do servidor',
  '502': 'Gateway ruim',
  '503': 'Serviço indisponível',
};

function fetchLink(element) {
  if (!element || !element.href) {
    return Promise.reject(new Error('Elemento inválido ou sem URL'));
  }

  return fetch(element.href)
    .then(response => {
      element.status = response.status;
      element.statusText = statusMessages[response.status.toString()] || response.statusText;;
      return element;
    })
    .catch(error => {
      element.status = 'Não Encontrado';
      element.statusText = error.message;
      return element;
    });
}


function printStats(result) {
  const linknique = [...new Set(result.map(element => element.href))];
  const stats = {
    total: result.length,
    unique: linknique.length,
  };
  console.log(chalk.grey('Total:'), stats.total);
  console.log(chalk.grey('Unique:'), stats.unique);
};

function printValidateResult (element) {
  const statusColor = element.status >= 200 && element.status < 300 ? chalk.green : chalk.red;
  console.log(
    statusColor('\u2714'),
    chalk.grey(element.file),
    chalk.grey(element.href),
    statusColor(`${element.status} ${element.statusText}`),
    chalk.grey(element.text)
  );
};

function printStatsWithBroken (result) {
  const promises = result.map(element => fetchLink(element));

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
};

function handleStatsWithValidateOption () {
  mdLinks(pathFile)
    .then(result => {
      printStatsWithBroken(result);
    })
    .catch(error => {
      console.log('Erro');
      console.error(error);
    });
};

function handleValidateOption () {
  mdLinks(pathFile)
    .then(result => {
      const promises = result.map(element => fetchLink(element));

      Promise.all(promises)
        .then(linksArray => {
          linksArray.forEach(element => {
            printValidateResult(element);
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
};

function handleStatsOption() {
  mdLinks(pathFile)
    .then(result => {
      printStats(result);
    })
    .catch(error => {
      console.log('Erro');
      console.error(error);
    });
};

if (option === '--stats' && process.argv.includes('--validate')) {
  handleStatsWithValidateOption();
} else if (option === '--validate') {
  handleValidateOption();
} else if (option === '--stats') {
  handleStatsOption();
} else {
  console.log(`Comando inválido.`);
}

module.exports = fetchLink,printStats,printValidateResult, printStatsWithBroken, handleStatsOption, handleStatsWithValidateOption;