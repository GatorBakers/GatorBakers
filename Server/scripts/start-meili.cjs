const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

const cwd = process.cwd();
const masterKey = process.env.MEILI_API_KEY || 'aSampleMasterKey';

const binaryName = process.platform === 'win32' ? 'meilisearch.exe' : 'meilisearch';
const binaryPath = path.join(cwd, binaryName);

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error('Failed to start process:', error.message);
    process.exit(1);
  });
}

if (existsSync(binaryPath)) {
  console.log(`Starting MeiliSearch from local binary: ${binaryPath}`);
  run(binaryPath, ['--master-key', masterKey]);
} else {
  console.log('Local MeiliSearch binary not found. Falling back to Docker image...');
  run('docker', [
    'run',
    '--rm',
    '-p',
    '7700:7700',
    '-e',
    `MEILI_MASTER_KEY=${masterKey}`,
    'getmeili/meilisearch:v1.8',
  ]);
}
