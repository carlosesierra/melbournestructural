import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { PRODUCTION_URL, runSeoGates } from './seo-gates.mjs';

const LOCAL_URL = 'http://127.0.0.1:3000/';

async function waitForServer(url, serverProcess) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready with code ${serverProcess.exitCode}.`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}.`);
}

async function stopServer(serverProcess) {
  if (serverProcess.exitCode !== null) return;

  serverProcess.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => serverProcess.once('exit', resolve)),
    delay(5000),
  ]);

  if (serverProcess.exitCode === null) {
    serverProcess.kill('SIGKILL');
  }
}

const serverProcess = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3000'],
  {
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: 'inherit',
  }
);

try {
  await waitForServer(LOCAL_URL, serverProcess);
  await runSeoGates({
    baseUrl: LOCAL_URL,
    expectedCanonical: PRODUCTION_URL,
  });
} finally {
  await stopServer(serverProcess);
}
