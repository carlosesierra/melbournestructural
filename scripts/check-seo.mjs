import { pathToFileURL } from 'node:url';
import { PRODUCTION_URL, runSeoGates } from './seo-gates.mjs';

export async function main() {
  await runSeoGates({
    baseUrl: process.env.SEO_BASE_URL ?? PRODUCTION_URL,
    checkRedirects: process.env.SEO_CHECK_REDIRECTS === 'true',
    expectedCanonical: process.env.SEO_EXPECTED_CANONICAL ?? PRODUCTION_URL,
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
