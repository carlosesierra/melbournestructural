import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPECTED_DESCRIPTION,
  EXPECTED_TITLE,
  inspectHomepage,
  inspectRobots,
  inspectSitemap,
  PRODUCTION_URL,
} from '../scripts/seo-gates.mjs';

const validHtml = `<!doctype html>
<html>
  <head>
    <title>${EXPECTED_TITLE}</title>
    <meta name="description" content="${EXPECTED_DESCRIPTION.replace('&', '&amp;')}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${PRODUCTION_URL}" />
  </head>
  <body>
    <main>
      <h1>Practical structural engineering for builds all around Victoria.</h1>
      <h2>Structural design</h2>
      <a href="mailto:info@melbournestructural.com.au">info@melbournestructural.com.au</a>
    </main>
  </body>
</html>`;

test('accepts the expected production homepage metadata and content', () => {
  const issues = inspectHomepage({
    html: validHtml,
    headers: new Headers(),
    expectedCanonical: PRODUCTION_URL,
  });

  assert.deepEqual(issues, []);
});

test('rejects noindex, canonical drift, and duplicate H1 headings', () => {
  const html = validHtml
    .replace(EXPECTED_TITLE, 'Unexpected title')
    .replace('index, follow', 'noindex, nofollow')
    .replace(PRODUCTION_URL, 'https://example.com/')
    .replace('</main>', '<h1>Duplicate heading</h1></main>');

  const issues = inspectHomepage({
    html,
    headers: new Headers(),
    expectedCanonical: PRODUCTION_URL,
  });

  assert.ok(issues.some((issue) => issue.includes('Expected title')));
  assert.ok(issues.some((issue) => issue.includes('canonical')));
  assert.ok(issues.some((issue) => issue.includes('noindex')));
  assert.ok(issues.some((issue) => issue.includes('exactly one H1')));
});

test('rejects a site-wide robots disallow and missing sitemap reference', () => {
  const issues = inspectRobots({
    body: 'User-agent: *\nDisallow: /\n',
    expectedSitemap: `${PRODUCTION_URL}sitemap.xml`,
  });

  assert.equal(issues.length, 2);
});

test('requires the canonical URL in the sitemap', () => {
  assert.deepEqual(
    inspectSitemap({
      body: `<urlset><url><loc>${PRODUCTION_URL}</loc></url></urlset>`,
      expectedCanonical: PRODUCTION_URL,
    }),
    []
  );

  assert.equal(
    inspectSitemap({
      body: '<urlset></urlset>',
      expectedCanonical: PRODUCTION_URL,
    }).length,
    1
  );
});
