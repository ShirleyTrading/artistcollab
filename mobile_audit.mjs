// Mobile audit script — runs Playwright on 390px viewport (iPhone 14 width)
// Checks for horizontal overflow and small touch targets on all routes

import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const VIEWPORT = { width: 390, height: 844 }; // iPhone 14 Pro

const ROUTES = [
  { path: '/',                    name: 'home' },
  { path: '/explore',             name: 'explore' },
  { path: '/marketplace',         name: 'marketplace' },
  { path: '/login',               name: 'login' },
  { path: '/signup',              name: 'signup' },
  { path: '/how-it-works',        name: 'how_it_works' },
  { path: '/contact',             name: 'contact' },
  { path: '/dashboard',           name: 'dashboard' },
  { path: '/dashboard/projects',  name: 'dash_projects' },
  { path: '/dashboard/messages',  name: 'messages' },
  { path: '/dashboard/earnings',  name: 'earnings' },
  { path: '/dashboard/listings',  name: 'listings' },
  { path: '/dashboard/settings',  name: 'settings' },
  { path: '/artist/u1',           name: 'artist' },
  { path: '/booking/u2',          name: 'booking' },
  { path: '/workspace/p1',        name: 'workspace' },
  { path: '/admin',               name: 'admin' },
  { path: '/terms',               name: 'terms' },
];

const MIN_TOUCH = 44; // Apple/WCAG minimum touch target

async function auditPage(page, route) {
  await page.goto(`${BASE}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);

  // Check horizontal overflow: scrollWidth > viewport width means real overflow
  const overflow = await page.evaluate((vw) => {
    const el = document.documentElement;
    const sw = Math.max(el.scrollWidth, document.body.scrollWidth);
    return {
      scrollWidth: sw,
      viewportWidth: vw,
      overflow: sw > vw,
    };
  }, VIEWPORT.width);

  // Collect overflow elements (only if document doesn't scroll)
  let overflowEls = [];
  if (overflow.overflow) {
    overflowEls = await page.evaluate((vw) => {
      const results = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        // Only flag if VISUALLY outside viewport and not in a scroll container
        if (rect.right > vw + 2) {
          // Check if any parent has overflow-x scroll/auto
          let parent = el.parentElement;
          let inScroller = false;
          while (parent && parent !== document.body) {
            const style = getComputedStyle(parent);
            if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
              inScroller = true;
              break;
            }
            parent = parent.parentElement;
          }
          if (!inScroller) {
            const classes = Array.from(el.classList).join(' ').slice(0, 60);
            results.push({ tag: el.tagName.toLowerCase(), class: classes, right: Math.round(rect.right) });
          }
        }
      }
      return results.slice(0, 8);
    }, VIEWPORT.width);
  }

  // Check small touch targets
  const smallTargets = await page.evaluate((minTouch) => {
    const interactive = document.querySelectorAll('a[href], button, [role="button"], input, select, textarea');
    const results = [];
    for (const el of interactive) {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if ((w < minTouch || h < minTouch) && w > 0 && h > 0) {
        const text = (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 40);
        const tag = el.tagName.toLowerCase();
        results.push({ tag, text, w, h });
      }
    }
    return results.slice(0, 12);
  }, MIN_TOUCH);

  return {
    name: route.name,
    path: route.path,
    overflow: overflow.overflow,
    scrollWidth: overflow.scrollWidth,
    viewportWidth: overflow.viewportWidth,
    overflowEls,
    smallTargets,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)' });
  const page = await context.newPage();

  const results = [];
  for (const route of ROUTES) {
    try {
      const r = await auditPage(page, route);
      results.push(r);
      const status = r.overflow ? '❌ OVERFLOW' : '✅ OK';
      console.log(`${status}  ${r.name.padEnd(18)} scrollWidth=${r.scrollWidth}`);
      if (r.overflowEls.length > 0) {
        r.overflowEls.forEach(e => console.log(`   ↳ <${e.tag}${e.class?' class="'+e.class+'"':''}> right=${e.right}`));
      }
      if (r.smallTargets.length > 0) {
        console.log(`   Small targets (${r.smallTargets.length}):`);
        r.smallTargets.slice(0, 5).forEach(t => console.log(`   ↳ <${t.tag}> "${t.text}" ${t.w}×${t.h}px`));
      }
    } catch (err) {
      console.log(`⚠️  ${route.name}: ${err.message.split('\n')[0]}`);
    }
  }

  await browser.close();

  console.log('\n═══ SUMMARY ═══');
  const overflowPages = results.filter(r => r.overflow);
  const smallPages = results.filter(r => r.smallTargets.length > 0);
  console.log(`Pages audited:  ${results.length}`);
  console.log(`Overflow pages: ${overflowPages.length}${overflowPages.length > 0 ? ' — ' + overflowPages.map(r=>r.name).join(', ') : ' ✅'}`);
  console.log(`Pages w/ small targets: ${smallPages.length}`);
}

main().catch(err => {
  console.error('Audit failed:', err.message);
  process.exit(1);
});
