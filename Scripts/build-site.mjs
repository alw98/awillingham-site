import { createHash } from 'node:crypto';
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const client = path.join(root, 'src/Site.Web');
const { engines: pins } = JSON.parse(readFileSync(path.join(client, 'package.json'), 'utf8'));
const dotnetSdk = JSON.parse(readFileSync(path.join(root, 'global.json'), 'utf8')).sdk.version;
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--configuration' || args[1] !== 'Release')) {
  throw new Error('Usage: node Scripts/build-site.mjs [--configuration Release]');
}
function run(command, args, cwd = root, capture = false) {
  const executable = process.platform === 'win32' && command === 'npm' ? process.execPath : command;
  const parameters = executable === process.execPath ? [path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'), ...args] : args;
  const result = spawnSync(executable, parameters, { cwd, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed (${result.status}). ${capture ? result.stderr : ''}`);
  return capture ? result.stdout.trim() : '';
}
if (process.versions.node !== pins.node) throw new Error(`Use Node ${pins.node}; found ${process.versions.node}.`);
if (run('npm', ['--version'], root, true) !== pins.npm) throw new Error(`Use npm ${pins.npm}.`);
if (run('dotnet', ['--version'], root, true) !== dotnetSdk) throw new Error(`Use .NET SDK ${dotnetSdk}.`);

function cleanOwned(relative) {
  if (!['src/Site.Server/wwwroot', '.artifacts/site/publish'].includes(relative)) throw new Error('Unowned cleanup path.');
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep) || (existsSync(target) && lstatSync(target).isSymbolicLink())) throw new Error('Unsafe output path.');
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  return target;
}
function filesIn(relative) {
  const files = [];
  const excluded = new Set(['node_modules', 'bin', 'obj', 'wwwroot', 'build', '.react-router', 'test-results', 'playwright-report', 'TestResults', 'coverage', '.agent-artifacts', '.artifacts', '.worktrees', '.git']);
  function walk(directory) {
    for (const entry of readdirSync(path.join(root, directory), { withFileTypes: true })) {
      if (excluded.has(entry.name)) continue;
      const child = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Symlink not allowed in release inputs: ${child}`);
      if (entry.isDirectory()) walk(child); else files.push(child);
    }
  }
  walk(relative);
  return files;
}
const inputs = [...filesIn('src'), ...filesIn('tests'), 'global.json', '.node-version', '.npmrc', 'Site.slnx', 'Scripts/build-site.mjs'].sort();
const fingerprint = createHash('sha256');
for (const file of inputs) fingerprint.update(file.split(path.sep).join('/')).update('\0').update(readFileSync(path.join(root, file)));

run('npm', ['ci', '--include=dev', '--strict-peer-deps', '--no-audit', '--no-fund'], client);
run('npm', ['run', 'typecheck'], client);
run('npm', ['run', 'lint'], client);
run('npm', ['test', '--', '--run'], client);
run('npm', ['run', 'build'], client);
const clientOutput = path.join(client, 'build/client');
for (const file of ['index.html', 'gallery/index.html', '__spa-fallback.html']) {
  if (!existsSync(path.join(clientOutput, file))) throw new Error(`Missing Router output: ${file}`);
}
// The client build is copied before evaluating/building the server's static items.
const webroot = cleanOwned('src/Site.Server/wwwroot');
cpSync(clientOutput, webroot, { recursive: true, filter: source => { if (lstatSync(source).isSymbolicLink()) throw new Error('Client output cannot contain symlinks.'); return true; } });
run('dotnet', ['restore', 'Site.slnx', '--locked-mode']);
run('dotnet', ['build', 'Site.slnx', '--configuration', 'Release', '--no-restore']);
run('dotnet', ['test', '--project', 'tests/Site.Server.Tests/Site.Server.Tests.csproj', '--configuration', 'Release', '--no-build']);
const publish = cleanOwned('.artifacts/site/publish');
run('dotnet', ['publish', 'src/Site.Server/Site.Server.csproj', '--configuration', 'Release', '--no-build', '--no-restore', '--output', publish]);
writeFileSync(path.join(publish, 'release.json'), JSON.stringify({ schemaVersion: 1, sourceSha256: fingerprint.digest('hex'), node: pins.node, dotnetSdk: dotnetSdk }, null, 2) + '\n');
console.log(`Release artifact ready: ${publish}`);
