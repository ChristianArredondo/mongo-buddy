'use strict';
const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const { logger } = require ('./logger');

class MongoDb {

  /**
   * Connects against specified MongoDB URI and database name and logs results
   * - logs confirmation for URI connection
   * - logs confirmation for database connection
   * - logs available collections within database
   * @argument mongoUri: string = server location
   * @argument dbName: string = database name
   */
  async connect(mongoUri, dbName) {
    const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true});
    const colls = await client.db(dbName).collections();
    const availableCollections = colls
      .map(collection => collection.s.name)
      .join(', ');
    logger.mongoDetails(mongoUri, dbName, availableCollections);
    client.close();
  }

  /**
   * Queries specified MongoDB collection for one documet and logs results
   * - logs confirmation for database connection
   * - logs queried collection name
   * - logs single document if successful
   * 
   * @argument mongoUri: string = server location
   * @argument dbName: string = database name
   * @argument coll: string = collection name
   */
  async getSingleDoc(mongoUri, dbName, coll) {
    const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true});
    const doc = await client.db(dbName).collection(coll).find().toArray().then(docs => docs[0]);
    logger.collectionSingle(doc, dbName, coll);
    client.close();
  }
}

module.exports = { mongodb: new MongoDb() };