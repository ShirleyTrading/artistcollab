import { Hono } from 'hono'
import { users, listings, projects, getUserById, getListingById, getProjectById } from './data'
import { homePage } from './pages/home'
import { explorePage } from './pages/explore'
import { artistPage } from './pages/artist'
import { marketplacePage } from './pages/marketplace'
import { loginPage, signupPage, forgotPasswordPage } from './pages/auth'
import { dashboardPage, projectsPage, earningsPage, listingsPage, ordersPage, settingsPage } from './pages/dashboard'
import { messagesPage } from './pages/messaging'
import { bookingPage, orderConfirmationPage } from './pages/booking'
import { adminPage } from './pages/admin'
import { howItWorksPage, termsPage, privacyPage, contactPage } from './pages/misc'

// ─── Workspace page (inline — relies on project data) ────────────────────────
import { shell, closeShell, authedNav, appSidebar } from './layout'
import { statusColor, statusLabel, formatPrice } from './data'

function workspacePage(project: any): string {
  // PGES: Defensive — ensure demo user always exists
  const demoUser = users[0];
  if (!demoUser) return shell('Error', '') + '<div style="padding:40px;color:#F0F0F4;">Configuration error: no users defined.</div>' + closeShell();

  // PGES: Defensive counterpart lookup with graceful fallback
  const counterpartId = project.buyerId === demoUser.id ? project.sellerId : project.buyerId;
  const counterpart = getUserById(counterpartId) ?? {
    id: counterpartId ?? 'unknown',
    artistName: 'Collaborator',
    username: 'collaborator',
    profileImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop',
    profileImage2: '',
  } as any;

  const sc = statusColor(project.status ?? '');
  const sl = statusLabel(project.status ?? '');
  const progressMap: Record<string,number> = { pending:10, in_progress:45, awaiting_delivery:70, delivered:85, revision_requested:60, completed:100, cancelled:0 };
  const prog = progressMap[project.status as string] ?? 20;

  const wh = [0.3,0.6,0.9,0.8,1.0,0.85,0.6,0.4,0.7,0.9,0.8,0.6,0.4,0.7,0.5,0.8,0.9,0.65,0.5,0.75];

  return shell(project.title, `
  .ws-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: start;
  }
  .ws-panel { background: var(--c-panel); border: 1px solid var(--c-wire); border-radius: var(--r-lg); overflow: hidden; }
  .ws-panel-head { padding: 14px 18px; border-bottom: 1px solid var(--c-wire); display: flex; align-items: center; justify-content: space-between; background: var(--c-raised); }
  .file-row { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid var(--c-wire); transition: background var(--t-fast); }
  .file-row:hover { background: var(--c-ghost); }
  .msg-bubble { padding: 10px 13px; border-radius: 12px 12px 12px 3px; font-size: 0.875rem; line-height: 1.5; max-width: 80%; }
  .msg-bubble.mine { border-radius: 12px 12px 3px 12px; background: var(--signal); color: #000; font-weight: 500; }
  .msg-bubble.them { background: var(--c-raised); border: 1px solid var(--c-wire); }
  .btn-w { width: 100%; justify-content: center; }
  @media (max-width: 1024px) {
    .ws-layout { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .ws-layout { padding: 14px; gap: 14px; }
    .ws-panel-head { padding: 12px 14px; }
    .file-row { padding: 10px 12px; }
  }
`) + authedNav('projects') + `

<div class="app-shell">
  ${appSidebar('projects')}
  <main class="app-main">
    <div class="ws-layout">

      <!-- Left: main content -->
      <div style="display:flex;flex-direction:column;gap:16px;">

        <!-- Project header -->
        <div class="ws-panel">
          <div style="padding:20px;border-bottom:1px solid var(--c-wire);border-top:3px solid ${sc};">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="position:relative;">
                  <img src="${counterpart.profileImage}" class="av av-md" style="border:1.5px solid var(--c-rim);" alt="${counterpart.artistName}">
                  <div style="position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:var(--s-ok);border:2px solid var(--c-panel);"></div>
                </div>
                <div>
                  <h2 style="font-size:1rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:2px;">${project.title}</h2>
                  <div class="mono-sm" style="color:var(--t4);">with ${counterpart.artistName} · @${counterpart.username}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="badge" style="background:${sc}18;color:${sc};border:1px solid ${sc}33;font-family:var(--font-mono);">${sl}</span>
                <a href="/dashboard/messages" class="btn btn-secondary btn-sm"><i class="fas fa-comment-dots" style="font-size:11px;"></i> Message</a>
              </div>
            </div>

            <!-- Progress + waveform motif -->
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <span class="mono-sm" style="color:var(--t4);white-space:nowrap;">Progress</span>
              <div style="flex:1;height:4px;background:var(--c-rim);border-radius:2px;overflow:hidden;">
                <div style="height:100%;width:${prog}%;background:${sc};border-radius:2px;transition:width 0.6s ease;box-shadow:0 0 8px ${sc}55;"></div>
              </div>
              <span class="mono-sm" style="color:var(--t4);">${prog}%</span>
            </div>

            <!-- Mini waveform of progress -->
            <div style="display:flex;align-items:flex-end;gap:2px;height:16px;opacity:0.3;margin-bottom:10px;">
              ${wh.map((h,i) => `<div style="flex:1;height:${Math.round(h*100)}%;background:${i/wh.length < prog/100 ? sc : 'var(--c-rim)'};border-radius:1px 1px 0 0;"></div>`).join('')}
            </div>

            <div style="display:flex;gap:16px;flex-wrap:wrap;">
              ${[
                {icon:'fa-box', label:'Package', val:(project.selectedPackage ?? project.package ?? 'Standard') as string},
                {icon:'fa-calendar', label:'Due', val:(project.dueDate ?? 'TBD') as string},
                {icon:'fa-dollar-sign', label:'Order total', val:formatPrice(project.orderTotal ?? 0)},
              ].map(s => `
              <div style="display:flex;align-items:center;gap:6px;font-size:0.8125rem;color:var(--t3);">
                <i class="fas ${s.icon}" style="color:var(--t4);font-size:11px;width:14px;text-align:center;"></i>
                <span class="mono-sm" style="color:var(--t4);">${s.label}:</span>
                <span style="font-weight:600;color:var(--t1);">${s.val}</span>
              </div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Stem vault / Files -->
        <div class="ws-panel">
          <div class="ws-panel-head">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="height:1px;width:16px;background:var(--signal);box-shadow:0 0 4px var(--signal-glow);"></div>
              <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal);">Stem Vault</span>
            </div>
            <button class="btn btn-primary btn-xs" onclick="alert('Upload file')">
              <i class="fas fa-upload" style="font-size:10px;"></i> Upload
            </button>
          </div>
          <div>
            ${(project.files?.length ? project.files : [
              {id:'f1', name:'golden_hook_v2.wav', type:'audio', size:'8.1 MB', uploadedAt:'Jul 14', version:'v2', uploadedBy: project.sellerId ?? ''},
              {id:'f2', name:'reference_beat.mp3',  type:'audio', size:'5.2 MB', uploadedAt:'Jul 12', version:'v1', uploadedBy: project.buyerId ?? ''},
              {id:'f3', name:'stems_full_pack.zip', type:'file',  size:'42 MB', uploadedAt:'Jul 14', version:'v1', uploadedBy: project.sellerId ?? ''},
            ]).map((f: any) => {
              const isAudio = f.type === 'audio' || f.name?.endsWith?.('.wav') || f.name?.endsWith?.('.mp3');
              const uploader = getUserById(f.uploadedBy ?? '');
              const uploaderName = uploader?.artistName ?? 'Unknown';
              const versionStr = typeof f.version === 'number' ? 'V' + f.version : String(f.version || 'V1').toUpperCase();
              const safeName = String(f.name ?? 'file').replace(/'/g, "\\'");
              return `
            <div class="file-row">
              <div style="width:36px;height:36px;background:${isAudio ? 'var(--signal-dim)' : 'rgba(0,194,255,0.08)'};border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="fas ${isAudio ? 'fa-music' : 'fa-file-zipper'}" style="color:${isAudio ? 'var(--signal)' : 'var(--patch)'};font-size:13px;"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.875rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.name ?? 'Unknown file'}</div>
                <div class="mono-sm" style="color:var(--t4);">${f.size ?? '?'} · ${f.uploadedAt ?? ''} · ${uploaderName} · ${f.version ?? 'v1'}</div>
              </div>
              <div style="display:flex;gap:6px;flex-shrink:0;">
                <span class="badge badge-muted">${versionStr}</span>
                <button class="btn btn-ghost btn-xs" style="padding:5px 8px;color:var(--t3);" onclick="alert('Download: ${safeName}')">
                  <i class="fas fa-download" style="font-size:11px;"></i>
                </button>
              </div>
            </div>`;}).join('')}
          </div>
        </div>

        <!-- Chat -->
        <div class="ws-panel">
          <div class="ws-panel-head">
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="node node-ok" style="animation:pulse 2s infinite;"></div>
              <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--s-ok);">Project Chat</span>
            </div>
          </div>
          <div style="padding:16px;display:flex;flex-direction:column;gap:12px;max-height:320px;overflow-y:auto;">
            ${(project.messages?.length ? project.messages.slice(-4) : [
              {senderId: project.sellerId ?? '', content:"Hey! Just listened to the reference — this is exactly my lane.", timestamp:'10:22 AM'},
              {senderId: project.buyerId ?? '',  content:"I want something raw but polished. Think late-night energy.", timestamp:'10:25 AM'},
              {senderId: project.sellerId ?? '', content:"I got you. Expect the first take in 2 days.", timestamp:'10:33 AM'},
            ]).map((msg: any) => {
              const sender = getUserById(msg.senderId ?? '');
              const isMe = msg.senderId === demoUser.id;
              const senderName = sender?.artistName ?? 'Unknown';
              const senderImg = sender?.profileImage ?? 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40&h=40&fit=crop';
              return `
            <div style="display:flex;flex-direction:column;align-items:${isMe ? 'flex-end' : 'flex-start'};">
              ${!isMe ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <img src="${senderImg}" class="av av-xs" style="border:1px solid var(--c-rim);" alt="${senderName}">
                <span style="font-size:0.69rem;color:var(--t4);">${senderName}</span>
              </div>` : ''}
              <div class="msg-bubble ${isMe ? 'mine' : 'them'}">${msg.content ?? ''}</div>
              <div class="mono-sm" style="color:var(--t4);margin-top:3px;">${msg.timestamp ?? ''}</div>
            </div>`;}).join('')}
          </div>
          <div style="padding:12px;border-top:1px solid var(--c-wire);display:flex;gap:8px;">
            <input type="text" style="flex:1;background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-lg);padding:9px 14px;color:var(--t1);font-size:0.875rem;font-family:var(--font-body);outline:none;" placeholder="Message ${counterpart.artistName}…" onkeydown="if(event.key==='Enter')alert('Message sent!')">
            <button class="btn btn-primary btn-sm" style="padding:9px 12px;" onclick="alert('Message sent!')">
              <i class="fas fa-paper-plane" style="font-size:12px;"></i>
            </button>
          </div>
        </div>

      </div>

      <!-- Right: sidebar -->
      <div style="display:flex;flex-direction:column;gap:14px;">

        <!-- Escrow status -->
        <div class="ws-panel" style="border-top:3px solid var(--s-ok);">
          <div style="padding:16px;">
            <div class="mono-sm" style="color:var(--t4);margin-bottom:6px;">ESCROW STATUS</div>
            <div style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.04em;color:var(--s-ok);margin-bottom:4px;">${formatPrice(project.orderTotal)}</div>
            <div class="mono-sm" style="color:var(--t4);margin-bottom:14px;">Secured · Released on approval</div>
            <div style="height:3px;background:var(--c-rim);border-radius:2px;overflow:hidden;margin-bottom:12px;">
              <div style="height:100%;width:${prog}%;background:var(--s-ok);border-radius:2px;"></div>
            </div>
            ${project.status === 'delivered' || project.status === 'awaiting_delivery' ? `
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="btn btn-primary btn-sm btn-w" onclick="alert('Delivery approved! Payment released.')">
                <i class="fas fa-check-circle" style="font-size:11px;"></i> Approve Delivery
              </button>
              <button class="btn btn-secondary btn-sm btn-w" onclick="alert('Revision requested.')">
                Request Revision
              </button>
            </div>` : `
            <button class="btn btn-secondary btn-sm btn-w" disabled style="opacity:0.5;cursor:not-allowed;">
              Awaiting Delivery
            </button>`}
          </div>
        </div>

        <!-- Project details -->
        <div class="ws-panel">
          <div class="ws-panel-head">
            <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Details</span>
          </div>
          <div style="padding:12px 16px;">
            ${[
              {label:'Order ID', val:`#${String(project.id ?? 'N/A').toUpperCase()}`},
              {label:'Package', val:project.selectedPackage ?? project.package ?? 'Standard'},
              {label:'Due date', val:project.dueDate ?? 'TBD'},
              {label:'Platform fee', val:formatPrice(project.platformFee ?? 0)},
              {label:'Payout', val:formatPrice(project.payoutAmount ?? 0)},
            ].map(d => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--c-wire);font-size:0.8125rem;">
              <span style="color:var(--t4);">${d.label}</span>
              <span style="font-weight:600;font-family:${d.label==='Order ID'?'var(--font-mono)':'inherit'};">${d.val}</span>
            </div>`).join('')}
          </div>
        </div>

        <!-- Activity log -->
        <div class="ws-panel">
          <div class="ws-panel-head">
            <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Activity</span>
          </div>
          <div style="padding:12px 16px;">
            ${(project.activity?.slice(0,5) || [
              {type:'created', description:'Project created', timestamp:'Jul 12'},
              {type:'message', description:'First message sent', timestamp:'Jul 12'},
              {type:'file', description:'Reference track uploaded', timestamp:'Jul 13'},
              {type:'status', description:'Status: In Progress', timestamp:'Jul 13'},
              {type:'file', description:'golden_hook_v2.wav uploaded', timestamp:'Jul 14'},
            ]).map((a: any) => {
              const iconMap: Record<string,string> = { created:'fa-plus', message:'fa-comment', file:'fa-music', status:'fa-circle', payment:'fa-dollar-sign' };
              const colorMap: Record<string,string> = { created:'var(--signal)', message:'var(--patch)', file:'var(--warm)', status:'var(--s-ok)', payment:'var(--s-ok)' };
              return `
            <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--c-wire);">
              <div style="width:22px;height:22px;border-radius:50%;background:${colorMap[a.type]||'var(--c-rim)'}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                <i class="fas ${iconMap[a.type]||'fa-circle'}" style="font-size:8px;color:${colorMap[a.type]||'var(--t4)'}"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.8125rem;">${a.description}</div>
                <div class="mono-sm" style="color:var(--t4);">${a.timestamp}</div>
              </div>
            </div>`;}).join('')}
          </div>
        </div>

      </div>
    </div>
  </main>
</div>
${closeShell()}`;
}

