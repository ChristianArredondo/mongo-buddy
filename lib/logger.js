'use strict';

const chalk = require('chalk');

class Logger {

  divider() {
    console.log(chalk.grey('==============================================='));
  }

  breakLine() {
    console.log('\n');
  }

  error(message) {
    console.error(chalk.redBright(message));
  }

  mongoDetails(mongoUri, dbName, collections) {
    this.divider();
    this.breakLine();
    console.log(chalk.greenBright(`Successfully connected to: ${chalk.magentaBright.bold(mongoUri)}`));
    console.log(chalk.greenBright(`Database in use: ${chalk.yellow.bold(dbName)}`));
    console.log(chalk.greenBright(`Available collections: ${chalk.cyanBright.bold(collections)}`));
    this.breakLine();
    this.divider();
  }

}

module.exports = { logger: new Logger() };