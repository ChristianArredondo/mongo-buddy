#!/usr/bin/env node
'use strict';
const program = require('commander');
const { mongodb } = require('../lib/mongodb');
const chalk = require('chalk');

program.version('1.0.0');

program
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

program.parse(process.argv);