// ─── Listing detail page (simple redirect to marketplace) ────────────────────
// PGES: Defensive checks on listing fields
function listingDetailPage(listing: any): string {
  if (!listing) return shell('Error', '') + '<div style="padding:40px;color:#F0F0F4;">Listing not found.</div>' + closeShell();
  const title = String(listing.title ?? 'Listing');
  const description = String(listing.description ?? '');
  const artistUrl = `/booking/${String(listing.userId ?? '')}?listing=${String(listing.id ?? '')}`;
  return shell(title, '') + authedNav() + `
<div style="max-width:900px;margin:0 auto;padding:48px 24px;">
  <div style="margin-bottom:24px;">
    <a href="/marketplace" style="font-size:0.8125rem;color:var(--t3);display:flex;align-items:center;gap:6px;"><i class="fas fa-arrow-left" style="font-size:11px;"></i> Back to Marketplace</a>
  </div>
  <h1 style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:8px;">${title}</h1>
  <p style="font-size:0.9375rem;color:var(--t3);margin-bottom:24px;">${description}</p>
  <a href="${artistUrl}" class="btn btn-primary btn-lg">
    <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
    Book this service
  </a>
</div>
${closeShell()}`;
}

const app = new Hono()

// ─── Security Headers Middleware ──────────────────────────────────────────────
// PGES: Security-first — apply to every response
app.use('*', async (c, next) => {
  await next();
  // Content Security Policy: prevent XSS
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
});

