/**
 * check-imports.js
 *
 * Usage:
 *  - Place at your project root (where package.json is)
 *  - Run: node check-imports.js
 *
 * Output:
 *  - import_case_report.json
 *  - import_case_report.csv
 *
 * What it does:
 *  - Walks project files (.js .jsx .ts .tsx .json)
 *  - Finds import/require/dynamic import strings
 *  - For relative (./ ../) and root (/...) imports, tries to resolve actual file
 *  - Reports case-mismatch (path exists but with different case) and not-found
 *
 * NOTE:
 *  - This is a conservative scanner using filesystem checks and simple regex parsing.
 *  - It does not parse every possible dynamic path or webpack alias; if you use aliases,
 *    run from the correct root and consider adding alias resolution rules.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EXTS = ['', '.js', '.jsx', '.ts', '.tsx', '.json', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];

const IMPORT_RE = /^\s*import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/mg;
const REQUIRE_RE = /^\s*(?:const|let|var)?\s*[^=]*=\s*require\(\s*['"]([^'"]+)['"]\s*\)/mg;
const REQUIRE_DIRECT_RE = /^\s*require\(\s*['"]([^'"]+)['"]\s*\)/mg;
const DYN_IMPORT_RE = /import\(\s*['"]([^'"]+)['"]\s*\)/mg;

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // skip node_modules and .git by default
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(p, cb);
    } else {
      cb(p);
    }
  }
}

function tryExact(candidate) {
  for (const ext of EXTS) {
    const c = candidate + ext;
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// Try to find a path that matches case-insensitively under project root
function findCaseInsensitive(relPath) {
  // Normalize and split relative to ROOT
  const parts = relPath.split(path.sep).filter(Boolean);
  let cur = ROOT;
  const matched = [];
  for (const p of parts) {
    try {
      const entries = fs.readdirSync(cur);
      // first try exact (fast)
      let found = entries.find(e => e === p);
      if (!found) {
        const lower = p.toLowerCase();
        found = entries.find(e => e.toLowerCase() === lower);
      }
      if (!found) return null;
      matched.push(found);
      cur = path.join(cur, found);
    } catch (err) {
      return null;
    }
  }
  // try extensions on the resolved path
  for (const ext of EXTS) {
    const cand = cur + ext;
    if (fs.existsSync(cand)) return cand;
  }
  return null;
}

function resolveImport(fromDir, imp) {
  if (!(imp.startsWith('.') || imp.startsWith('/'))) return { status: 'external' };
  let abs;
  if (imp.startsWith('/')) {
    abs = path.join(ROOT, imp.replace(/^\/+/, ''));
  } else {
    abs = path.resolve(fromDir, imp);
  }
  // try exact with extensions
  const exact = tryExact(abs);
  if (exact) return { status: 'exact', path: exact };

  // try case-insensitive search (walk parts)
  // compute rel path from ROOT
  let rel = path.relative(ROOT, abs);
  // if path goes above root, fallback to not-found
  if (rel.startsWith('..')) return { status: 'not-found', referenced: path.relative(ROOT, abs) };
  const found = findCaseInsensitive(rel);
  if (found) {
    return { status: 'case-mismatch', referenced: path.relative(ROOT, abs), actual: path.relative(ROOT, found) };
  }
  return { status: 'not-found', referenced: path.relative(ROOT, abs) };
}

const issues = [];

walk(ROOT, (file) => {
  const ext = path.extname(file).toLowerCase();
  if (!['.js', '.jsx', '.ts', '.tsx', '.json'].includes(ext)) return;
  // ignore this scanner file if it's in project root
  if (path.basename(file) === path.basename(__filename)) return;
  let text = '';
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    issues.push({ file: path.relative(ROOT, file), import: '', issue: 'read-error', detail: err.message });
    return;
  }
  const imports = new Set();
  let m;
  while ((m = IMPORT_RE.exec(text)) !== null) imports.add(m[1]);
  while ((m = REQUIRE_RE.exec(text)) !== null) imports.add(m[1]);
  while ((m = REQUIRE_DIRECT_RE.exec(text)) !== null) imports.add(m[1]);
  while ((m = DYN_IMPORT_RE.exec(text)) !== null) imports.add(m[1]);

  for (const imp of imports) {
    const res = resolveImport(path.dirname(file), imp);
    if (res.status === 'external' || res.status === 'exact') continue;
    if (res.status === 'case-mismatch') {
      issues.push({
        file: path.relative(ROOT, file),
        import: imp,
        issue: 'case-mismatch',
        referenced_path: res.referenced,
        actual_path: res.actual
      });
    } else if (res.status === 'not-found') {
      issues.push({
        file: path.relative(ROOT, file),
        import: imp,
        issue: 'not-found',
        referenced_path: res.referenced,
        actual_path: ''
      });
    }
  }
});

// write reports
fs.writeFileSync(path.join(ROOT, 'import_case_report.json'), JSON.stringify(issues, null, 2));
const csvLines = ['file,import,issue,referenced_path,actual_path'];
for (const r of issues) {
  const row = [
    `"${(r.file||'').replace(/"/g,'""')}"`,
    `"${(r.import||'').replace(/"/g,'""')}"`,
    `"${(r.issue||'').replace(/"/g,'""')}"`,
    `"${(r.referenced_path||'').replace(/"/g,'""')}"`,
    `"${(r.actual_path||'').replace(/"/g,'""')}"`,
  ];
  csvLines.push(row.join(','));
}
fs.writeFileSync(path.join(ROOT, 'import_case_report.csv'), csvLines.join('\n'));

console.log('Scan complete. Issues found:', issues.length);
console.log('Reports: import_case_report.json, import_case_report.csv');
if (issues.length > 0) {
  console.log('First 20 issues:');
  issues.slice(0,20).forEach((r,i)=> {
    console.log(`${i+1}. ${r.file} -> ${r.import} : ${r.issue} -> referenced: ${r.referenced_path || ''} actual: ${r.actual_path || ''}`);
  });
}
