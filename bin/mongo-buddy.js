#!/usr/bin/env node
'use strict';
const mongoBuddy = require('commander');
const chalk = require('chalk');
const { mongodb } = require('../lib/mongodb');
const { logger } = require('../lib/logger');

Array.prototype.toMongoBuddyModel = function() {
  const model = {}, errors = [];
  for (let i = 0; i < this.length; i += 2) {
    let argStr = this[i], [prop, val, ...extras] = this[i+1].split(':');
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
  .option('--n <name>', 'model name (required)')
  .option('--p <prop>', 'property name and type (can be multiple, i.e. --p name:string --p age:int)')
  .action((a) => {
    const props = a.parent.rawArgs.slice(3,);
    if (!props.length) {
      console.error(chalk.redBright('You must supply at least one property!'));
      return;
    } else if (props.length % 2 !== 0) {
      console.error(chalk.redBright('You must supply a value for each property!'));
      return;
    }
    try {
      const model = props.toMongoBuddyModel();
      console.log(chalk.greenBright(`New model "User" successfully created!`));
      logger.json(model);
    } catch (error) {
      console.log(chalk.redBright(error));
      process.exit(1);
    }
  });

mongoBuddy.parse(process.argv);