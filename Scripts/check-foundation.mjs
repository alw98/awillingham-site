import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Source-inventory guard for the frozen migration contract, not a product test.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const inventory = JSON.parse(read('docs/contracts/legacy-gallery.json'));
const toolchain = JSON.parse(read('docs/contracts/foundation-toolchain.json'));
// This frozen URL map is shared by the live client/server; no retired source is needed.
const expected = [
  ['tetris.classic', 'tetris', 'Tetris'],
  ['stained-glass.default', 'stained-glass', 'StainedGlass'],
  ['snow-globe.default', 'snow-globe', 'SnowGlobe'],
  ['skyscrapers.improved', 'skyscrapers', 'SkyscrapersImproved'],
  ['particle-field.particles', 'particle-field', 'ParticleField'],
  ['fireworks.default', 'fireworks', 'Fireworks'],
  ['times-tables.animated', 'times-tables-animated', 'TimesTables'],
  ['edge-detection.agate', 'edge-detection-agate', 'AgateSimpleEdgeDetection'],
  ['edge-detection.default', 'edge-detection', 'SimpleSimpleEdgeDetection'],
  ['particle-field.flow', 'flow-field', 'FlowField'],
  ['particle-field.drawn', 'drawn-field', 'DrawnField'],
  ['times-tables.static', 'times-tables-static', 'TimesTables'],
  ['sine-sums.harmonic', 'sine-sums', 'SinSums'],
  ['sine-sums.mixed', 'sine-sums-mixed', 'SinSums2'],
  ['bouncy-dvd.default', 'bouncy-dvd', 'BouncyDVD'],
];
assert.deepEqual(inventory.presets.map(({ presetId, slug, legacyName }) => [presetId, slug, legacyName]), expected, 'Public gallery compatibility drift');
assert.equal(new Set(inventory.presets.map(preset => preset.presetId)).size, 15);
assert.equal(new Set(inventory.presets.map(preset => preset.slug)).size, 15);
for (const preset of inventory.presets) {
  assert.match(preset.sketchId, /^[a-z][a-z0-9-]*$/);
  assert.match(preset.presetId, /^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/);
  assert.match(preset.slug, /^[a-z][a-z0-9-]*$/);
  assert(read('BACKLOG.md').includes(`| ${preset.portTicket} |`), `Unknown port owner: ${preset.portTicket}`);
}

const names = inventory.presets.map((preset) => preset.legacyName);
assert.equal(new Set(names).size, 14);
assert.deepEqual(names.filter((name, i) => names.indexOf(name) !== i), ['TimesTables']);
assert.equal(inventory.presets.find((preset) => preset.legacyName === 'TimesTables').presetId, 'times-tables.animated');
assert(inventory.presets.some((preset) => preset.legacyName === 'BouncyDVD'));

const exactVersion = /^\d+\.\d+\.\d+$/;
for (const value of [toolchain.dotnetSdk, toolchain.dotnetRuntime, toolchain.node, toolchain.npm,
  ...Object.values(toolchain.dependencies), ...Object.values(toolchain.devDependencies),
  ...Object.values(toolchain.testPackages)]) assert.match(value, exactVersion);
for (const name of ['react-dom', '@types/react', '@types/react-dom']) {
  assert.equal(toolchain.dependencies[name] ?? toolchain.devDependencies[name], toolchain.dependencies.react);
}
for (const name of ['@react-router/dev', '@react-router/node']) {
  assert.equal(toolchain.dependencies[name] ?? toolchain.devDependencies[name], toolchain.dependencies['react-router']);
}
assert(!('@types/react-router-dom' in toolchain.devDependencies));

const client = JSON.parse(read('src/Site.Web/package.json'));
const lock = JSON.parse(read('src/Site.Web/package-lock.json'));
assert.deepEqual(client.dependencies, toolchain.dependencies, 'Client dependency drift');
assert.deepEqual(client.devDependencies, toolchain.devDependencies, 'Client development dependency drift');
assert.equal(client.engines.node, toolchain.node);
assert.equal(client.engines.npm, toolchain.npm);
assert.equal(client.packageManager, `npm@${toolchain.npm}`);
assert.equal(lock.lockfileVersion, 3);
for (const section of ['dependencies', 'devDependencies']) {
  assert.deepEqual(lock.packages[''][section], client[section], `Lock root drift: ${section}`);
  for (const [name, version] of Object.entries(client[section])) {
    assert.equal(lock.packages[`node_modules/${name}`].version, version, `Lock pin drift: ${name}`);
  }
}
const sdk = JSON.parse(read('global.json'));
assert.equal(sdk.sdk.version, toolchain.dotnetSdk);
assert.equal(sdk.sdk.rollForward, 'disable');
assert.equal(sdk.test.runner, 'Microsoft.Testing.Platform');
assert.equal(read('.node-version').trim(), toolchain.node);
const backendTests = read('tests/Site.Server.Tests/Site.Server.Tests.csproj');
const backendLock = JSON.parse(read('tests/Site.Server.Tests/packages.lock.json'));
for (const [name, version] of Object.entries(toolchain.testPackages)) {
  assert(backendTests.includes(`Include="${name}" Version="${version}"`));
  assert.equal(backendLock.dependencies['net10.0'][name]?.resolved, version);
}

const solutionProjects = [...read('Site.slnx').matchAll(/<Project Path="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(solutionProjects, ['src/Site.Server/Site.Server.csproj', 'tests/Site.Server.Tests/Site.Server.Tests.csproj'], 'Unexpected solution project');
for (const project of solutionProjects) assert(existsSync(path.join(root, project)), `Missing project: ${project}`);
for (const output of ['.agent-artifacts', '.artifacts', '.worktrees', '.git', 'TestResults', 'coverage']) {
  assert(read('Scripts/build-site.mjs').includes(`'${output}'`), `Generated output enters source fingerprint: ${output}`);
  assert(read('.dockerignore').includes(`**/${output}/**`), `Generated output enters Docker context: ${output}`);
}
for (const retired of ['awillingham-site.csproj', 'awillingham-site.sln', 'Program.cs', 'Web', 'Views', 'Controllers', 'Extensions', 'Config', 'Properties', '_config', 'DevOps', 'wwwroot', 'appspec.yml', 'appsettings.json', 'appsettings.Development.json', 'Scripts/build.sh', 'Scripts/install_dependencies.sh', 'Scripts/start_server.sh', 'Scripts/start_services.sh', 'Scripts/stop_services.sh']) {
  assert(!existsSync(path.join(root, retired)), `Retired entry point has returned: ${retired}`);
}
console.log('Foundation check passed: 15 presets, 14 old URLs, exact pins, current solution and no retired entry points.');
