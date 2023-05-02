#!/usr/bin/env node
const chalk = require('chalk');
const mdLinks = require('./index.js');


const pathFile = process.argv[2];
const option = process.argv[3];

if (option === '--stats' && process.argv.includes('--validate')) {
  mdLinks(pathFile, { validate: true })
    .then(result => {
      printStatsWithBroken(result);
    })
    .catch(error => {
      console.log('Erro');
      console.error(error);
    });
} else if (option === '--validate') {
  mdLinks(pathFile, { validate: true })
    .then(result => {
      result.forEach(element => {
        printValidateResult(element);
      });
    })
    .catch(error => {
      console.log('Erro');
      console.error(error);
    });
} else if (option === '--stats') {
  mdLinks(pathFile)
    .then(result => {
      printStats(result);
    })
    .catch(error => {
      console.log('Erro');
      console.error(error);
    });
} else {
  // Se nenhuma opção for selecionada, imprime
  mdLinks(pathFile)
  .then(result => {
  result.forEach(element => {
  console.log(chalk.grey(element.file), chalk.grey(element.href), chalk.grey(element.text));
  });
  })
  .catch(error => {
  console.log('Erro');
  console.error(error);
  });
  }
  
