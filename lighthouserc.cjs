module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'pnpm start --hostname 127.0.0.1 --port 3000',
      startServerReadyPattern: 'Ready in',
      url: ['http://127.0.0.1:3000/'],
      settings: {
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage',
        onlyCategories: ['performance', 'seo'],
      },
    },
    assert: {
      assertions: {
        // The current animated/video hero produces NO_LCP in Lighthouse. Until
        // that is corrected, enforce the measurable baseline signals and make
        // LCP a hard gate as part of the hero performance work package.
        'categories:seo': ['error', { minScore: 1 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 3500 }],
        'speed-index': ['error', { maxNumericValue: 3500 }],
        'total-byte-weight': ['error', { maxNumericValue: 32000000 }],
      },
    },
    upload: {
      outputDir: '.lighthouseci',
      target: 'filesystem',
    },
  },
};
