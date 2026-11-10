import { z } from "zod";
import { caseDraftSchema } from "./intake-schema";

export const publicAnswersSchema = caseDraftSchema.strict();

export const publicSubmissionSchema = z
  .object({
    clientRequestId: z.uuid(),
    confirmed: z.literal(true),
    website: z.string().max(100).default(""),
    answers: publicAnswersSchema,
  })
  .strict();
