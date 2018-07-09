#!/usr/bin/env node
'use strict';
const fs = require('fs');
const mongoBuddy = require('commander');
const chalk = require('chalk');
const { mongodb } = require('../lib/mongodb');
const { logger } = require('../lib/logger');

Array.prototype.toMongoBuddyModel = function() {
  const model = {}, errors = [];
  // TODO. better workflow for pulling --name and value from array
  const props = this.filter(el => el === '--p' || el.split(':').length === 2);
  for (let i = 0; i < props.length; i += 2) {
    let argStr = props[i], [prop, val, ...extras] = props[i+1].split(':');
    // TODO. consider creating error class
    if (prop && !val) {
      errors.push(`Property "${prop}" has no associated type (i.e. "${prop}:string").`);
    } else if (!prop && val) {
      errors.push(`Type "${val}" has no matching property name`);
    } else if ((extras || []).length) {
      errors.push(`Property "${prop}" has multiple associated types: ${[val, ...extras].join(':')}. Properties may only have one associated type (i.e. "${prop}:${val}").`)
    }
    model[prop] = val;
  }
  if (errors.length) {
    throw new Error(['\n', ...errors].join('\n'));
  }
  return model;
}

mongoBuddy.version('1.0.0');

mongoBuddy
  .command('check')
  .alias('c')
  .description('Verify MongoDB connection and list available collections for specified Db')
  .option('--uri [uri]', 'mongo uri', 'mongodb://localhost:27017')
  .option('--db <db>', 'database name (required)')
  .action(({ uri, db }) => {
    if (typeof db === undefined || !db || db.length === 0) {
      console.error(chalk.red('You must include a database name!'));
      process.exit(1);
    }
    mongodb.connect(uri, db);
  });

mongoBuddy
  .command('single-doc')
  .alias('sd')
  .description('Fetch a single document for a given db and collection')
  .option('--uri [uri]', 'mongo uri', 'mongodb://localhost:27017')
  .option('--db <db>', 'database name (required)')
  .option('--coll <coll>', 'collection name (required)')
  .action(({ uri, db, coll }) => {
    if (typeof db === undefined || !db || db.length === 0) {
      console.error(chalk.red('You must include a database name!'));
      process.exit(1);
    }
    if (typeof coll === undefined || !coll || coll.length === 0) {
      console.error(chalk.red('You must include a collection name!'));
      process.exit(1);
    }
    mongodb.getSingleDoc(uri, db, coll);
  });

mongoBuddy
  .command('gen-model')
  .alias('gm')
  .description('Generate document model to be used for generating mock data')
  .option('--name <name>', 'model name (required)')
  .option('--p <prop>', 'property name and type (can be multiple, i.e. --p name:string --p age:int)')
  .action(({ parent, name }) => {
    if (!(parent && name)) {
      return console.error(chalk.redBright('Unable to parse arguments. Please ensure that each property follows the syntax "prop:type".'));
    }
    const props = parent.rawArgs.slice(3,);
    if (!props.length) {
      return console.error(chalk.redBright('You must supply at least one property!'));
    } else if (props.length % 2 !== 0) {
      return console.error(chalk.redBright('You must supply a value for each property!'));
    }
    try {
      const model = props.toMongoBuddyModel(); // use custom Array method to convert arguments to model object
      const dataForFile = JSON.stringify(model, null, 2); // stringify with linebreaks for readability at file write
      const fileName = `models/${name}.json`; // name of file to be created
      if (!fs.existsSync('models')) {
        fs.mkdirSync('models'); // create `models` directory if does not exist
      }
      fs.writeFileSync(fileName, dataForFile); // create file
      const { size: fileSize } = fs.statSync(fileName); // get file size
      logger.newFile(model, fileName, fileSize); // log result
    } catch (error) {
      console.log(chalk.redBright(error));
      process.exit(1);
    }
  });

mongoBuddy.parse(process.argv);