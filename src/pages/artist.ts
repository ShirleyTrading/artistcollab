import { shell, closeShell, publicNav, siteFooter } from '../layout';
import {
  users, listings, reviews, splitSheets, agreements,
  formatPrice, formatListeners, proLabel,
  getListingsByUser, getReviewsByUser, getSplitSheetByProject,
  type User,
} from '../data';

// ─── Platform icons map ───────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, { icon: string; label: string; color: string }> = {
  instagram:   { icon: 'fa-instagram',   label: 'Instagram',    color: '#E1306C' },
  spotify:     { icon: 'fa-spotify',     label: 'Spotify',      color: '#1DB954' },
  apple_music: { icon: 'fa-apple',       label: 'Apple Music',  color: '#FC3C44' },
  soundcloud:  { icon: 'fa-soundcloud',  label: 'SoundCloud',   color: '#FF5500' },
  youtube:     { icon: 'fa-youtube',     label: 'YouTube',      color: '#FF0000' },
  tiktok:      { icon: 'fa-tiktok',      label: 'TikTok',       color: '#69C9D0' },
  twitter:     { icon: 'fa-twitter',     label: 'Twitter/X',    color: '#1DA1F2' },
  facebook:    { icon: 'fa-facebook-f',  label: 'Facebook',     color: '#1877F2' },
};