// ─── Public Pages ─────────────────────────────────────────────────────────────
app.get('/', (c) => c.html(homePage()))
app.get('/explore', (c) => c.html(explorePage()))
app.get('/marketplace', (c) => c.html(marketplacePage()))
app.get('/how-it-works', (c) => c.html(howItWorksPage()))
app.get('/terms', (c) => c.html(termsPage()))
app.get('/privacy', (c) => c.html(privacyPage()))
app.get('/contact', (c) => c.html(contactPage()))

// ─── Auth ─────────────────────────────────────────────────────────────────────
app.get('/login', (c) => c.html(loginPage()))
app.get('/signup', (c) => c.html(signupPage()))
app.get('/forgot-password', (c) => c.html(forgotPasswordPage()))
app.get('/logout', (c) => c.redirect('/login'))

// ─── Artist Profiles ─────────────────────────────────────────────────────────
// PGES: Sanitize input ID — only allow alphanumeric and hyphens/underscores
app.get('/artist/:id', (c) => {
  const rawId = c.req.param('id') ?? '';
  // Defensive: strip any characters that shouldn't be in an ID
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!id) return c.redirect('/explore');
  return c.html(artistPage(id))
})

// ─── Listings ─────────────────────────────────────────────────────────────────
// PGES: Sanitize listing ID, return 404 if not found
app.get('/listing/:id', (c) => {
  const rawId = c.req.param('id') ?? '';
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!id) return c.redirect('/marketplace');
  const listing = getListingById(id)
  if (!listing) {
    return c.html(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>404 — Artist Collab</title></head><body style="background:#030305;color:#F0F0F4;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;"><div><h1 style="color:#C8FF00;font-size:6rem;margin:0;">404</h1><p>Listing not found.</p><a href="/marketplace" style="color:#C8FF00;">Browse Marketplace →</a></div></body></html>`, 404)
  }
  return c.html(listingDetailPage(listing))
})

// ─── Booking ─────────────────────────────────────────────────────────────────
// PGES: Sanitize all route params and query params
app.get('/booking/:artistId', (c) => {
  const rawArtistId = c.req.param('artistId') ?? '';
  const artistId = rawArtistId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!artistId) return c.redirect('/marketplace');
  const rawListingId = c.req.query('listing') ?? '';
  const listingId = rawListingId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || undefined;
  return c.html(bookingPage(artistId, listingId))
})
app.get('/booking', (c) => {
  const rawListingId = c.req.query('listing') ?? '';
  const listingId = rawListingId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || undefined;
  const listing = listingId ? getListingById(listingId) : listings[0]
  if (!listing) return c.redirect('/marketplace')
  return c.html(bookingPage(listing.userId, listingId))
})
app.get('/order-confirmation', (c) => c.html(orderConfirmationPage()))

// ─── Dashboard / Authenticated ───────────────────────────────────────────────
app.get('/dashboard', (c) => c.html(dashboardPage()))
app.get('/dashboard/projects', (c) => c.html(projectsPage()))
app.get('/dashboard/messages', (c) => c.html(messagesPage()))
app.get('/dashboard/orders', (c) => c.html(ordersPage()))
app.get('/dashboard/earnings', (c) => c.html(earningsPage()))
app.get('/dashboard/listings', (c) => c.html(listingsPage()))
app.get('/dashboard/settings', (c) => c.html(settingsPage()))

// Profile shortcuts
app.get('/profile/me', (c) => c.html(artistPage(users[0].id)))

// Workspace
// PGES: Sanitize project ID, defensive fallback to projects page
app.get('/workspace/:id', (c) => {
  const rawId = c.req.param('id') ?? '';
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  if (!id) return c.redirect('/dashboard/projects')
  const project = getProjectById(id)
  if (!project) return c.redirect('/dashboard/projects')
  return c.html(workspacePage(project))
})

// ─── Admin ───────────────────────────────────────────────────────────────────
app.get('/admin', (c) => c.html(adminPage()))
app.get('/admin/*', (c) => c.html(adminPage()))

// ─── Shortcuts ───────────────────────────────────────────────────────────────
app.get('/settings', (c) => c.html(settingsPage()))
app.get('/messages', (c) => c.redirect('/dashboard/messages'))
app.get('/projects', (c) => c.redirect('/dashboard/projects'))

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
    body { margin: 0; background: #030305; color: #F0F0F4; font-family: 'Inter', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; }
    h1 { font-family: 'Syne', sans-serif; font-size: clamp(5rem, 15vw, 10rem); font-weight: 800; color: #C8FF00; letter-spacing: -0.04em; line-height: 1; margin: 0 0 16px; }
    p { color: #52526A; margin: 0 0 32px; font-size: 1.0625rem; }
    a { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; background: #C8FF00; color: #000; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.9375rem; }
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
