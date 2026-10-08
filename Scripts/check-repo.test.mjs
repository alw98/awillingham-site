import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { checkRepository } from './check-repo.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function fixture(t) {
  const parent = realpathSync(tmpdir());
  const root = mkdtempSync(path.join(parent, 'gallery-repo-check-'));
  t.after(() => {
    const resolved = realpathSync(root);
    if (path.dirname(resolved) !== parent || !path.basename(resolved).startsWith('gallery-repo-check-')) {
      throw new Error('Refusing cleanup outside the owned temporary fixture');
    }
    rmSync(resolved, { recursive: true });
  });
  for (const file of ['AGENTS.md', 'README.md', 'BACKLOG.md', 'STATUS.md', 'NEXT_STEPS.md',
    'docs', '.codex', '.agents', '.github', 'Scripts/check-repo.mjs', 'Scripts/check-foundation.mjs']) {
    cpSync(path.join(source, file), path.join(root, file), { recursive: true });
  }
  // Guidance now links directly to implementation and editor task files. Copy
  // those targets too, without copying generated outputs or dependency trees.
  const visit = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { visit(file); continue; }
      if (!entry.name.endsWith('.md')) continue;
      for (const match of readFileSync(file, 'utf8').matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
        const link = match[1].split(/[?#]/)[0];
        if (!link || /^[a-z][a-z\d+.-]*:/i.test(link)) continue;
        const target = path.resolve(path.dirname(file), decodeURIComponent(link));
        const relative = path.relative(root, target);
        if (relative.startsWith('..') || path.isAbsolute(relative)) continue;
        const original = path.join(source, relative);
        if (existsSync(original) && !existsSync(target)) {
          mkdirSync(path.dirname(target), { recursive: true }); cpSync(original, target, { recursive: true });
        }
      }
    }
  };
  visit(root);
  return root;
}
function replace(root, file, before, after) {
  const target = path.join(root, file);
  const text = readFileSync(target, 'utf8');
  assert.ok(text.includes(before), `Fixture input exists: ${file}`);
  writeFileSync(target, text.replace(before, after));
}

function replaceDependency(root, id, dependency) {
  const file = path.join(root, 'BACKLOG.md');
  const text = readFileSync(file, 'utf8');
  const row = text.split(/\r?\n/).find((line) => line.startsWith(`| ${id} |`));
  assert.ok(row, `Fixture task exists: ${id}`);
  const cells = row.split('|');
  cells[4] = ` ${dependency} `;
  writeFileSync(file, text.replace(row, cells.join('|')));
}

test('current guidance is a valid baseline', (t) => {
  assert.deepEqual(checkRepository(fixture(t)).errors, []);
});
test('a broken local documentation link fails', (t) => {
  const root = fixture(t);
  const readme = path.join(root, 'README.md');
  writeFileSync(readme, readFileSync(readme, 'utf8') + '\n[Missing guide](docs/missing.md)\n');
  assert.ok(checkRepository(root).errors.some((error) => error.includes('Missing local link')));
});
test('a dependency on a nonexistent ticket fails', (t) => {
  const root = fixture(t);
  replaceDependency(root, 'M1-02', 'UNKNOWN-99');
  assert.ok(checkRepository(root).errors.some((error) => error.includes('Unknown dependency')));
});
test('a cycle in the milestone graph fails', (t) => {
  const root = fixture(t);
  replaceDependency(root, 'M1-02', 'M1-04');
  assert.ok(checkRepository(root).errors.some((error) => error.includes('Dependency cycle')));
});
test('a task cannot become ready ahead of its prerequisites', (t) => {
  const root = fixture(t);
  replace(root, 'BACKLOG.md', '| M3-08 | P1 | Planned |', '| M3-08 | P1 | Ready |');
  assert.ok(checkRepository(root).errors.some((error) => error.includes('Unfinished prerequisite')));
});
