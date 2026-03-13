import { Hono } from 'hono'
import { users, listings, projects, agreements, splitSheets,
         getUserById, getListingById, getProjectById,
         getSplitSheetById, getSplitSheetByProject, getAgreementByProject } from './data'
import { homePage }            from './pages/home'
import { explorePage }         from './pages/explore'
import { artistPage }          from './pages/artist'
import { marketplacePage }     from './pages/marketplace'
import { loginPage, signupPage, forgotPasswordPage } from './pages/auth'
import {
  dashboardPage, projectsPage, earningsPage,
  listingsPage, ordersPage, settingsPage,
} from './pages/dashboard'
import { messagesPage }        from './pages/messaging'
import { bookingPage, orderConfirmationPage } from './pages/booking'
import { adminPage }           from './pages/admin'
import { howItWorksPage, termsPage, privacyPage, contactPage } from './pages/misc'
import {
  splitSheetPage, splitSheetsListPage,
  ndaPage, agreementPage,
} from './pages/splitsheet'
import { workspacePage } from './pages/workspace'
import { transparencyPage } from './pages/transparency'

// ─── Layout helpers (for inline listingDetailPage) ────────────────────────────
import { shell, closeShell, authedNav } from './layout'
import { statusColor, statusLabel, formatPrice } from './data'

// ─── Listing detail page (PGES-compliant) ────────────────────────────────────
function listingDetailPage(listing: any): string {
  if (!listing) {
    return shell('Error', '') + '<div style="padding:40px;color:#F0F0F4;">Listing not found.</div>' + closeShell();
  }
  const title       = String(listing.title ?? 'Listing');
  const description = String(listing.description ?? '');
  const artistUrl   = `/booking/${String(listing.userId ?? '')}?listing=${String(listing.id ?? '')}`;
  const hasSplits   = Array.isArray(listing.collabTypes) && listing.collabTypes.includes('ownership_split');
  const hasHire     = Array.isArray(listing.collabTypes) && listing.collabTypes.includes('pay_for_hire');

  return shell(title, '') + authedNav() + `
<div style="max-width:900px;margin:0 auto;padding:48px 24px;">
  <div style="margin-bottom:24px;">
    <a href="/marketplace" style="font-size:0.8125rem;color:var(--t3);display:inline-flex;align-items:center;gap:6px;">
      <i class="fas fa-arrow-left" style="font-size:11px;"></i> Back to Marketplace
    </a>
  </div>
  <h1 style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:8px;">${title}</h1>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
    ${hasHire   ? `<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:var(--r-full);background:rgba(255,140,66,0.1);color:var(--warm);border:1px solid rgba(255,140,66,0.25);font-size:0.72rem;font-weight:600;"><i class="fas fa-dollar-sign" style="font-size:9px;"></i> Pay-for-Hire</span>` : ''}
    ${hasSplits ? `<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:var(--r-full);background:var(--signal-dim);color:var(--signal);border:1px solid rgba(200,255,0,0.25);font-size:0.72rem;font-weight:600;"><i class="fas fa-chart-pie" style="font-size:9px;"></i> Ownership Split Available</span>` : ''}
  </div>
  <p style="font-size:0.9375rem;color:var(--t3);line-height:1.7;margin-bottom:28px;">${description}</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;">
    <a href="${artistUrl}" class="btn btn-primary btn-lg">
      <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
      Book this service
    </a>
    ${hasSplits ? `
    <button class="btn btn-secondary btn-lg" onclick="alert('Select Ownership Split collaboration on the booking page to negotiate splits and generate a split sheet automatically.')">
      <i class="fas fa-chart-pie" style="font-size:13px;"></i>
      Propose Split Deal
    </button>` : ''}
  </div>
</div>
${closeShell()}`;
}

// ─── App ─────────────────────────────────────────────────────────────────────
const app = new Hono()

// ─── Security Headers Middleware ──────────────────────────────────────────────
// PGES: Security-first — applied to every response
app.use('*', async (c, next) => {
  await next();
  c.res.headers.set('X-Content-Type-Options',    'nosniff');
  c.res.headers.set('X-Frame-Options',           'DENY');
  c.res.headers.set('X-XSS-Protection',          '1; mode=block');
  c.res.headers.set('Referrer-Policy',           'strict-origin-when-cross-origin');
  c.res.headers.set('Permissions-Policy',        'camera=(), microphone=(), geolocation=()');
});

// ─── Public Pages ─────────────────────────────────────────────────────────────
app.get('/',             (c) => c.html(homePage()))
app.get('/explore',      (c) => c.html(explorePage()))
app.get('/marketplace',  (c) => c.html(marketplacePage()))
app.get('/how-it-works', (c) => c.html(howItWorksPage()))
app.get('/terms',        (c) => c.html(termsPage()))
app.get('/privacy',      (c) => c.html(privacyPage()))
app.get('/contact',      (c) => c.html(contactPage()))

// ─── Auth ─────────────────────────────────────────────────────────────────────
app.get('/login',           (c) => c.html(loginPage()))
app.get('/signup',          (c) => c.html(signupPage()))
app.get('/forgot-password', (c) => c.html(forgotPasswordPage()))
app.get('/logout',          (c) => c.redirect('/login'))

// ─── Artist Profiles ─────────────────────────────────────────────────────────
// PGES: Sanitize input ID
app.get('/artist/:id', (c) => {
  const rawId = c.req.param('id') ?? '';
  const id    = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!id) return c.redirect('/explore');
  return c.html(artistPage(id))
})

// ─── Listings ─────────────────────────────────────────────────────────────────
app.get('/listing/:id', (c) => {
  const rawId = c.req.param('id') ?? '';
  const id    = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!id) return c.redirect('/marketplace');
  const listing = getListingById(id)
  if (!listing) {
    return c.html(
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>404 — Artist Collab</title></head>
       <body style="background:#030305;color:#F0F0F4;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;">
         <div><h1 style="color:#C8FF00;font-size:6rem;margin:0;">404</h1><p>Listing not found.</p>
         <a href="/marketplace" style="color:#C8FF00;">Browse Marketplace →</a></div>
       </body></html>`, 404
    )
  }
  return c.html(listingDetailPage(listing))
})

