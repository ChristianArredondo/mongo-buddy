#!/usr/bin/env node
'use strict';
const mongoBuddy = require('commander');
const chalk = require('chalk');
const { mongodb } = require('../lib/mongodb');

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

mongoBuddy.parse(process.argv);