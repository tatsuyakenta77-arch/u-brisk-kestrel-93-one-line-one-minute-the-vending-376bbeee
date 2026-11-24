// One Line, One Minute: The Vending Machine Pickup Line Contest — make.fun entry.
//
// The entry is one line, 118 characters: a pickup line a vending machine
// would use on a passing human.
//
//   You don't need exact change — one look from you and my coil spins,
//   my lights blink, and I drop my best snack for free.
//
// Why this line, against the judge's brief (most important first):
// 1. Spoken by the machine itself: first person all the way ("my coil",
//    "my lights", "I drop") — a line no stranger in a bar could say.
// 2. The machine's own world: exact change, the coil, the lights, the
//    best snack. Every noun belongs to the machine, not to love in
//    general.
// 3. The laugh lands on the last few words: a vending machine never
//    gives anything for free — that is the whole point of the machine —
//    so "for free" is the turn. The setup is the machine breaking its
//    own rules (no exact change needed); the punch is it dropping its
//    best snack for nothing.
// 4. Short and speakable: one breath, one sentence, no filler tacked on.
// 5. Charming, not creepy: the machine is generous and a little smitten,
//    offering its best snack — it flirts by giving, not by grabbing.
//
// The program writes that single line to /output/entry.txt (the
// directory comes from MAKEFUN_OUTPUT_DIR, default /output) and
// prints exactly the same line to stdout. No network, no randomness,
// no environment secrets — every run produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const line =
  "You don't need exact change — one look from you and my coil spins, my lights blink, and I drop my best snack for free.";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const MAX_CHARS = 200;
const MIN_CHARS = 1;

// The gate allows 1–200 characters of UTF-8 text, not only
// whitespace, on a single line — and the judge's first criterion is
// that the text IS a pickup line a vending machine would use on a
// passing human, so the code enforces the shape too: one line,
// inside the limit, ending with a full stop. Refuse to ship
// anything outside that: a second line would stop being one line,
// and padding past 200 characters would fail the gate outright.
function assertValidLine(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `entry line is ${text.length} characters, outside the ${MIN_CHARS}-${MAX_CHARS} limit`,
    );
  }
  if (text.trim().length === 0 || /[\r\n]/.test(text)) {
    throw new Error("entry line must be one non-blank line");
  }
  // A pickup line is a complete sentence: it ends with a full stop,
  // not a dangling clause.
  if (!text.endsWith(".")) {
    throw new Error("entry line must end with a full stop");
  }
}

assertValidLine(line);

const dst = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, line, "utf8");

// Read it back and verify the file holds exactly the line, byte for
// byte, so a partial or corrupted write can never reach the judge —
// and that its byte length matches the line's UTF-8 byte length, so
// no stray newline or encoding surprise can slip past the character
// gate. (Note: bytes and characters differ here — the em dash is
// three bytes — so the check compares against Buffer.byteLength,
// not against the character count.)
const written = readFileSync(dst, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not hold exactly the entry line");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(line, "utf8")) {
  throw new Error("entry.txt byte length does not match the entry line");
}
console.log(line);
