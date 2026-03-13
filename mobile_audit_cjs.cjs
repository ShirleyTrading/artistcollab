// Mobile audit script (CommonJS — uses pre-installed Playwright)
// Checks all routes on 390px viewport for overflow and small touch targets

const PLAYWRIGHT_DIR = '/opt/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright';
const { chromium } = require(PLAYWRIGHT_DIR);

const BASE = 'http://localhost:3000';
const VIEWPORT = { width: 390, height: 844 }; // iPhone 14 Pro
const MIN_TOUCH = 44; // Apple HIG / WCAG minimum

const ROUTES = [
  { path: '/',                   name: 'home' },
  { path: '/explore',            name: 'explore' },
  { path: '/marketplace',        name: 'marketplace' },
  { path: '/login',              name: 'login' },
  { path: '/signup',             name: 'signup' },
  { path: '/how-it-works',       name: 'how_it_works' },
  { path: '/contact',            name: 'contact' },
  { path: '/dashboard',          name: 'dashboard' },
  { path: '/dashboard/projects', name: 'dash_projects' },
  { path: '/dashboard/messages', name: 'messages' },
  { path: '/dashboard/earnings', name: 'earnings' },
  { path: '/dashboard/listings', name: 'listings' },
  { path: '/dashboard/settings', name: 'settings' },
  { path: '/artist/u1',          name: 'artist' },
  { path: '/booking/u2',         name: 'booking' },
  { path: '/workspace/p1',       name: 'workspace' },
  { path: '/admin',              name: 'admin' },
  { path: '/terms',              name: 'terms' },
];

async function auditPage(page, route) {
  await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(500);

  // Real overflow check: document scrollWidth vs viewport width
  const overflow = await page.evaluate((vw) => {
    const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    return { scrollWidth: sw, overflow: sw > vw + 2 };
  }, VIEWPORT.width);

  // Collect elements causing overflow (skip those inside scroll containers)
  let overflowEls = [];
  if (overflow.overflow) {
    overflowEls = await page.evaluate((vw) => {
      const results = [];
      for (const el of document.querySelectorAll('*')) {
        const rect = el.getBoundingClientRect();
        if (rect.right <= vw + 2) continue;
        // Skip if inside a scrollable ancestor
        let p = el.parentElement, inScroller = false;
        while (p && p !== document.body) {
          const s = getComputedStyle(p);
          if (s.overflowX === 'auto' || s.overflowX === 'scroll') { inScroller = true; break; }
          p = p.parentElement;
        }
        if (!inScroller) {
          results.push({
            tag: el.tagName.toLowerCase(),
            cls: Array.from(el.classList).join(' ').slice(0, 60),
            right: Math.round(rect.right)
          });
        }
      }
      return results.slice(0, 6);
    }, VIEWPORT.width);
  }

  // Small touch target detection
  const smallTargets = await page.evaluate((minT) => {
    const selectors = 'a[href], button, [role="button"], input:not([type="hidden"]), select, textarea';
    const results = [];
    for (const el of document.querySelectorAll(selectors)) {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width), h = Math.round(r.height);
      if (w < minT || h < minT) {
        if (w === 0 || h === 0) continue; // hidden
        const text = (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 40);
        results.push({ tag: el.tagName.toLowerCase(), text, w, h });
      }
    }
    return results.slice(0, 10);
  }, MIN_TOUCH);

  return { name: route.name, path: route.path, ...overflow, overflowEls, smallTargets };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();

  const results = [];
  for (const route of ROUTES) {
    try {
      const r = await auditPage(page, route);
      results.push(r);
      const icon = r.overflow ? '❌ OVERFLOW' : '✅ OK     ';
      process.stdout.write(`${icon}  ${r.name.padEnd(18)} scrollWidth=${r.scrollWidth}\n`);
      if (r.overflowEls.length) r.overflowEls.forEach(e => process.stdout.write(`   ↳ <${e.tag} "${e.cls}"> right=${e.right}\n`));
      if (r.smallTargets.length) {
        process.stdout.write(`   Small targets (${r.smallTargets.length}): `);
        r.smallTargets.slice(0, 4).forEach(t => process.stdout.write(`<${t.tag}>"${t.text}" ${t.w}×${t.h} `));
        process.stdout.write('\n');
      }
    } catch(err) {
      process.stdout.write(`⚠️  ${route.name}: ${err.message.slice(0,80)}\n`);
    }
  }

  await browser.close();

  const overflows = results.filter(r => r.overflow);
  const withSmall = results.filter(r => r.smallTargets.length > 0);
  console.log('\n═══ FINAL SUMMARY ═══');
  console.log(`Pages audited:      ${results.length}`);
  console.log(`Overflow pages:     ${overflows.length}${overflows.length ? ' — ' + overflows.map(r=>r.name).join(', ') : ' ✅ NONE'}`);
  console.log(`Small-target pages: ${withSmall.length}`);
  if (overflows.length === 0) console.log('\n✅ ZERO HORIZONTAL OVERFLOW — MOBILE CLEAN');
}

main().catch(err => { console.error('AUDIT ERROR:', err.message); process.exit(1); });
