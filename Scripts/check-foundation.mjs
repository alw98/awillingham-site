import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Dependency pins and build boundaries; gallery behavior is tested with the client.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const client = JSON.parse(read('src/Site.Web/package.json'));
const lock = JSON.parse(read('src/Site.Web/package-lock.json'));
const sdk = JSON.parse(read('global.json'));

const exactVersion = /^\d+\.\d+\.\d+$/;
for (const value of [sdk.sdk.version, client.engines.node, client.engines.npm,
  ...Object.values(client.dependencies), ...Object.values(client.devDependencies)]) assert.match(value, exactVersion);
for (const name of ['react-dom', '@types/react', '@types/react-dom']) {
  assert.equal(client.dependencies[name] ?? client.devDependencies[name], client.dependencies.react);
}
for (const name of ['@react-router/dev', '@react-router/node']) {
  assert.equal(client.dependencies[name] ?? client.devDependencies[name], client.dependencies['react-router']);
}
assert(!('@types/react-router-dom' in client.devDependencies));
assert.equal(client.packageManager, `npm@${client.engines.npm}`);
assert.equal(lock.lockfileVersion, 3);
for (const section of ['dependencies', 'devDependencies']) {
  assert.deepEqual(lock.packages[''][section], client[section], `Lock root drift: ${section}`);
  for (const [name, version] of Object.entries(client[section])) {
    assert.equal(lock.packages[`node_modules/${name}`].version, version, `Lock pin drift: ${name}`);
  }
}
assert.equal(sdk.sdk.rollForward, 'disable');
assert.equal(sdk.test.runner, 'Microsoft.Testing.Platform');
assert.equal(read('.node-version').trim(), client.engines.node);
assert(read('Dockerfile').includes(`FROM node:${client.engines.node}-`));
assert(read('Dockerfile').includes(`FROM mcr.microsoft.com/dotnet/sdk:${sdk.sdk.version}@`));
const backendTests = read('tests/Site.Server.Tests/Site.Server.Tests.csproj');
const backendLock = JSON.parse(read('tests/Site.Server.Tests/packages.lock.json'));
for (const [, name, version] of backendTests.matchAll(/<PackageReference Include="([^"]+)" Version="([^"]+)"/g)) {
  assert.match(version, exactVersion);
  assert.equal(backendLock.dependencies['net10.0'][name]?.resolved, version);
}

const solutionProjects = [...read('Site.slnx').matchAll(/<Project Path="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(solutionProjects, ['src/Site.Server/Site.Server.csproj', 'tests/Site.Server.Tests/Site.Server.Tests.csproj'], 'Unexpected solution project');
for (const project of solutionProjects) assert(existsSync(path.join(root, project)), `Missing project: ${project}`);
for (const output of ['.agent-artifacts', '.artifacts', '.worktrees', '.git', 'TestResults', 'coverage']) {
  assert(read('Scripts/build-site.mjs').includes(`'${output}'`), `Generated output enters source fingerprint: ${output}`);
  assert(read('.dockerignore').includes(`**/${output}/**`), `Generated output enters Docker context: ${output}`);
}
console.log('Toolchain and build configuration checks passed.');
