import fs from 'fs';
import path from 'path';

console.log('cwd', process.cwd());
console.log('fs keys', Object.keys(fs).length);

const root = 'src';
const files = [];

function walk(dir) {
  console.log('walking', dir);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      console.log('adding file', full);
      files.push(full);
    }
  }
}
walk(root);
console.log('files discovered', files.length);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let updated = content;
  if (content.includes('motion/react')) {
    console.log('contains motion/react before', file);
  }
  updated = updated.replace(/(['"])motion\/react\1/g, (_match, quote) => `${quote}framer-motion${quote}`);
  updated = updated.replace(/@\d+\.\d+\.\d+/g, '');
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log('updated', file);
  }
}
