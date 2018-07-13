#!/usr/bin/env node
'use strict';
const fs = require('fs');
const mongoBuddy = require('commander');
const chalk = require('chalk');
const { mongodb } = require('../lib/mongodb');
const { logger } = require('../lib/logger');
const { createModelJson } = require('../utils/arrToModel.util')

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
  .command('model')
  .alias('m')
  .description('Construct document model used for generating mock data')
  .option('--name <name>', 'model name (required)')
  .option('--p <prop>', 'property name and type (can be multiple, i.e. --p name:string --p age:int)')
  .action(({ parent, name }) => {
    if (parent === undefined) {
      return console.error(chalk.redBright('Error:\n \nUnable to parse arguments')); // ensure only allowed arguments are used
    } else if (!name || typeof name !== 'string') {
      return console.error(chalk.redBright('Error:\n \nYou must supply a name!')); // ensure name is inputted
    }
    const args = parent.rawArgs.slice(3,);
    args.splice(args.indexOf(name) - 1, 2); // splice name and arg-string from arguments array
    try {
      const model = createModelJson(args); // use custom Array method to convert arguments to model object
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

mongoBuddy
  .command('data')
  .alias('d')
  .description('Generate mock data based on an existing JSON model')
  .option('--path <path>', 'path to JSON model (required)')
  .option('--uri [uri]', 'mongo uri', 'mongodb://localhost:27017')
  .option('--db <db>', 'database name (required)')
  .option('--coll <coll>', 'collection name (required)')
  .action(buddy => {
    // TODO
    console.log(buddy);
  });

mongoBuddy.parse(process.argv);