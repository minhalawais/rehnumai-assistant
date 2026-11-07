import { MongoClient } from "mongodb";
import { mongoClientOptions } from "./mongo-options.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
const dbName = process.env.MONGODB_DB || "rehnumai";
const client = new MongoClient(uri, mongoClientOptions());
try {
  await client.connect();
  const db = client.db(dbName);
  await db.command({ ping: 1 });
  const host = uri.startsWith("mongodb+srv://") ? "MongoDB Atlas" : new URL(uri.replace("mongodb://", "http://")).hostname;
  console.log(`MongoDB OK (${host}, database: ${dbName})`);
} finally {
  await client.close();
}
