#!/usr/bin/env node
'use strict';
const fs = require('fs');
const mongoBuddy = require('commander');
const chalk = require('chalk');
const { mongodb } = require('../lib/mongodb');
const { logger } = require('../lib/logger');

Array.prototype.toMongoBuddyModel = function() {
  const model = {}, errors = [];
  const props = this.filter(el => el === '--p' || el.includes(':'));
  if (!props.length) {
    errors.push('You must supply at least one property-type pair!');
  } else if (props.length % 2 !== 0) {
    errors.push('You must supply a property:type pair for each argument! (i.e. "name:string").');
  } else {
    for (let i = 0; i < props.length; i += 2) {
      let [prop, type, ...extras] = props[i+1].split(':');
      if (prop && !type) {
        errors.push(`Property "${prop}" has no associated type (i.e. "${prop}:string").`);
      } else if (type && !prop) {
        errors.push(`Type "${type}" has no matching property name (i.e. "foo:${type}").`);
      } else if ((extras || []).length) {
        errors.push(`Property "${prop}" has multiple associated types: "${[type, ...extras].join(':')}". Properties may only have one associated type (i.e. "${prop}:${type}").`)
      }
      model[prop] = type;
    }
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
  .description('Construct document model used for generating mock data')
  .option('--name <name>', 'model name (required)')
  .option('--p <prop>', 'property name and type (can be multiple, i.e. --p name:string --p age:int)')
  .action(({ parent, name }) => {
    if (parent === undefined) {
      return console.error(chalk.redBright('Error:\n \nUnable to parse arguments')); // ensure only allowed arguments are used
    } else if (!name || typeof name !== 'string') {
      return console.error(chalk.redBright('Error:\n \nYou must supply a name!')); // ensure name is inputted
    }
    const props = parent.rawArgs.slice(3,);
    props.splice(props.indexOf(name) - 1, 2); // splice name from arguments
    try {
      const model = props.toMongoBuddyModel(); // use custom Array method to convert arguments to model object
      const dataForFile = JSON.stringify(model, null, 2); // stringify with linebreaks for better readability at file
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