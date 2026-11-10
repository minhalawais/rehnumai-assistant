import { MongoClient } from "mongodb";
import { mongoClientOptions } from "./mongo-options.mjs";
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
  throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
}
const client = new MongoClient(uri, mongoClientOptions());
await client.connect();
const db = client.db(process.env.MONGODB_DB || "rehnumai");
await Promise.all([
  db.collection("users").createIndex({ tenantId: 1, emailNormalized: 1 }, { unique: true }),
  db.collection("sessions").createIndex({ tokenHash: 1 }, { unique: true }),
  db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  db.collection("cases").createIndex({ tenantId: 1, caseReference: 1 }, { unique: true }),
  db.collection("cases").createIndex({ tenantId: 1, clientRequestId: 1 }, { unique: true, sparse: true }),
  db.collection("cases").createIndex({ tenantId: 1, "identity.cnic": 1 }, { unique: true, name: "uniq_tenant_cnic", partialFilterExpression: { "identity.cnic": { $type: "string" } } }),
  db.collection("cases").createIndex({ tenantId: 1, "identity.passports": 1 }, { unique: true, name: "uniq_tenant_passport", partialFilterExpression: { "identity.passports.0": { $exists: true } } }),
  db.collection("publicIntakeRate").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  db.collection("loginRate").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  db.collection("cases").createIndex({ tenantId: 1, status: 1, updatedAt: -1 }),
  db.collection("cases").createIndex({ tenantId: 1, assignedUserId: 1, status: 1, updatedAt: -1 }),
  db.collection("cases").createIndex({ tenantId: 1, teamId: 1, status: 1, updatedAt: -1 }),
  db.collection("cases").createIndex({ tenantId: 1, locationId: 1, status: 1, updatedAt: -1 }),
  db.collection("cases").createIndex({ tenantId: 1, "migrationSummary.destinationCountry": 1, status: 1 }),
  db.collection("caseRevisions").createIndex({ tenantId: 1, caseId: 1, revisionNumber: 1 }, { unique: true }),
  db.collection("auditEvents").createIndex({ tenantId: 1, occurredAt: -1 }),
  db.collection("auditEvents").createIndex({ tenantId: 1, "target.id": 1, occurredAt: 1 }),
]);
console.log("rehnumai indexes ready"); await client.close();
