import type { MongoClientOptions } from "mongodb";
import { getEnv } from "./env";

export function getMongoClientOptions(): MongoClientOptions {
  const env = getEnv();
  const fromEnv = env.MONGODB_MAX_POOL_SIZE;
  return {
    maxPoolSize: fromEnv,
    appName: "rehnumai",
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
  };
}
