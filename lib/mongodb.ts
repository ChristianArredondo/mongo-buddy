import { MongoClient, Db } from 'mongodb';
import { logger } from './logger';

export class MongoDb {
  private _db: Db;

  public async connect(mongoUri: string, dbName: string): Promise<void> {
    const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true });
    this._db = client.db(dbName);
    const colls = await this._db.collections();
    const availableCollections = colls
      .map(collection => (<any>collection).s.name)
      .join(', ');
    logger.mongoDetails(mongoUri, dbName, availableCollections);
    client.close();
  }
}

export const mongodb = new MongoDb();
