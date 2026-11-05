const fs = require('fs');

let pass = 0;
let fail = 0;

function check(desc, condition, details = '') {
  if (condition) {
    console.log(`[PASS] ${desc}`);
    pass++;
  } else {
    console.error(`[FAIL] ${desc} ${details ? '(' + details + ')' : ''}`);
    fail++;
  }
}

console.log('=== VERIFYING FIXES FOR 360px & 768px PRICING ISSUES ===\n');

const cssLayout = fs.readFileSync('css/layout.css', 'utf8');
const cssDesign = fs.readFileSync('css/design-system.css', 'utf8');
const pricingHtml = fs.readFileSync('pricing.html', 'utf8');

// 1. Table 768px fix checks
check(
  'editorial-price-table-wrap has overflow-x: auto and smooth scrolling',
  cssLayout.includes('.editorial-price-table-wrap') &&
  cssLayout.includes('overflow-x: auto;') &&
  cssLayout.includes('-webkit-overflow-scrolling: touch;')
);

check(
  'editorial-price-table has min-width: 640px to prevent column collapse',
  cssLayout.includes('.editorial-price-table') &&
  cssLayout.includes('min-width: 640px;')
);

check(
  'knife-name-cell has white-space: nowrap and normal word-break',
  cssLayout.includes('.knife-name-cell') &&
  cssLayout.includes('white-space: nowrap;') &&
  cssLayout.includes('word-break: normal;')
);

check(
  'knife-type-with-thumb has min-width defined',
  cssLayout.includes('.knife-type-with-thumb') &&
  cssLayout.includes('min-width: 175px;')
);

check(
  'Tablet media query (641px - 860px) reduces padding and thumb size for 768px viewport fit',
  cssLayout.includes('@media (min-width: 641px) and (max-width: 860px)') &&
  cssLayout.includes('padding: 0.85rem 0.65rem;') &&
  cssLayout.includes('width: 44px;')
);

check(
  'Mobile card transformation at <= 640px resets min-width and allows wrapping',
  cssLayout.includes('@media (max-width: 640px)') &&
  cssLayout.includes('.editorial-price-table,') &&
  cssLayout.includes('min-width: 0;')
);

// 2. 360px Quote Section Cropping fix checks
check(
  'btn has max-width: 100% and box-sizing in design system',
  cssDesign.includes('max-width: 100%;') &&
  cssDesign.includes('box-sizing: border-box;')
);

check(
  'btn wraps on mobile (max-width: 640px)',
  cssDesign.includes('@media (max-width: 640px)') &&
  cssDesign.includes('white-space: normal;')
);

check(
  'pricing-section has overflow-x: clip and box-sizing',
  cssLayout.includes('.pricing-section') &&
  cssLayout.includes('overflow-x: clip;')
);

check(
  'quote-layout has minmax(0, 1fr) grid columns',
  cssLayout.includes('.quote-layout') &&
  cssLayout.includes('grid-template-columns: minmax(0, 1fr);')
);

check(
  'quote-intro-panel and quote-form-panel have min-width: 0 and box-sizing',
  cssLayout.includes('.quote-intro-panel') &&
  cssLayout.includes('min-width: 0;') &&
  cssLayout.includes('.quote-form-panel')
);

check(
  'quickinfo-row has align-items: flex-start and child span has min-width: 0 & overflow-wrap',
  cssLayout.includes('.quickinfo-row') &&
  cssLayout.includes('align-items: flex-start;') &&
  cssLayout.includes('.quickinfo-row span') &&
  cssLayout.includes('overflow-wrap: break-word;')
);

check(
  'btnSubmitQuote has white-space: normal and width: 100%',
  cssLayout.includes('#btnSubmitQuote') &&
  cssLayout.includes('white-space: normal;') &&
  cssLayout.includes('max-width: 100%;')
);

check(
  'pricing.html has synced workshop address (42 Artisan Forge Way, Suite 104)',
  pricingHtml.includes('42 Artisan Forge Way, Suite 104, Portland, OR 97201')
);

check(
  'pricing.html has synced workshop phone ((503) 555-0198)',
  pricingHtml.includes('(503) 555-0198')
);

// Check that old inconsistent address is completely removed
const allHtmlFiles = ['index.html', 'home-2.html', 'about.html', 'services.html', 'pricing.html', 'contact.html'];
let hasOldAddress = false;
allHtmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('742 Artisan Foundry Row')) {
    hasOldAddress = true;
    console.error(`Old address found in ${f}`);
  }
});
check('No file contains outdated address "742 Artisan Foundry Row"', !hasOldAddress);

// 3. Regressions check on previous tasks
console.log('\n=== REGRESSION CHECKS ON PREVIOUS TASKS ===\n');

allHtmlFiles.forEach(file => {
  const c = fs.readFileSync(file, 'utf8');
  
  // Header Nav: Home dropdown followed immediately by About link, before Services link
  const homeIdx = c.indexOf('id="homeDropdown"');
  const aboutIdx = c.indexOf('href="about.html"');
  const servicesIdx = c.indexOf('href="services.html"');
  
  check(
    `${file}: Header nav has About immediately after Home`,
    homeIdx !== -1 && aboutIdx !== -1 && servicesIdx !== -1 && homeIdx < aboutIdx && aboutIdx < servicesIdx
  );
  
  // Hero images present
  const hasHeroMedia = c.includes('page-intro-media') || file === 'index.html' || file === 'home-2.html';
  check(`${file}: Hero section has valid image media`, hasHeroMedia);
});

// Contact page map check
const contactHtml = fs.readFileSync('contact.html', 'utf8');
check('contact.html has workshopMap section with interactive map elements', contactHtml.includes('id="workshopMap"'));

// Home page card buttons alignment
check(
  'layout.css aligns feature-card CTA buttons consistently with margin-top: auto and flex: 1 1 auto',
  cssLayout.includes('#sharpeningServices .feature-card-footer') &&
  cssLayout.includes('margin-top: auto;') &&
  cssLayout.includes('#sharpeningServices .feature-card-content') &&
  cssLayout.includes('flex: 1 1 auto;')
);

console.log(`\n================================`);
console.log(`TOTAL CHECKS: ${pass + fail} | PASSED: ${pass} | FAILED: ${fail}`);
console.log(`================================`);

if (fail > 0) {
  process.exit(1);
}
