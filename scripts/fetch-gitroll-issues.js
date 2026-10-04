// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const BASE = 'https://gitroll.io/api/repo-scan/K27aUlXJGUTyE9OLcVeZ/issues';

(async () => {
  const all = [];
  let p = 1;
  const ps = 500;
  let total = Infinity;

  while ((p - 1) * ps < total) {
    const res = await fetch(`${BASE}?p=${p}&ps=${ps}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} on page ${p}`);
    const data = await res.json();
    total = data.total;
    all.push(...data.issues);
    console.log(`Fetched page ${p} (${data.issues.length} issues, total ${total})`);
    p++;
  }

  const bugs = all.filter((i) => i.type === 'BUG');
  const smells = all.filter((i) => i.type === 'CODE_SMELL');
  console.log(`Bugs: ${bugs.length}, Code smells: ${smells.length}, Total: ${all.length}`);

  const lines = [
    `# GitRoll Bugs Report — rishabhx29.portfolio`,
    ``,
    `Scan: https://gitroll.io/result/repo/Apd5G4f6aQhW111hVa2E`,
    `Total issues: ${all.length} — Bugs: ${bugs.length}, Code smells: ${smells.length}`,
    ``,
    `| # | File | Line | Message | Severity |`,
    `|---|------|------|---------|----------|`,
  ];

  bugs.forEach((b, i) => {
    const file = b.component.split(':').slice(1).join(':');
    const line = b.textRange ? b.textRange.startLine : '?';
    const msg = b.message.replace(/\|/g, '\\|');
    lines.push(`| ${i + 1} | ${file} | ${line} | ${msg} | ${b.severity} |`);
  });

  fs.writeFileSync('gitroll-bugs.md', lines.join('\n') + '\n');
  fs.writeFileSync('gitroll-all-issues.json', JSON.stringify(all, null, 2));
  console.log('Wrote gitroll-bugs.md and gitroll-all-issues.json');
})();
