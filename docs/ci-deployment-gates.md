# CI and deployment gates

## What is enforced

The `CI` workflow runs for pull requests, pushes to `main`, and manual dispatches. It blocks on:

- frozen-lockfile installation;
- ESLint errors;
- TypeScript errors;
- test failures;
- high or critical production dependency vulnerabilities;
- production build failures;
- rendered homepage SEO invariant failures; and
- Lighthouse SEO, FCP, Speed Index, CLS, and transfer-budget failures.

The daily `Production SEO monitor` checks the deployed site for:

- a `200` homepage;
- permanent HTTP and apex-domain redirects;
- the expected canonical URL;
- absence of `noindex`;
- exactly one H1;
- required server-rendered content;
- a crawlable `robots.txt`; and
- a sitemap containing the canonical homepage.

The production monitor will fail until the canonical, robots, and sitemap changes in this branch have been deployed.

## Local commands

Run the same gates locally after a production build:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm audit --prod --audit-level high
pnpm build
pnpm check:seo
pnpm check:lighthouse
```

`pnpm check:seo` and `pnpm check:lighthouse` start a local production server. Lighthouse reports are written to the ignored `.lighthouseci` directory.

## Required GitHub configuration

In the repository's GitHub settings, create a branch ruleset for `main` with:

1. Require a pull request before merging.
2. Require status checks to pass.
3. Select `Validate, build, and SEO gates` as a required check.
4. Require branches to be up to date before merging.
5. Block force pushes and branch deletion.
6. Limit bypass permission to designated repository administrators.

Without this ruleset, the workflow reports failures but cannot prevent a direct push to `main`.

## Required Vercel configuration

Keep `main` as the Vercel production branch. With the GitHub ruleset above, only commits that passed the required pull-request check can reach the branch that triggers a production deployment.

Preview deployments may still be created before CI completes. They are intentionally emitted with `noindex` and a site-wide robots disallow. Production emits `index, follow`, the canonical URL, and a crawlable robots file.

## Gate status and planned tightening

The dependency-security work package removed the known high findings, so the
production dependency audit now blocks both `high` and `critical` findings.

One threshold remains intentionally transitional:

- The current animated/video hero produces `NO_LCP` in local Lighthouse traces. The gate currently enforces SEO score, FCP, Speed Index, CLS, and a 32 MB transfer ceiling. After the hero optimization work package restores a measurable LCP, add an LCP limit of 2,500 ms and reduce the transfer ceiling.

Intentional changes to the homepage title, description, H1, canonical, or required content must update `scripts/seo-gates.mjs` and its tests in the same reviewed pull request.
