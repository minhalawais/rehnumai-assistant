/** Shared MongoClient options for local MongoDB and MongoDB Atlas (mongodb+srv). */
export function mongoClientOptions() {
  const maxPoolSize = Number(process.env.MONGODB_MAX_POOL_SIZE || 20);
  return {
    maxPoolSize: Number.isFinite(maxPoolSize) && maxPoolSize > 0 ? maxPoolSize : 20,
    appName: "rehnumai",
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
  };
}
