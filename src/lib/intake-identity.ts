/** Comparable identity values for public intake. Empty values are not keys. */

export function normalizeCnic(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizePassport(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function identityFromAnswers(answers: { cnic?: string; passportNo?: string; passportNoAlt?: string }) {
  const cnic = normalizeCnic(answers.cnic ?? "");
  const passports = [...new Set([normalizePassport(answers.passportNo ?? ""), normalizePassport(answers.passportNoAlt ?? "")].filter(Boolean))];
  return { cnic, passports };
}

/** Matches a CNIC stored with spaces or dashes between the same digits. */
export function cnicMatchPattern(cnic: string) {
  return `^\\D*${cnic.split("").join("\\D*")}\\D*$`;
}

/** Matches a passport stored with spaces or dashes, in either letter case. */
export function passportMatchPattern(passport: string) {
  const escaped = passport.split("").map(character => character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return `^[\\s-]*${escaped.join("[\\s-]*")}[\\s-]*$`;
}
