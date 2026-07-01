import { randomInt } from "node:crypto";

/** Unambiguous alphabet (no 0/O/1/I) for human-friendly codes. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Generate a code like "ASF-7QK4TP" (prefix + 6 chars). */
export function newSchoolCode(): string {
  let body = "";
  for (let i = 0; i < 6; i++) body += ALPHABET[randomInt(ALPHABET.length)];
  return `ASF-${body}`;
}