// ─── Booking ─────────────────────────────────────────────────────────────────
app.get('/booking/:artistId', (c) => {
  const rawArtistId = c.req.param('artistId') ?? '';
  const artistId    = rawArtistId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!artistId) return c.redirect('/marketplace');
  const rawListingId = c.req.query('listing') ?? '';
  const listingId    = rawListingId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || undefined;
  return c.html(bookingPage(artistId, listingId))
})
app.get('/booking', (c) => {
  const rawListingId = c.req.query('listing') ?? '';
  const listingId    = rawListingId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || undefined;
  const listing      = listingId ? getListingById(listingId) : listings[0];
  if (!listing) return c.redirect('/marketplace');
  return c.html(bookingPage(listing.userId, listingId))
})
app.get('/order-confirmation', (c) => c.html(orderConfirmationPage()))

// ─── Dashboard ───────────────────────────────────────────────────────────────
app.get('/dashboard',             (c) => c.html(dashboardPage()))
app.get('/dashboard/projects',    (c) => c.html(projectsPage()))
app.get('/dashboard/messages',    (c) => c.html(messagesPage()))
app.get('/dashboard/orders',      (c) => c.html(ordersPage()))
app.get('/dashboard/earnings',    (c) => c.html(earningsPage()))
app.get('/dashboard/listings',    (c) => c.html(listingsPage()))
app.get('/dashboard/settings',    (c) => c.html(settingsPage()))

// ─── Workspace ───────────────────────────────────────────────────────────────
// PGES: Sanitize project ID, defensive fallback
app.get('/workspace/:id', (c) => {
  const rawId = c.req.param('id') ?? '';
  const id    = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!id) return c.redirect('/dashboard/projects');
  const project = getProjectById(id);
  if (!project) return c.redirect('/dashboard/projects');
  return c.html(workspacePage(project))
})

// ─── Split Sheets ─────────────────────────────────────────────────────────────
// PGES: Sanitize all IDs
app.get('/split-sheets',        (c) => c.html(splitSheetsListPage()))
app.get('/dashboard/split-sheets', (c) => c.html(splitSheetsListPage()))

app.get('/split-sheet/:id', (c) => {
  const rawId = c.req.param('id') ?? '';
  const id    = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!id) return c.redirect('/split-sheets');
  return c.html(splitSheetPage(id))
})

// ─── NDA & Legal ─────────────────────────────────────────────────────────────
app.get('/nda',               (c) => c.html(ndaPage()))
app.get('/platform-agreement', (c) => c.redirect('/nda'))

// ─── Collaboration Agreements ─────────────────────────────────────────────────
app.get('/agreement/:projectId', (c) => {
  const rawId = c.req.param('projectId') ?? '';
  const id    = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!id) return c.redirect('/dashboard/projects');
  return c.html(agreementPage(id))
})

// ─── Transparency Dashboard ───────────────────────────────────────────────────
app.get('/transparency',           (c) => c.html(transparencyPage()))
app.get('/dashboard/transparency', (c) => c.html(transparencyPage()))

// ─── Admin ───────────────────────────────────────────────────────────────────
app.get('/admin',   (c) => c.html(adminPage()))
app.get('/admin/*', (c) => c.html(adminPage()))

// ─── Shortcuts / Redirects ───────────────────────────────────────────────────
app.get('/profile/me', (c) => c.html(artistPage(users[0]?.id ?? 'u1')))
app.get('/settings',   (c) => c.html(settingsPage()))
app.get('/messages',   (c) => c.redirect('/dashboard/messages'))
app.get('/projects',   (c) => c.redirect('/dashboard/projects'))

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.notFound((c) => c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>404 — Artist Collab</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap">
  <style>
    body { margin:0; background:#030305; color:#F0F0F4; font-family:'Inter',sans-serif; min-height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; }
    h1  { font-family:'Syne',sans-serif; font-size:clamp(5rem,15vw,10rem); font-weight:800; color:#C8FF00; letter-spacing:-0.04em; line-height:1; margin:0 0 16px; }
    p   { color:#52526A; margin:0 0 32px; font-size:1.0625rem; }
    a   { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; background:#C8FF00; color:#000; border-radius:8px; text-decoration:none; font-weight:700; font-size:0.9375rem; }
  </style>
</head>
<body>
  <div>
    <h1>404</h1>
    <p>This page doesn't exist — yet.</p>
    <a href="/">← Back to Artist Collab</a>
  </div>
</body>
</html>`, 404))

export default app
