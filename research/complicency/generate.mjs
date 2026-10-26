#!/usr/bin/env node
/** Deterministic offline fixture generator; no Observatory DB or network needed. */
import { writeFile } from 'node:fs/promises';
import { generateCases, jsonl } from './pairs.mjs';

function parseArgs(argv) {
  const out = { seed: 41, repetitions: 1, path: null };
  for (let i = 0; i < argv.length; i += 2) {
    if (i + 1 >= argv.length) throw new Error('missing value for ' + argv[i]);
    const [name, value] = [argv[i], argv[i + 1]];
    if (name === '--seed') out.seed = Number(value);
    else if (name === '--repetitions') out.repetitions = Number(value);
    else if (name === '--out') out.path = value;
    else throw new Error('unknown option ' + name);
  }
  return out;
}

try {
  const { seed, repetitions, path } = parseArgs(process.argv.slice(2));
  const contents = jsonl(generateCases({ seed, repetitions }));
  if (path) await writeFile(path, contents, 'utf8');
  else process.stdout.write(contents);
} catch (error) {
  process.stderr.write('Fixture generation error: ' + error.message + '\n');
  process.exitCode = 1;
}
