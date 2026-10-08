import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const roles = [
  'coordinator', 'architect', 'planner', 'implementer', 'implementer_high',
  'reviewer', 'qa', 'support',
];
const required = [
  'AGENTS.md', 'README.md', 'BACKLOG.md', 'STATUS.md', 'NEXT_STEPS.md',
  'docs/architecture.md', 'docs/AGENT_WORKFLOW.md', 'docs/templates/AGENT_TASK.md',
  '.codex/config.toml', '.agents/skills/add-sketch/SKILL.md',
  'Scripts/check-repo.mjs', '.github/workflows/repository.yml',
  ...roles.map((role) => `.codex/agents/${role}.toml`),
];
const states = new Set(['Ready', 'In progress', 'Planned', 'Blocked', 'Done', 'Deferred']);
const foreignReferences = /Endless Garden|\blimitless\b|SpacetimeDB|\bBevy\b|\bpnpm\b|\.wxt\b|add-plant-definition/i;

function guidanceFiles(root) {
  const files = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name);
  function walk(relative) {
    const directory = path.join(root, relative);
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const child = path.join(relative, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (entry.isFile() && /\.(md|toml)$/.test(entry.name)) files.push(child);
    }
  }
  for (const directory of ['docs', '.codex', '.agents']) walk(directory);
  return files;
}

// Dependency-free repository guidance checks. Full TOML parsing is a separate check.
export function checkRepository(directory) {
  const root = path.resolve(directory);
  const errors = [];
  for (const file of required) {
    if (!existsSync(path.join(root, file)) || !statSync(path.join(root, file)).isFile()) {
      errors.push(`Missing required file: ${file}`);
    }
  }
  if (!existsSync(root)) return { errors, fileCount: 0, taskCount: 0 };

  const files = guidanceFiles(root);
  for (const file of files) {
    const text = readFileSync(path.join(root, file), 'utf8');
    if (foreignReferences.test(text)) errors.push(`Copied project reference: ${file}`);
    if (/[\t ]+$/m.test(text)) errors.push(`Trailing whitespace: ${file}`);
    if (!text.endsWith('\n')) errors.push(`Missing final newline: ${file}`);
    if (file.endsWith('SKILL.md')) {
      const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const name = frontmatter?.[1].match(/^name:\s*(\S+)\s*$/m)?.[1];
      if (!name || name !== path.basename(path.dirname(file)) ||
          !/^description:\s*\S.+$/m.test(frontmatter?.[1] ?? '')) {
        errors.push(`Invalid skill entry point: ${file}`);
      }
    }
    if (!file.endsWith('.md')) continue;
    const prose = text.replace(/```[\s\S]*?```/g, '');
    for (const match of prose.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
      const target = match[1].trim().replace(/^<([^>]+)>$/, '$1');
      if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('#')) continue;
      let local;
      try {
        local = decodeURIComponent(target.split(/[?#]/)[0]);
      } catch {
        errors.push(`Invalid local link: ${file} -> ${target}`);
        continue;
      }
      const resolved = path.resolve(path.dirname(path.join(root, file)), local);
      const relative = path.relative(root, resolved);
      if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        errors.push(`Link leaves repository: ${file} -> ${target}`);
      } else if (!existsSync(resolved)) {
        errors.push(`Missing local link: ${file} -> ${target}`);
      }
    }
  }

  const tasks = new Map();
  const backlogPath = path.join(root, 'BACKLOG.md');
  if (existsSync(backlogPath)) {
    for (const line of readFileSync(backlogPath, 'utf8').split(/\r?\n/)) {
      if (!/^\|\s*[A-Z][A-Z\d]*-\d+\s*\|/.test(line)) continue;
      const [id, priority, state, dependencies, ...description] = line.split('|')
        .slice(1, -1).map((cell) => cell.trim());
      if (tasks.has(id)) errors.push(`Duplicate task: ${id}`);
      if (!['P0', 'P1', 'P2'].includes(priority)) errors.push(`Invalid priority: ${id}`);
      if (!states.has(state)) errors.push(`Invalid state: ${id} -> ${state}`);
      if (!description.join('').trim()) errors.push(`Missing completion check: ${id}`);
      const deps = dependencies === '-' ? [] : dependencies.split(',').map((dep) => dep.trim());
      tasks.set(id, { state, deps });
    }
    if (tasks.size === 0) errors.push('BACKLOG.md contains no task rows');
  }
  for (const [id, task] of tasks) {
    for (const dependency of task.deps) {
      if (!tasks.has(dependency)) errors.push(`Unknown dependency: ${id} -> ${dependency}`);
      else if (['Ready', 'In progress', 'Done'].includes(task.state) && tasks.get(dependency).state !== 'Done') {
        errors.push(`Unfinished prerequisite: ${id} -> ${dependency}`);
      }
    }
  }
  const visiting = new Set();
  const visited = new Set();
  function visit(id, trail = []) {
    if (visiting.has(id)) {
      errors.push(`Dependency cycle: ${[...trail, id].join(' -> ')}`);
      return;
    }
    if (visited.has(id) || !tasks.has(id)) return;
    visiting.add(id);
    for (const dependency of tasks.get(id).deps) visit(dependency, [...trail, id]);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of tasks.keys()) visit(id);
  return { errors, fileCount: files.length, taskCount: tasks.size };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = checkRepository(root);
  if (result.errors.length) {
    for (const error of result.errors) console.error(error);
    process.exitCode = 1;
  } else {
    console.log(`Repository check passed: ${result.fileCount} guidance files, ${result.taskCount} tasks.`);
  }
}
