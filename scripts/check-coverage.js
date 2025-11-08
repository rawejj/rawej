import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coverageFile = path.join(__dirname, '../coverage/coverage-final.json');
const threshold = 90;

if (!fs.existsSync(coverageFile)) {
  console.error('Coverage report not found:', coverageFile);
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
let totalStatements = 0;
let coveredStatements = 0;

for (const file of Object.values(coverage)) {
  totalStatements += file.s['total'];
  coveredStatements += file.s['covered'];
}

const percent = (coveredStatements / totalStatements) * 100;
console.log(`Total coverage: ${percent.toFixed(2)}%`);

if (percent < threshold) {
  console.error(`Coverage ${percent.toFixed(2)}% is below required ${threshold}%`);
  process.exit(1);
}
