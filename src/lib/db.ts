import { MongoClient, type Db } from "mongodb";
import { getEnv } from "./env";
import { getMongoClientOptions } from "./mongo-options";

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient; mongoDb?: Db; mongoConnect?: Promise<void> };

export async function getDb(): Promise<Db> {
  const env = getEnv();
  if (!env.MONGODB_URI) throw new Error("MongoDB is not configured. Set MONGODB_URI before using protected APIs.");
  if (globalForMongo.mongoDb) return globalForMongo.mongoDb;
  const client = globalForMongo.mongoClient ?? new MongoClient(env.MONGODB_URI, getMongoClientOptions());
  if (!globalForMongo.mongoClient) globalForMongo.mongoClient = client;
  if (!globalForMongo.mongoConnect) {
    globalForMongo.mongoConnect = client.connect().then(() => undefined);
  }
  await globalForMongo.mongoConnect;
  globalForMongo.mongoDb = client.db(env.MONGODB_DB);
  return globalForMongo.mongoDb;
}

/** Lightweight readiness probe for health checks and deploy hooks. */
export async function pingMongo(): Promise<void> {
  const db = await getDb();
  await db.command({ ping: 1 });
}