export function artistPage(userId: string): string {
  // Defensive lookup
  const user = users.find(u => u.id === userId);
  if (!user) {
    return shell('Artist Not Found', '') + publicNav() + `
<div style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:80px 24px;">
  <div style="text-align:center;">
    <div style="font-size:3rem;margin-bottom:16px;">⚡</div>
    <h1 class="d3" style="margin-bottom:12px;">Artist not found</h1>
    <p class="body-base">This artist doesn't exist or has been removed.</p>
    <a href="/explore" class="btn btn-primary" style="margin-top:24px;">Browse Artists</a>
  </div>
</div>
${siteFooter()}${closeShell()}`;
  }

  const artistListings = getListingsByUser(userId);
  const artistReviews  = getReviewsByUser(userId);
  const activeListings = artistListings.filter(l => l.active);

  const stripColors = ['var(--signal)', 'var(--patch)', 'var(--warm)', 'var(--channel)', 'var(--s-ok)'];
  const userIndex   = users.findIndex(u => u.id === userId);
  const idColor     = stripColors[Math.max(0, userIndex) % stripColors.length];

  // Waveform bar heights (seeded per artist index)
  const seed = Math.max(0, userIndex) + 1;
  const wh   = Array.from({ length: 40 }, (_, i) => {
    const v = Math.abs(Math.sin(i * seed * 0.7 + seed)) * 0.7 + 0.3;
    return Math.min(1, v);
  });

  // ── Collaboration preferences ──────────────────────────────────────────────
  const cp = user.collabPreferences;

  // ── Streaming / social link rendering ─────────────────────────────────────
  function renderSocialLinks(links: { platform: string; url: string }[]): string {
    if (!links?.length) return '';
    return links.map(sl => {
      const cfg = PLATFORM_ICONS[sl.platform.toLowerCase()] ?? { icon: 'fa-link', label: sl.platform, color: 'var(--t3)' };
      return `
      <a href="${sl.url}" target="_blank" rel="noopener noreferrer"
         class="btn btn-secondary btn-sm"
         style="gap:7px;border-color:${cfg.color}22;"
         aria-label="${cfg.label}">
        <i class="fab ${cfg.icon}" style="font-size:13px;color:${cfg.color};"></i>
        <span>${cfg.label}</span>
      </a>`;
    }).join('');
  }

  const availColor = user.availability === 'available' ? 'var(--s-ok)' : user.availability === 'busy' ? 'var(--channel)' : 'var(--t4)';
  const availGlow  = user.availability === 'available' ? 'rgba(45,202,114,0.5)' : 'rgba(255,77,109,0.5)';
  const availLabel = user.availability === 'available' ? 'Available' : user.availability === 'busy' ? 'Busy' : 'Away';

  // Fastest delivery across all active listings
  const fastestDelivery = activeListings.length
    ? Math.min(...activeListings.map(l => l.packages?.[0]?.deliveryDays ?? 7))
    : null;

  return shell(`${user.artistName} — Artist Profile`, `
  /* ══ Artist Profile Styles ═════════════════════════════════════════════════ */

  .ap-cover {
    position: relative;
    height: 240px;
    overflow: hidden;
    background: var(--c-base);
  }
  .ap-cover img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.28;
  }
  .ap-cover-grad {
    position: absolute; inset: 0;
    background:
      linear-gradient(to bottom, rgba(3,3,5,0) 30%, var(--c-void) 100%),
      linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 55%);
  }
  .ap-waveform {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 64px;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    padding: 0 32px;
    opacity: 0.1;
    pointer-events: none;
  }

  /* ── Hero ── */
  .ap-hero {
    background: var(--c-void);
    border-bottom: 1px solid var(--c-wire);
  }
  .ap-hero-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px 20px;
  }

  /* Avatar row */
  .ap-avatar-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: -56px;
    padding-bottom: 14px;
    position: relative;
    z-index: 2;
  }
  .ap-avatar-wrap { position: relative; flex-shrink: 0; }
  .ap-avatar-wrap img {
    display: block;
    width: 108px; height: 108px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--c-void);
    box-shadow: 0 0 0 2px ${idColor};
  }
  .ap-verified-dot {
    position: absolute;
    bottom: 6px; right: 6px;
    width: 22px; height: 22px;
    background: var(--signal);
    border-radius: 50%;
    border: 3px solid var(--c-void);
    display: flex; align-items: center; justify-content: center;
  }
  .ap-cta-row {
    display: flex;
    gap: 8px;
    align-items: center;
    padding-bottom: 4px;
  }

  /* Name block */
  .ap-name-block { padding-bottom: 0; }
  .ap-name {
    font-family: var(--font-display);
    font-size: clamp(1.625rem, 4vw, 2.25rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin: 0 0 8px;
    word-break: break-word;
  }
  .ap-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    margin-bottom: 10px;
  }
  /* Single clean meta row — location · response time · listeners */
  .ap-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    margin-bottom: 10px;
    font-size: 0.8125rem;
    color: var(--t3);
  }
  .ap-meta-row i { color: var(--t4); margin-right: 4px; }
  .ap-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .ap-id-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px 3px 5px;
    background: var(--c-raised);
    border: 1px solid ${idColor}33;
    border-radius: var(--r-full);
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--t4);
  }

  /* ── Stats strip: 4 unique stats only ── */
  .ap-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--c-base);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .ap-stat {
    padding: 14px 12px;
    text-align: center;
    border-right: 1px solid var(--c-wire);
    min-width: 0;
  }
  .ap-stat:last-child { border-right: none; }
  .ap-stat-val {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ap-stat-lbl {
    font-family: var(--font-mono);
    font-size: 0.52rem;
    color: var(--t4);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .ap-stats-wrap {
    padding: 0 24px 20px;
    max-width: 1280px;
    margin: 0 auto;
  }

  /* Tabs */
  .ap-tabs-bar {
    background: var(--c-void);
    border-bottom: 1px solid var(--c-wire);
  }
  .ap-tabs {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ap-tabs::-webkit-scrollbar { display: none; }
  .ap-tab {
    padding: 13px 18px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--t3);
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    background: none;
    border-top: none; border-left: none; border-right: none;
    font-family: var(--font-body);
    margin-bottom: -1px;
    transition: color var(--t-fast), border-color var(--t-fast);
  }
  .ap-tab:hover { color: var(--t1); }
  .ap-tab.on { color: var(--t1); border-bottom-color: ${idColor}; }

  /* Content layout */
  .ap-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 28px;
    align-items: start;
    max-width: 1280px;
    margin: 0 auto;
    padding: 28px 24px 80px;
  }

  /* Listing card */
  .ap-listing {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    cursor: pointer;
    transition: border-color var(--t-base), transform var(--t-base), box-shadow var(--t-base);
  }
  .ap-listing:hover {
    border-color: rgba(255,255,255,0.1);
    transform: translateY(-2px);
    box-shadow: var(--sh);
  }

  /* Booking sidebar — streamlined */
  .ap-sidebar {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    position: sticky;
    top: 76px;
  }
  .ap-sidebar-head {
    padding: 20px;
    border-bottom: 1px solid var(--c-wire);
    background: var(--c-raised);
    border-top: 3px solid ${idColor};
  }
  .ap-sidebar-avail {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .ap-sidebar-price-label {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    color: var(--t4);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 3px;
  }
  .ap-sidebar-price {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${idColor};
    line-height: 1;
    margin-bottom: 3px;
  }
  .ap-sidebar-body { padding: 18px 20px; }

  /* Review card */
  .ap-review {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-left: 2px solid ${idColor};
    border-radius: var(--r-lg);
    padding: 20px;
    transition: border-color var(--t-base);
  }
  .ap-review:hover { border-color: rgba(255,255,255,0.09); border-left-color: ${idColor}; }

  /* Song row */
  .ap-song {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--r);
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    cursor: pointer;
    transition: border-color var(--t-fast), background var(--t-fast);
  }
  .ap-song:hover { border-color: rgba(255,255,255,0.1); background: var(--c-lift); }

  /* Collab pref card */
  .cp-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    margin-bottom: 16px;
  }
  .cp-head {
    padding: 11px 16px;
    background: var(--c-raised);
    border-bottom: 1px solid var(--c-wire);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--t4);
    display: flex; align-items: center; gap: 8px;
  }
  .cp-body { padding: 14px 16px; }
  .collab-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: var(--r-full);
    font-size: 0.7rem;
    font-weight: 600;
    border: 1px solid var(--c-wire);
    background: var(--c-raised);
    color: var(--t3);
  }
  .collab-tag-split {
    background: var(--signal-dim);
    border-color: rgba(200,255,0,0.2);
    color: var(--signal);
  }
  .collab-tag-hire {
    background: rgba(255,140,66,0.1);
    border-color: rgba(255,140,66,0.25);
    color: var(--warm);
  }
  .nda-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: var(--r-full);
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.22);
    font-family: var(--font-mono);
    font-size: 0.58rem;
    color: #22c55e;
  }

  /* ── RESPONSIVE ─────────────────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .ap-layout { grid-template-columns: 1fr; }
    .ap-sidebar { position: static; }
  }
  @media (max-width: 768px) {
    .ap-cover { height: 170px; }
    .ap-avatar-row { margin-top: -48px; }
    .ap-avatar-wrap img { width: 84px; height: 84px; border-width: 3px; }
    .ap-verified-dot { width: 18px; height: 18px; bottom: 4px; right: 4px; }
    .ap-name { font-size: 1.5rem; }
    .ap-stats {
      grid-template-columns: repeat(4, minmax(70px, 1fr));
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .ap-stat { padding: 12px 8px; }
    .ap-stat-val { font-size: 0.9rem; }
    .ap-layout { padding: 20px 16px 64px; gap: 20px; }
    .ap-tabs { padding: 0 16px; }
    .ap-tab { padding: 12px 14px; min-height: 48px; font-size: 0.8125rem; }
    .ap-hero-inner { padding: 0 16px 16px; }
    .ap-stats-wrap { padding: 0 16px 16px; }
  }
  @media (max-width: 480px) {
    .ap-cover { height: 140px; }
    .ap-avatar-row { margin-top: -42px; }
    .ap-avatar-wrap img { width: 76px; height: 76px; }
    .ap-name { font-size: 1.375rem; }
    .ap-meta-row { gap: 10px; font-size: 0.75rem; }
    .ap-cta-row .btn-sm span { display: none; }
  }
`) + publicNav('explore') + `

<!-- ══ COVER BAND ══════════════════════════════════════════════════════════ -->
<div class="ap-cover" style="border-bottom:3px solid ${idColor};">
  <img src="${user.coverImage || user.profileImage}" alt="${user.artistName} cover">
  <div class="ap-cover-grad"></div>
  <div class="ap-waveform">
    ${wh.map(h => `<div style="flex:1;height:${Math.round(h * 100)}%;background:${idColor};border-radius:2px 2px 0 0;"></div>`).join('')}
  </div>
</div>

<!-- ══ HERO HEADER ═════════════════════════════════════════════════════════ -->
<div class="ap-hero">
  <div class="ap-hero-inner">

    <!-- Avatar row: avatar left, CTA buttons right -->
    <div class="ap-avatar-row">
      <div class="ap-avatar-wrap">
        <img src="${user.profileImage}" alt="${user.artistName}">
        ${user.verified ? `<div class="ap-verified-dot"><i class="fas fa-check" style="font-size:8px;color:#000;"></i></div>` : ''}
      </div>
      <div class="ap-cta-row">
        <a href="/booking/${user.id}" class="btn btn-primary">
          <i class="fas fa-microphone-alt" style="font-size:12px;"></i>
          <span>Book Now</span>
        </a>
        <button class="btn btn-secondary btn-sm" style="width:40px;padding:0;justify-content:center;"
                onclick="alert('Artist saved to your favourites.')" title="Save artist">
          <i class="fas fa-bookmark" style="font-size:12px;"></i>
        </button>
      </div>
    </div>

    <!-- Name + badges + ONE clean meta row -->
    <div class="ap-name-block">
      <h1 class="ap-name">${user.artistName}</h1>

      <!-- Badges: verified · account type · NDA · username pill -->
      <div class="ap-badges">
        ${user.verified ? `<span class="badge badge-signal" style="font-size:0.65rem;"><i class="fas fa-check-circle" style="font-size:9px;"></i> Verified</span>` : ''}
        <span class="badge badge-muted" style="font-size:0.65rem;">${user.accountType === 'producer' ? 'Producer' : 'Artist'}</span>
        ${user.ndaStatus === 'signed' ? `<span class="nda-pill"><i class="fas fa-shield-halved" style="font-size:8px;"></i> NDA Signed</span>` : ''}
        <div class="ap-id-pill">
          <div style="width:6px;height:6px;border-radius:50%;background:${idColor};box-shadow:0 0 5px ${idColor};"></div>
          <span>@${user.username}</span>
        </div>
      </div>

      <!--
        Meta row: location · response time · monthly listeners
        (PRO affiliation lives in Collab Info tab — not duplicated here)
        (Availability lives in the stats strip — not duplicated here)
      -->
      <div class="ap-meta-row">
        <span><i class="fas fa-map-marker-alt"></i>${user.location}</span>
        <span><i class="fas fa-clock"></i>Responds ${user.responseTime}</span>
        <span><i class="fas fa-headphones" style="color:${idColor};"></i>${formatListeners(user.monthlyListeners)} monthly listeners</span>
      </div>

      <!-- Genre + tag pills -->
      <div class="ap-tags">
        ${user.genre.map(g => `<span class="badge badge-muted">${g}</span>`).join('')}
        ${(user.tags ?? []).slice(0, 3).map((t: string) => `<span class="badge badge-muted">${t}</span>`).join('')}
      </div>
    </div>

  </div>

  <!--
    Stats strip — 4 unique, non-redundant stats:
    Rating | Projects Done | Starting Price | Availability
    (Listeners already in meta row above — not repeated here)
  -->
  <div class="ap-stats-wrap">
    <div class="ap-stats">
      ${[
        { val: `★ ${user.rating.toFixed(1)}`, lbl: `${user.reviewCount} Reviews`,   color: 'var(--signal)' },
        { val: String(user.completedProjects), lbl: 'Projects Done',                 color: 'var(--patch)'  },
        { val: formatPrice(user.startingPrice), lbl: 'Starting From',                color: idColor         },
        { val: availLabel,                      lbl: 'Status',                       color: availColor       },
      ].map(s => `
      <div class="ap-stat">
        <div class="ap-stat-val" style="color:${s.color};">${s.val}</div>
        <div class="ap-stat-lbl">${s.lbl}</div>
      </div>`).join('')}
    </div>
  </div>
</div>

<!-- ══ TAB NAV ═══════════════════════════════════════════════════════════ -->
<div class="ap-tabs-bar">
  <div class="ap-tabs">
    <button class="ap-tab on"  onclick="switchTab('about',this)">About</button>
    <button class="ap-tab"     onclick="switchTab('listings',this)">Services <span style="font-family:var(--font-mono);font-size:0.62rem;color:var(--t4);">${activeListings.length}</span></button>
    <button class="ap-tab"     onclick="switchTab('collab',this)">Collab Info</button>
    <button class="ap-tab"     onclick="switchTab('reviews',this)">Reviews <span style="font-family:var(--font-mono);font-size:0.62rem;color:var(--t4);">${user.reviewCount}</span></button>
    ${(user.featuredSongs?.length ?? 0) > 0 ? `<button class="ap-tab" onclick="switchTab('music',this)">Music <span style="font-family:var(--font-mono);font-size:0.62rem;color:var(--t4);">${user.featuredSongs.length}</span></button>` : ''}
  </div>
</div>

<!-- ══ MAIN CONTENT ═══════════════════════════════════════════════════════ -->
<div class="ap-layout">

  <!-- ── LEFT: Tabbed content ── -->
  <div>

    <!-- ABOUT TAB -->
    <div id="tab-about">

      <!-- Bio -->
      <div style="margin-bottom:32px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <div style="height:1px;width:20px;background:${idColor};box-shadow:0 0 5px ${idColor};"></div>
          <span style="font-family:var(--font-mono);font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">About</span>
        </div>
        <p style="font-size:1rem;line-height:1.85;color:var(--t2);max-width:640px;">${user.bio}</p>
      </div>

      <!-- Streaming / Social links -->
      ${(user.socialLinks?.length ?? 0) > 0 ? `
      <div style="margin-bottom:32px;">
        <div style="font-family:var(--font-mono);font-size:0.62rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--t4);margin-bottom:12px;">Streaming &amp; Socials</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${renderSocialLinks(user.socialLinks)}
        </div>
      </div>` : ''}

      <!-- Management contact (only shown here in About — not duplicated in Collab tab) -->
      ${user.managementContact ? `
      <div style="margin-bottom:28px;padding:14px 16px;background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="width:36px;height:36px;background:var(--c-raised);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-briefcase" style="color:var(--patch);font-size:13px;"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:0.8125rem;font-weight:700;margin-bottom:2px;">${user.managementContact.name}</div>
          <div style="font-size:0.75rem;color:var(--t3);">${user.managementContact.company ?? ''}</div>
        </div>
        <a href="mailto:${user.managementContact.email}" class="btn btn-secondary btn-xs">
          <i class="fas fa-envelope" style="font-size:10px;"></i> Contact Management
        </a>
      </div>` : ''}

      <!-- Featured services preview (2 max) -->
      ${activeListings.length > 0 ? `
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="height:1px;width:20px;background:${idColor};"></div>
            <span style="font-family:var(--font-mono);font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">Featured Services</span>
          </div>
          <button class="btn btn-ghost btn-xs" style="color:var(--t3);" onclick="switchTab('listings', document.querySelector('.ap-tab:nth-child(2)'))">View All ${activeListings.length} →</button>
        </div>
        <div style="display:grid;gap:12px;">
          ${activeListings.slice(0, 2).map(l => {
            const pkg0 = l.packages?.[0];
            const hasSplits = l.collabTypes?.includes('ownership_split');
            const hasHire   = l.collabTypes?.includes('pay_for_hire');
            return `
          <div class="ap-listing" onclick="window.location='/listing/${l.id}'" style="border-left:3px solid ${idColor};">
            <div style="padding:16px;">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;">
                <div style="flex:1;min-width:0;">
                  <h3 style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${l.title}</h3>
                  <div style="display:flex;gap:5px;flex-wrap:wrap;">
                    <span class="badge badge-muted">${l.category}</span>
                    ${hasHire   ? `<span class="collab-tag collab-tag-hire" style="font-size:0.65rem;"><i class="fas fa-dollar-sign" style="font-size:7px;"></i> Pay-for-Hire</span>` : ''}
                    ${hasSplits ? `<span class="collab-tag collab-tag-split" style="font-size:0.65rem;"><i class="fas fa-chart-pie" style="font-size:7px;"></i> Splits</span>` : ''}
                  </div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                  <div style="font-size:1.125rem;font-weight:800;letter-spacing:-0.02em;color:${idColor};">${formatPrice(pkg0?.price ?? 0)}</div>
                  <div class="mono-sm" style="color:var(--t4);">${pkg0?.deliveryDays ?? '?'}d delivery</div>
                </div>
              </div>
              <p style="font-size:0.8125rem;color:var(--t3);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${l.description}</p>
            </div>
            <div style="padding:10px 16px;background:var(--c-raised);border-top:1px solid var(--c-wire);display:flex;gap:6px;flex-wrap:wrap;">
              ${l.packages.map((p, pi) => `<span style="padding:3px 10px;border-radius:var(--r-xs);font-size:0.7rem;font-weight:600;background:${pi===0?'var(--signal-dim)':'var(--c-sub)'};border:1px solid ${pi===0?'rgba(200,255,0,0.25)':'var(--c-wire)'};color:${pi===0?'var(--signal)':'var(--t3)'};">${p.name}</span>`).join('')}
            </div>
          </div>`;
          }).join('')}
        </div>
      </div>` : ''}
    </div>

    <!-- SERVICES TAB -->
    <div id="tab-listings" style="display:none;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
        <div style="height:1px;width:20px;background:${idColor};"></div>
        <span style="font-family:var(--font-mono);font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">All Services</span>
      </div>
      <div style="display:grid;gap:16px;">
        ${activeListings.length > 0 ? activeListings.map(l => {
          const pkg0 = l.packages?.[0];
          const hasSplits = l.collabTypes?.includes('ownership_split');
          const hasHire   = l.collabTypes?.includes('pay_for_hire');
          return `
        <div class="ap-listing" onclick="window.location='/listing/${l.id}'" style="border-left:3px solid ${idColor};">
          <div style="padding:20px;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
              <div style="flex:1;min-width:0;">
                <h3 style="font-size:1rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${l.title}</h3>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <span class="badge badge-muted">${l.category}</span>
                  ${(l.fileFormats ?? []).slice(0, 2).map((f: string) => `<span class="badge badge-muted">${f}</span>`).join('')}
                  ${hasHire   ? `<span class="collab-tag collab-tag-hire"><i class="fas fa-dollar-sign" style="font-size:8px;"></i> Pay-for-Hire</span>` : ''}
                  ${hasSplits ? `<span class="collab-tag collab-tag-split"><i class="fas fa-chart-pie" style="font-size:8px;"></i> Splits Available</span>` : ''}
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0;">
                <div style="font-size:1.375rem;font-weight:800;letter-spacing:-0.03em;color:${idColor};">${formatPrice(pkg0?.price ?? 0)}</div>
                <div class="mono-sm" style="color:var(--t4);">${pkg0?.deliveryDays ?? '?'}d · ${l.orders ?? 0} orders</div>
              </div>
            </div>
            <p style="font-size:0.875rem;color:var(--t3);line-height:1.6;margin-bottom:14px;">${l.description}</p>
            <div style="display:flex;flex-direction:column;gap:5px;">
              ${(pkg0?.features ?? []).slice(0, 4).map((f: string) => `
              <div style="display:flex;align-items:center;gap:7px;font-size:0.8125rem;color:var(--t3);">
                <i class="fas fa-check" style="color:${idColor};font-size:10px;flex-shrink:0;"></i>${f}
              </div>`).join('')}
            </div>
          </div>
          <div style="padding:12px 20px;background:var(--c-raised);border-top:1px solid var(--c-wire);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${l.packages.map((p, pi) => `<span style="padding:4px 12px;border-radius:var(--r-xs);font-size:0.72rem;font-weight:600;background:${pi===0?'var(--signal-dim)':'var(--c-sub)'};border:1px solid ${pi===0?'rgba(200,255,0,0.25)':'var(--c-wire)'};color:${pi===0?'var(--signal)':'var(--t3)'};">${p.name} · ${formatPrice(p.price)}</span>`).join('')}
            </div>
            <a href="/booking/${user.id}?listing=${l.id}" class="btn btn-primary btn-sm">Book This</a>
          </div>
        </div>`;
        }).join('') : `<div style="padding:48px;text-align:center;color:var(--t4);">No active services.</div>`}
      </div>
    </div>

    <!-- COLLAB INFO TAB -->
    <div id="tab-collab" style="display:none;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
        <div style="height:1px;width:20px;background:${idColor};"></div>
        <span style="font-family:var(--font-mono);font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">Collaboration Info</span>
      </div>

      <!-- PRO Affiliation (only place it appears) -->
      <div class="cp-card" style="border-top:2px solid var(--patch);">
        <div class="cp-head"><i class="fas fa-music" style="color:var(--patch);"></i> PRO Affiliation &amp; Registration</div>
        <div class="cp-body">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <div style="padding:10px 18px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);display:flex;align-items:center;gap:10px;">
              <i class="fas fa-id-card" style="color:var(--patch);font-size:1rem;"></i>
              <div>
                <div style="font-weight:700;font-size:0.9375rem;">${proLabel(user.proAffiliation)}</div>
                <div class="mono-sm" style="color:var(--t4);">Performing Rights Organization</div>
              </div>
            </div>
            ${user.proIpiNumber ? `
            <div style="padding:10px 18px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);">
              <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:600;">${user.proIpiNumber}</div>
              <div class="mono-sm" style="color:var(--t4);">IPI / CAE Number</div>
            </div>` : ''}
          </div>
        </div>
      </div>

      <!-- Collab Preferences -->
      <div class="cp-card" style="border-top:2px solid ${idColor};">
        <div class="cp-head"><i class="fas fa-handshake" style="color:${idColor};"></i> Collaboration Preferences</div>
        <div class="cp-body">
          <div style="margin-bottom:16px;">
            <div class="mono-sm" style="color:var(--t4);margin-bottom:8px;">ACCEPTED COLLAB TYPES</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${(cp?.preferredCollabTypes ?? []).map(t =>
                t === 'ownership_split'
                  ? `<span class="collab-tag collab-tag-split"><i class="fas fa-chart-pie" style="font-size:9px;"></i> Ownership / Royalty Split</span>`
                  : `<span class="collab-tag collab-tag-hire"><i class="fas fa-dollar-sign" style="font-size:9px;"></i> Pay-for-Hire</span>`
              ).join('')}
              ${!(cp?.preferredCollabTypes?.length) ? `<span class="collab-tag">Not specified</span>` : ''}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:16px;">
            <div style="padding:12px 14px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);">
              <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:var(--warm);">${formatPrice(cp?.featureRate ?? 0)}</div>
              <div class="mono-sm" style="color:var(--t4);">Feature Rate</div>
            </div>
            ${cp?.openToSplits ? `
            <div style="padding:12px 14px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.2);border-radius:var(--r-md);">
              <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:var(--signal);">${cp.splitMin}%<span style="font-size:0.8rem;font-weight:500;color:var(--t3);"> min</span></div>
              <div class="mono-sm" style="color:var(--t4);">Min Ownership Split</div>
            </div>` : `
            <div style="padding:12px 14px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);opacity:0.6;">
              <div style="font-size:0.875rem;font-weight:600;color:var(--t3);">Splits: Closed</div>
              <div class="mono-sm" style="color:var(--t4);">Work-for-hire only</div>
            </div>`}
          </div>

          ${(cp?.genres?.length ?? 0) > 0 ? `
          <div style="margin-bottom:16px;">
            <div class="mono-sm" style="color:var(--t4);margin-bottom:8px;">OPEN TO THESE GENRES</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${(cp.genres ?? []).map(g => `<span class="badge badge-muted">${g}</span>`).join('')}
            </div>
          </div>` : ''}

          ${cp?.notes ? `
          <div style="padding:12px 14px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);font-size:0.8125rem;color:var(--t3);line-height:1.6;">
            <i class="fas fa-quote-left" style="color:var(--t4);margin-right:6px;"></i>${cp.notes}
          </div>` : ''}
        </div>
      </div>

      <!-- Legal Status -->
      <div class="cp-card">
        <div class="cp-head"><i class="fas fa-shield-halved" style="color:#22c55e;"></i> Legal Status</div>
        <div class="cp-body">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:var(--r-md);background:${user.ndaStatus === 'signed' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)'};border:1px solid ${user.ndaStatus === 'signed' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'};">
              <i class="fas ${user.ndaStatus === 'signed' ? 'fa-check-circle' : 'fa-clock'}" style="color:${user.ndaStatus === 'signed' ? '#22c55e' : '#f59e0b'};"></i>
              <span style="font-size:0.8125rem;font-weight:600;color:${user.ndaStatus === 'signed' ? '#22c55e' : '#f59e0b'};">NDA ${user.ndaStatus === 'signed' ? 'On File' : 'Unsigned'}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:var(--r-md);background:${user.platformAgreementSigned ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)'};border:1px solid ${user.platformAgreementSigned ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'};">
              <i class="fas ${user.platformAgreementSigned ? 'fa-check-circle' : 'fa-clock'}" style="color:${user.platformAgreementSigned ? '#22c55e' : '#f59e0b'};"></i>
              <span style="font-size:0.8125rem;font-weight:600;color:${user.platformAgreementSigned ? '#22c55e' : '#f59e0b'};">Platform Agreement ${user.platformAgreementSigned ? 'Signed' : 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- REVIEWS TAB -->
    <div id="tab-reviews" style="display:none;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="height:1px;width:20px;background:${idColor};"></div>
          <span style="font-family:var(--font-mono);font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">Reviews</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-family:var(--font-display);font-size:2rem;font-weight:800;letter-spacing:-0.04em;">${user.rating.toFixed(1)}</span>
          <div>
            <div style="color:var(--signal);letter-spacing:2px;">${'★'.repeat(Math.round(user.rating))}</div>
            <div class="mono-sm" style="color:var(--t4);">${user.reviewCount} reviews</div>
          </div>
        </div>
      </div>
      <div style="display:grid;gap:12px;">
        ${artistReviews.length ? artistReviews.map(r => {
          const reviewer = users.find(u => u.id === r.reviewerId);
          const avgRating = Math.round((r.professionalism + r.deliveryTime + r.quality + r.communication) / 4);
          return `
        <div class="ap-review">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
            <img src="${reviewer?.profileImage ?? 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40&h=40&fit=crop'}"
                 class="av av-sm" style="border:1.5px solid var(--c-rim);" alt="${reviewer?.artistName ?? 'Reviewer'}">
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.875rem;font-weight:700;">${reviewer?.artistName ?? 'Anonymous'}</div>
              <div class="mono-sm" style="color:var(--t4);">${r.createdAt}</div>
            </div>
            <div style="color:var(--signal);letter-spacing:2px;font-size:0.875rem;">${'★'.repeat(avgRating)}</div>
          </div>
          <p style="font-size:0.875rem;line-height:1.7;color:var(--t2);margin:0 0 10px;">"${r.text}"</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${[
              { label: 'Quality',       val: r.quality },
              { label: 'Delivery',      val: r.deliveryTime },
              { label: 'Comm.',         val: r.communication },
              { label: 'Professional',  val: r.professionalism },
            ].map(m => `<div style="font-size:0.7rem;color:var(--t4);">${m.label} <span style="color:var(--signal);font-weight:700;">${m.val}/5</span></div>`).join('')}
          </div>
        </div>`;
        }).join('') : `
        <div style="text-align:center;padding:60px 24px;background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);">
          <div style="font-size:2rem;margin-bottom:12px;">🎵</div>
          <p style="color:var(--t3);margin:0;">No reviews yet — be the first to collaborate!</p>
        </div>`}
      </div>
    </div>

    <!-- MUSIC TAB -->
    <div id="tab-music" style="display:none;">
      ${(user.featuredSongs?.length ?? 0) > 0 ? `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
        <div style="height:1px;width:20px;background:${idColor};"></div>
        <span style="font-family:var(--font-mono);font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">Featured Songs</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${user.featuredSongs.map((song: { title: string; url: string }, si: number) => `
        <div class="ap-song">
          <div style="width:36px;height:36px;background:${idColor}20;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-music" style="color:${idColor};font-size:13px;"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.875rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${song.title}</div>
            <div class="mono-sm" style="color:var(--t4);">by ${user.artistName}</div>
          </div>
          <span class="mono-sm" style="color:var(--t4);">${String(si + 1).padStart(2, '0')}</span>
          <button style="background:none;border:none;color:var(--t3);cursor:pointer;padding:6px;font-size:1rem;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;border-radius:var(--r-sm);transition:color 0.15s,background 0.15s;"
            onmouseover="this.style.color='var(--t1)';this.style.background='var(--c-raised)'"
            onmouseout="this.style.color='var(--t3)';this.style.background='transparent'"
            onclick="alert('Preview: ${song.title.replace(/'/g, "\\'")}')">
            <i class="fas fa-play-circle"></i>
          </button>
        </div>`).join('')}
      </div>` : `<p style="text-align:center;padding:40px 0;color:var(--t4);">No featured songs yet.</p>`}
    </div>

  </div>

  <!-- ── RIGHT SIDEBAR — clean, no duplicated data ── -->
  <div>
    <div class="ap-sidebar">

      <!-- Head: availability status + price (these are the ONLY place price appears in sidebar) -->
      <div class="ap-sidebar-head">
        <div class="ap-sidebar-avail">
          <div style="width:8px;height:8px;border-radius:50%;background:${availColor};box-shadow:0 0 8px ${availGlow};flex-shrink:0;"></div>
          <span style="font-size:0.8125rem;font-weight:700;color:${availColor};">${availLabel}</span>
          <span class="mono-sm" style="color:var(--t4);">to collaborate</span>
        </div>
        <div class="ap-sidebar-price-label">Starting at</div>
        <div class="ap-sidebar-price">${formatPrice(user.startingPrice)}</div>
        <div class="mono-sm" style="color:var(--t4);">per feature / collaboration</div>
      </div>

      <!-- Body: delivery info + CTA buttons + trust badge -->
      <div class="ap-sidebar-body">

        <!-- Quick delivery facts (NOT duplicating meta-row data) -->
        <div style="display:flex;gap:16px;margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid var(--c-wire);">
          <div style="flex:1;text-align:center;">
            <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:var(--t1);">${fastestDelivery !== null ? fastestDelivery + 'd' : '—'}</div>
            <div class="mono-sm" style="color:var(--t4);">Delivery</div>
          </div>
          <div style="width:1px;background:var(--c-wire);"></div>
          <div style="flex:1;text-align:center;">
            <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:var(--t1);">${activeListings[0]?.packages?.[0]?.revisions ?? 2}</div>
            <div class="mono-sm" style="color:var(--t4);">Revisions</div>
          </div>
          <div style="width:1px;background:var(--c-wire);"></div>
          <div style="flex:1;text-align:center;">
            <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:var(--signal);">★ ${user.rating.toFixed(1)}</div>
            <div class="mono-sm" style="color:var(--t4);">Rating</div>
          </div>
        </div>

        <!-- Primary CTA -->
        <a href="/booking/${user.id}" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-bottom:8px;">
          <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
          Book a Session
        </a>
        <a href="/dashboard/messages" class="btn btn-secondary" style="width:100%;justify-content:center;font-size:0.875rem;padding:10px;">
          <i class="fas fa-comment-dots" style="font-size:12px;"></i>
          Message Artist
        </a>

        <!-- Escrow trust notice -->
        <div style="margin-top:14px;padding:12px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.18);border-radius:var(--r);display:flex;gap:8px;">
          <i class="fas fa-shield-alt" style="color:var(--signal);font-size:0.875rem;flex-shrink:0;margin-top:1px;"></i>
          <div>
            <div style="font-size:0.75rem;font-weight:700;color:var(--signal);margin-bottom:3px;">Escrow Protected</div>
            <div style="font-size:0.75rem;color:var(--t3);line-height:1.5;">Payment held securely until you approve the delivery.</div>
          </div>
        </div>

        <!-- See collab terms link -->
        <button onclick="switchTab('collab', document.querySelectorAll('.ap-tab')[2])" style="background:none;border:none;width:100%;padding:10px 0 0;font-size:0.75rem;color:var(--t4);cursor:pointer;font-family:var(--font-body);text-align:center;display:flex;align-items:center;justify-content:center;gap:5px;transition:color 0.15s;" onmouseover="this.style.color='var(--t3)'" onmouseout="this.style.color='var(--t4)'">
          <i class="fas fa-info-circle" style="font-size:10px;"></i> View collab terms &amp; PRO info
        </button>
      </div>
    </div>
  </div>

</div>

${siteFooter()}

<script>
function switchTab(name, btn) {
  ['about','listings','collab','reviews','music'].forEach(function(t) {
    var el = document.getElementById('tab-' + t);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('.ap-tab').forEach(function(t) { t.classList.remove('on'); });
  var el = document.getElementById('tab-' + name);
  if (el) el.style.display = '';
  if (btn) btn.classList.add('on');
}
</script>
${closeShell()}`;
}
