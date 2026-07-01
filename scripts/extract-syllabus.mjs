// One-off extractor: pull the DATA object out of the temp syllabus HTML and
// emit a typed TS module. Run with: node scripts/extract-syllabus.mjs
import { readFile, writeFile } from "node:fs/promises";

const SRC = "temp/asf_verified_syllabus_all_subjects (1).html";
const OUT = "src/features/syllabus/data.ts";

const html = await readFile(SRC, "utf8");

// Isolate `const DATA = { ... };` via brace counting (nested braces safe).
const start = html.indexOf("const DATA =");
if (start === -1) throw new Error("DATA not found");
const objStart = html.indexOf("{", start);
let depth = 0;
let end = -1;
for (let i = objStart; i < html.length; i++) {
  const ch = html[i];
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
if (end === -1) throw new Error("Unbalanced braces");

const objLiteral = html.slice(objStart, end);
// Evaluate the JS object literal into a real object.
const DATA = new Function(`return (${objLiteral});`)();

// Normalise subject keys fa/ci/ai -> FIA/CIA/AIA
const map = { fa: "FIA", ci: "CIA", ai: "AIA" };
const normalised = {};
for (const [k, v] of Object.entries(DATA)) normalised[map[k] ?? k.toUpperCase()] = v;

const banner = `/**
 * Class-wise syllabus data (verified source) — 30 combinations
 * (Classes 1-10 x FIA/CIA/AIA). Each class has age band, level, theme, a focus
 * rationale, why/avoid notes, and 5 units of detailed topics.
 *
 * Generated from the verified syllabus source. Kept as data (not JSX) so it's
 * easy to edit and could later be served from the database/CMS.
 */

export type SubjectKey = "FIA" | "CIA" | "AIA";

export type SyllabusUnit = {
  n: string;
  t: string;
  topics: string[];
};

export type SyllabusClass = {
  cls: number;
  age: string;
  level: string;
  theme: string;
  focus: string;
  why: string;
  avoid: string;
  units: SyllabusUnit[];
};

export const SUBJECT_META: Record<SubjectKey, { name: string; short: string }> = {
  FIA: { name: "Financial Intelligence", short: "FIA" },
  CIA: { name: "Cyber Intelligence", short: "CIA" },
  AIA: { name: "Artificial Intelligence", short: "AIA" },
};

export const SUBJECT_ORDER: SubjectKey[] = ["FIA", "CIA", "AIA"];
export const CLASS_ORDER = Array.from({ length: 10 }, (_, i) => i + 1);

export function tierForClass(cls: number): string {
  if (cls <= 2) return "Foundational";
  if (cls <= 5) return "Elementary";
  if (cls <= 8) return "Intermediate";
  return "Advanced";
}
`;

// Keep only the fields we use (drop presentational color/light/dot).
const clean = {};
for (const [subj, classes] of Object.entries(normalised)) {
  clean[subj] = classes.map((c) => ({
    cls: c.cls,
    age: c.age,
    level: c.level,
    theme: c.theme,
    focus: c.focus,
    why: c.why,
    avoid: c.avoid,
    units: c.units.map((u) => ({ n: u.n, t: u.t, topics: u.topics })),
  }));
}

const body = `\nexport const SYLLABUS: Record<SubjectKey, SyllabusClass[]> = ${JSON.stringify(
  clean,
  null,
  2
)};\n`;

await writeFile(OUT, banner + body, "utf8");
console.log("Wrote", OUT);
for (const [s, cs] of Object.entries(clean)) console.log(s, cs.length, "classes");
