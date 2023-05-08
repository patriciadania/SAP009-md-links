#!/usr/bin/env node
const chalk = require('chalk');
const { mdLinks, validateAndStats } = require('./index');
const path = require('path');

const pathFile = process.argv[2];
const options = {
  validate: process.argv.includes('--validate') || process.argv.includes('-v'),
  stats: process.argv.includes('--stats') || process.argv.includes('-s'),
  validateAndStats: process.argv.includes('--validate') && process.argv.includes('--stats'),
};

function printLinks(links) {
  links.forEach((link) => {
    const statusColor =
      link.status === 'FAIL' || link.status >= 400 ? chalk.red : chalk.green;
    const status = link.status === undefined ? '' : ` ${link.status} ${statusColor(link.statusText || '')}`;
    const output = `${chalk.blue(link.file)} ${chalk.cyan(link.href)}${status}`;
    console.log(output);
  });
}

if (options.validateAndStats) {
  validateAndStats(pathFile, options)
    .then((result) => {
      console.log(chalk.blue(`Total: ${result.total}`));
      console.log(chalk.cyan(`Unique: ${result.unique}`));
      console.log(chalk.green(`OK: ${result.ok}`));
      console.log(chalk.red(`Broken: ${result.broken}`));
    })
    .catch((error) => {
      if (error.code === 'ENOENT') {
        console.error(chalk.red(`File or directory "${path.relative(process.cwd(), pathFile)}" does not exist`));
      } else {
        console.error(chalk.red(error.message));
      }
    });
} else {
  mdLinks(pathFile, options)
    .then((result) => {
      if (result.length === 0) {
        console.log(chalk.yellow('No links found in file or directory'));
      } else if (options.stats) {
        console.log(chalk.blue(`Total: ${result.total}`));
        console.log(chalk.cyan(`Unique: ${result.unique}`));
      } else {
        printLinks(result.links);
      }
    })
    .catch((error) => {
      if (error.code === 'ENOENT') {
        console.error(chalk.red(`File or directory "${path.relative(process.cwd(), pathFile)}" does not exist`));
      } else {
        console.error(chalk.red(error.message));
      }
    });
}
