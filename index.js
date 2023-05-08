const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const chalk = require('chalk');

function mdLinks(pathFile, options = {}) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(pathFile);
    const fileExists = fs.existsSync(absolutePath);
    const fileSize = fs.statSync(absolutePath).size;

    if (!fileExists || fileSize === 0) {
      reject(new Error(chalk.red('\u2717') + ` O arquivo ${chalk.red(pathFile)} está vazio ou não existe.`));
    } else {
      fs.readFile(absolutePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const regex = /\[([^[\]]*)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
          const searchLinks = data.match(regex) || [];

          const links = searchLinks.map((link) => {
            const [href, text] = link.match(/\((https?:\/\/[^\s?#.].[^\s]*)\)/);
            return {
              href,
              text,
              file: absolutePath,
            };
          });

          if (options.validate) {
            const promises = links.map((link) => {
              return fetch(link.href)
                .then((response) => {
                  link.status = response.status;
                  link.statusText = response.statusText;
                  return link;
                })
                .catch((error) => {
                  link.status = error.code || 'FAIL';
                  link.statusText = error.message;
                  return link;
                });
            });

            Promise.all(promises)
              .then((result) => {
                if (options.stats) {
                  const uniqueLinks = [...new Set(result.map((link) => link.href))];
                  const stats = {
                    total: result.length,
                    unique: uniqueLinks.length,
                    broken: result.filter((link) => link.status !== 200).length,
                  };
                  resolve(stats);
                } else {
                  resolve(result);
                }
              })
              .catch((error) => {
                reject(error);
              });
          } else if (options.validateAndStats) {
            const promises = links.map((link) => {
              return fetch(link.href)
                .then((response) => {
                  link.status = response.status;
                  link.statusText = response.statusText;
                  return link;
                })
                .catch((error) => {
                  link.status = error.code || 'FAIL';
                  link.statusText = error.message;
                  return link;
                });
            });

            Promise.all(promises)
              .then((result) => {
                const uniqueLinks = [...new Set(result.map((link) => link.href))];
                const stats = {
                  total: result.length,
                  unique: uniqueLinks.length,
                  broken: result.filter((link) => link.status !== 200).length,
                };
                resolve(stats);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            if (options.stats) {
              const uniqueLinks = [...new Set(links.map((link) => link.href))];
              const stats = {
                total: links.length,
                unique: uniqueLinks.length,
              };
              resolve(stats);
            } else {
              resolve(links);
            }
          }
        }
      });
    }
  });
}

module.exports = mdLinks;
