import chalk from 'chalk';

export class Logger {

  public divider(): void {
    console.log(chalk.grey('==============================================='));
  }

  public breakLine(): void {
    console.log('\n');
  }

  public mongoDetails(mongoUri: string, dbName: string, collections: string) {
    this.divider();
    this.breakLine();
    console.log(chalk.greenBright(`Successfully connected to: ${chalk.magentaBright.bold(mongoUri)}`));
    console.log(chalk.greenBright(`Database in use: ${chalk.yellow.bold(dbName)}`));
    console.log(chalk.greenBright(`Available collections: ${chalk.cyanBright.bold(collections)}`));
    this.breakLine();
    this.divider();
  }

}

export const logger = new Logger();
