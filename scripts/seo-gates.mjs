import assert from 'node:assert/strict';

export const PRODUCTION_URL = 'https://www.melbournestructural.com.au/';
export const EXPECTED_TITLE = 'Structural Civil Engineering - Structural Melbourne';
export const EXPECTED_DESCRIPTION =
  'Melbourne Structural provides structural and civil engineering services, designing innovative, economic & environmentally sustainable solutions.';

function normalizeUrl(value) {
  try {
    return new URL(value).href;
  } catch {
    return value;
  }
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function getAttributes(tag) {
  const attributes = new Map();
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;

  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), decodeHtml(match[2] ?? match[3] ?? match[4] ?? ''));
  }

  return attributes;
}

function findTagByAttribute(html, tagName, attributeName, expectedValue) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];

  return tags.find((tag) => {
    const attributes = getAttributes(tag);
    return attributes.get(attributeName)?.toLowerCase() === expectedValue.toLowerCase();
  });
}

function stripMarkup(value) {
  return decodeHtml(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export function inspectHomepage({ html, headers, expectedCanonical }) {
  const issues = [];
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const descriptionTag = findTagByAttribute(html, 'meta', 'name', 'description');
  const canonicalTag = findTagByAttribute(html, 'link', 'rel', 'canonical');
  const robotsTag = findTagByAttribute(html, 'meta', 'name', 'robots');
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const robotsHeader = headers.get('x-robots-tag') ?? '';

  const title = titleMatch ? stripMarkup(titleMatch[1]) : '';
  if (title !== EXPECTED_TITLE) {
    issues.push(`Expected title ${EXPECTED_TITLE}, received ${title || 'none'}.`);
  }

  const description = descriptionTag
    ? getAttributes(descriptionTag).get('content')?.trim() ?? ''
    : '';
  if (description !== EXPECTED_DESCRIPTION) {
    issues.push(
      `Expected description ${EXPECTED_DESCRIPTION}, received ${description || 'none'}.`
    );
  }

  const canonical = canonicalTag ? getAttributes(canonicalTag).get('href') : undefined;
  if (normalizeUrl(canonical ?? '') !== normalizeUrl(expectedCanonical)) {
    issues.push(`Expected canonical ${expectedCanonical}, received ${canonical ?? 'none'}.`);
  }

  const robotsContent = robotsTag ? getAttributes(robotsTag).get('content') ?? '' : '';
  if (/\bnoindex\b/i.test(`${robotsContent},${robotsHeader}`)) {
    issues.push('The production homepage must not emit a noindex directive.');
  }

  if (h1Matches.length !== 1) {
    issues.push(`Expected exactly one H1, received ${h1Matches.length}.`);
  }

  if (!mainMatch) {
    issues.push('The homepage must contain a server-rendered main element.');
  } else {
    const mainText = stripMarkup(mainMatch[1]);
    const requiredText = [
      'Practical structural engineering for builds all around Victoria.',
      'Structural design',
      'info@melbournestructural.com.au',
    ];

    for (const text of requiredText) {
      if (!mainText.includes(text)) {
        issues.push(`Server-rendered main content is missing: ${text}`);
      }
    }
  }

  return issues;
}

export function inspectRobots({ body, expectedSitemap }) {
  const issues = [];

  if (/^\s*Disallow:\s*\/\s*$/im.test(body)) {
    issues.push('Production robots.txt must not disallow the entire site.');
  }

  if (!body.includes(`Sitemap: ${expectedSitemap}`)) {
    issues.push(`robots.txt must reference ${expectedSitemap}.`);
  }

  return issues;
}

export function inspectSitemap({ body, expectedCanonical }) {
  return body.includes(`<loc>${expectedCanonical}</loc>`)
    ? []
    : [`sitemap.xml must contain ${expectedCanonical}.`];
}

async function fetchRequired(url, expectedContentType) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'MelbourneStructural-CI/1.0',
    },
    redirect: 'follow',
  });

  assert.equal(response.status, 200, `${url} returned ${response.status}, expected 200.`);

  const contentType = response.headers.get('content-type') ?? '';
  assert.match(
    contentType,
    expectedContentType,
    `${url} returned unexpected content type ${contentType || 'none'}.`
  );

  return {
    body: await response.text(),
    headers: response.headers,
  };
}

async function verifyPermanentRedirect(sourceUrl, expectedDestination) {
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent': 'MelbourneStructural-CI/1.0',
    },
    method: 'HEAD',
    redirect: 'manual',
  });

  assert.ok(
    response.status === 301 || response.status === 308,
    `${sourceUrl} returned ${response.status}; expected a permanent redirect.`
  );

  const location = response.headers.get('location');
  assert.ok(location, `${sourceUrl} did not provide a redirect location.`);
  assert.equal(new URL(location, sourceUrl).href, expectedDestination);
}

export async function runSeoGates({
  baseUrl,
  checkRedirects = false,
  expectedCanonical = PRODUCTION_URL,
}) {
  const normalizedBaseUrl = new URL('/', baseUrl).href;
  const sitemapUrl = new URL('/sitemap.xml', normalizedBaseUrl).href;
  const robotsUrl = new URL('/robots.txt', normalizedBaseUrl).href;

  const [homepage, robots, sitemap] = await Promise.all([
    fetchRequired(normalizedBaseUrl, /text\/html/i),
    fetchRequired(robotsUrl, /text\/plain/i),
    fetchRequired(sitemapUrl, /(?:application|text)\/xml/i),
  ]);

  const issues = [
    ...inspectHomepage({
      html: homepage.body,
      headers: homepage.headers,
      expectedCanonical,
    }),
    ...inspectRobots({
      body: robots.body,
      expectedSitemap: `${expectedCanonical}sitemap.xml`,
    }),
    ...inspectSitemap({
      body: sitemap.body,
      expectedCanonical,
    }),
  ];

  assert.deepEqual(issues, [], `SEO gate failures:\n- ${issues.join('\n- ')}`);

  if (checkRedirects) {
    await Promise.all([
      verifyPermanentRedirect('http://www.melbournestructural.com.au/', expectedCanonical),
      verifyPermanentRedirect('https://melbournestructural.com.au/', expectedCanonical),
    ]);
  }

  console.log(`SEO gates passed for ${normalizedBaseUrl}`);
}
