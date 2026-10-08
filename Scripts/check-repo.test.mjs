import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
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
    'docs', '.codex', '.agents', '.github', 'Scripts/check-repo.mjs']) {
    cpSync(path.join(source, file), path.join(root, file), { recursive: true });
  }
  return root;
}
function replace(root, file, before, after) {
  const target = path.join(root, file);
  const text = readFileSync(target, 'utf8');
  assert.ok(text.includes(before), `Fixture input exists: ${file}`);
  writeFileSync(target, text.replace(before, after));
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
  replace(root, 'BACKLOG.md', '| M1-02 | P0 | Planned | M1-01 |', '| M1-02 | P0 | Planned | UNKNOWN-99 |');
  assert.ok(checkRepository(root).errors.some((error) => error.includes('Unknown dependency')));
});
test('a cycle in the milestone graph fails', (t) => {
  const root = fixture(t);
  replace(root, 'BACKLOG.md', '| M1-02 | P0 | Planned | M1-01 |', '| M1-02 | P0 | Planned | M1-04 |');
  assert.ok(checkRepository(root).errors.some((error) => error.includes('Dependency cycle')));
});
test('a task cannot become ready ahead of its prerequisites', (t) => {
  const root = fixture(t);
  replace(root, 'BACKLOG.md', '| M1-04 | P0 | Planned |', '| M1-04 | P0 | Ready |');
  assert.ok(checkRepository(root).errors.some((error) => error.includes('Unfinished prerequisite')));
});
