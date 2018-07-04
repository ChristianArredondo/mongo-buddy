'use strict';
const { MongoClient } = require('mongodb');
const { logger } = require ('./logger');

class MongoDb {
  constructor() {
    this._db = null;
  }

  async connect(mongoUri, dbName) {
    const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true});
    this._db = client.db(dbName);
    const colls = await this._db.collections();
    const availableCollections = colls
      .map(collection => collection.s.name)
      .join(', ');
    console.log('Connected to MongoDB');
    logger.mongoDetails(mongoUri, dbName, availableCollections);
    client.close();
  }
}

const mongodb = new MongoDb();
module.exports = { mongodb };