const chalk = require('chalk');
const mdLinks = require('./index.js');
const fetch = require('node-fetch');

mdLinks(process.argv[2])
  .then(result => {
    const option = process.argv[3];

    if (option === '--validate') {
      const promises = result.map(element => {
        return fetch(element.href)
          .then(response => {
            element.status = response.status;
            element.statusText = response.statusText;
            return element;
          })
          .catch(error => {
            element.status = 'Fail';
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
    } else if (option === '--stats') {
      const uniqueLinks = [...new Set(result.map(element => element.href))];
      const stats = {
        total: result.length,
        unique: uniqueLinks.length,
      };
      console.log(chalk.grey('Total:'), stats.total);
      console.log(chalk.grey('Unique:'), stats.unique);
    } else if (!option) {
      result.forEach(element => {
        console.log(chalk.green('\u2714'), chalk.grey(element.file), chalk.green(element.href), chalk.grey(element.text));
      });
    } else {
      console.log(`Comando inválido.`);
    }
  })
  .catch(error => {
    console.log('veio para o catch');
    console.error(error);
  });
