import { z } from "zod";

const mongodbUri = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"), {
    message: "MONGODB_URI must start with mongodb:// or mongodb+srv://",
  });

const serverEnvSchema = z.object({
  MONGODB_URI: mongodbUri.optional(),
  MONGODB_DB: z.string().min(1).default("rehnumai"),
  MONGODB_MAX_POOL_SIZE: z.coerce.number().int().min(1).max(200).default(20),
  SESSION_COOKIE_NAME: z.string().min(1).default("rehnumai_session"),
  SESSION_SECRET: z.string().min(32).optional(),
  PUBLIC_INTAKE_TENANT_ID: z.string().min(1).default("demo-tenant"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type AppEnv = z.infer<typeof serverEnvSchema>;

export function getEnv(): AppEnv {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
  if (parsed.data.NODE_ENV === "production" && (!parsed.data.MONGODB_URI || !parsed.data.SESSION_SECRET)) throw new Error("MONGODB_URI and SESSION_SECRET are required in production.");
  return parsed.data;
}
