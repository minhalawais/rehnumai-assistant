import { z } from "zod";
import { caseDraftSchema } from "./intake-schema";
import { employmentReadinessKeys, readinessItems, requiredReadinessKeys, safetySignals } from "./intake-ui";

export const publicAnswersSchema = caseDraftSchema.omit({ notes: true, attentionSignalCodes: true }).strict().superRefine((answers, context) => {
  if (!answers.contactConsent && answers.safeContactMethod !== "none") context.addIssue({ code: "custom", path: ["safeContactMethod"], message: "Contact method requires contact consent." });
  if (!answers.primaryPhone?.trim()) context.addIssue({ code: "custom", path: ["primaryPhone"], message: "Enter your mobile number." });
  const applicable = readinessItems.filter(([key]) => answers.migrationPurpose === "employment" || !employmentReadinessKeys.has(key));
  for (const [key] of applicable) if (requiredReadinessKeys.has(key) && !answers.readiness[key]) context.addIssue({ code: "custom", path: ["readiness", key], message: "Answer every applicable readiness question." });
  for (const [key] of safetySignals) if (!answers.safetyAnswers[key]) context.addIssue({ code: "custom", path: ["safetyAnswers", key], message: "Answer every safety question." });
});

export const publicSubmissionSchema = z.object({
  clientRequestId: z.uuid(),
  confirmed: z.literal(true),
  website: z.string().max(100).default(""),
  answers: publicAnswersSchema,
}).strict();
