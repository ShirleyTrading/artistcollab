import { shell, closeShell, publicNav, siteFooter } from '../layout';
import {
  users, listings, reviews,
  formatPrice, formatListeners,
  getListingsByUser, getReviewsByUser,
  type User,
} from '../data';

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
  const user = users.find(u => u.id === userId);
  if (!user) {
    return shell('Artist Not Found', '') + publicNav() + `
<div style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:80px 24px;">
  <div style="text-align:center;">
    <div style="font-size:3rem;margin-bottom:16px;">⚡</div>
    <h1 style="font-family:var(--font-display);font-size:2rem;color:var(--t1);margin-bottom:12px;">Artist not found</h1>
    <p style="color:var(--t2);">This artist doesn't exist or has been removed.</p>
    <a href="/explore" class="btn btn-primary" style="margin-top:24px;display:inline-flex;">Browse Artists</a>
  </div>
</div>
${siteFooter()}${closeShell()}`;
  }

  const artistListings = getListingsByUser(userId);
  const artistReviews  = getReviewsByUser(userId);
  const activeListings = artistListings.filter(l => l.active);

  const availColor = user.availability === 'available' ? 'var(--s-ok)' : user.availability === 'busy' ? 'var(--channel)' : 'var(--t3)';
  const availLabel = user.availability === 'available' ? 'Available' : user.availability === 'busy' ? 'Busy' : 'Away';

  const cp = user.collabPreferences;

  // Waveform bars for music preview (seeded per user)
  const userIdx = users.findIndex(u => u.id === userId);
  const seed = userIdx + 1;
  const wh = Array.from({ length: 32 }, (_, i) => {
    const v = Math.abs(Math.sin(i * seed * 0.7 + seed)) * 0.65 + 0.35;
    return Math.min(1, v);
  });

  function renderSocialLinks(links: { platform: string; url: string }[]): string {
    if (!links?.length) return '';
    return links.map(sl => {
      const cfg = PLATFORM_ICONS[sl.platform.toLowerCase()] ?? { icon: 'fa-link', label: sl.platform, color: 'var(--t3)' };
      return `<a href="${sl.url}" target="_blank" rel="noopener noreferrer"
         class="btn btn-secondary btn-sm" style="gap:7px;border-color:${cfg.color}22;" aria-label="${cfg.label}">
        <i class="fab ${cfg.icon}" style="font-size:13px;color:${cfg.color};"></i>
        <span>${cfg.label}</span>
      </a>`;
    }).join('');
  }

  const avgRating = artistReviews.length
    ? artistReviews.reduce((s, r) => s + (r.quality + r.professionalism + r.communication + r.deliveryTime) / 4, 0) / artistReviews.length
    : user.rating;

  return shell(`${user.artistName} — Artist Profile`, `

  /* ══ ARTIST PROFILE ════════════════════════════════════════════════════════ */

  .ap-page { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }

  /* ── Cover + Hero ── */
  .ap-cover {
    position: relative; height: 220px; overflow: hidden;
    background: var(--c-base);
    margin-bottom: 0;
  }
  .ap-cover img {
    width: 100%; height: 100%; object-fit: cover; opacity: 0.3;
  }
  .ap-cover-grad {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(3,3,5,0) 20%, var(--c-void) 100%);
  }

  /* ── Hero section ── */
  .ap-hero {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0 24px;
    align-items: flex-end;
    padding: 0 0 28px;
    margin-top: -60px;
    position: relative; z-index: 2;
  }
  .ap-avatar {
    width: 112px; height: 112px; border-radius: 50%;
    border: 3px solid var(--c-void);
    overflow: hidden; background: var(--c-raised);
    flex-shrink: 0;
  }
  .ap-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .ap-hero-info { padding-top: 64px; }
  .ap-name {
    font-family: var(--font-display);
    font-size: 1.75rem; font-weight: 800;
    letter-spacing: -0.02em; color: var(--t1);
    margin-bottom: 4px;
    display: flex; align-items: center; gap: 10px;
  }
  .ap-verify-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(45,202,114,0.12);
    border: 1px solid rgba(45,202,114,0.25);
    border-radius: var(--r-full); padding: 3px 10px;
    font-size: 0.6875rem; font-weight: 700;
    color: var(--s-ok); letter-spacing: 0.05em;
  }
  .ap-meta {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    font-size: 0.875rem; color: var(--t2); margin-top: 6px;
  }
  .ap-meta-item { display: flex; align-items: center; gap: 5px; }
  .ap-meta-item i { font-size: 11px; color: var(--t3); }
  .ap-avail-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: ${availColor};
    display: inline-block; margin-right: 3px;
    box-shadow: 0 0 6px ${availColor};
  }

  /* ── Hero actions ── */
  .ap-hero-actions {
    padding-top: 64px;
    display: flex; flex-direction: column;
    align-items: flex-end; gap: 10px;
  }
  .ap-price-label {
    font-family: var(--font-mono); font-size: 0.6875rem;
    color: var(--t3); letter-spacing: 0.08em; text-transform: uppercase;
    text-align: right;
  }
  .ap-price-num {
    font-family: var(--font-display); font-size: 1.5rem; font-weight: 800;
    color: var(--signal); text-align: right; margin-bottom: 10px;
  }
  .ap-book-btn {
    background: var(--signal) !important;
    color: var(--c-void) !important;
    font-weight: 700; border: none !important;
    padding: 13px 28px !important; border-radius: var(--r-md) !important;
    font-size: 0.9375rem !important; width: 100%;
    transition: opacity 0.15s !important;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .ap-book-btn:hover { opacity: 0.88; }
  .ap-msg-btn { width: 100%; }

  /* ── Quick stats strip ── */
  .ap-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    border: 1px solid var(--c-rim); border-radius: var(--r-lg);
    overflow: hidden; margin-bottom: 28px; background: var(--c-panel);
  }
  .ap-stat {
    padding: 16px 20px; text-align: center;
    border-right: 1px solid var(--c-wire);
  }
  .ap-stat:last-child { border-right: none; }
  .ap-stat-num {
    font-family: var(--font-display); font-size: 1.25rem; font-weight: 700;
    color: var(--t1); margin-bottom: 2px;
  }
  .ap-stat-label { font-size: 0.6875rem; color: var(--t3); text-transform: uppercase; letter-spacing: 0.08em; }

  /* ── Layout ── */
  .ap-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;
    align-items: start;
  }

  /* ── Tabs ── */
  .ap-tabs {
    display: flex; gap: 0;
    border: 1px solid var(--c-rim); border-radius: var(--r-lg);
    overflow: hidden; margin-bottom: 20px;
    background: var(--c-panel);
  }
  .ap-tab {
    flex: 1; padding: 13px 8px; text-align: center;
    font-size: 0.8125rem; font-weight: 600; color: var(--t3);
    cursor: pointer; border: none; background: none;
    border-right: 1px solid var(--c-wire);
    transition: color 0.15s, background 0.15s;
  }
  .ap-tab:last-child { border-right: none; }
  .ap-tab.active { color: var(--t1); background: var(--c-raised); }
  .ap-tab:hover:not(.active) { color: var(--t2); background: var(--c-ghost); }

  .ap-panel { display: none; }
  .ap-panel.active { display: block; }

  /* ── Panel sections ── */
  .ap-section {
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); padding: 24px; margin-bottom: 16px;
  }
  .ap-section-title {
    font-family: var(--font-mono); font-size: 0.6875rem;
    color: var(--t3); letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 16px;
  }

  /* ── Music preview ── */
  .song-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--c-wire);
  }
  .song-row:last-child { border-bottom: none; }
  .song-play {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--c-raised); border: 1px solid var(--c-rim);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;
  }
  .song-play:hover { background: var(--signal-dim); border-color: var(--signal); }
  .song-play i { font-size: 11px; color: var(--t2); margin-left: 2px; }
  .song-info { flex: 1; min-width: 0; }
  .song-title { font-size: 0.875rem; font-weight: 600; color: var(--t1); margin-bottom: 2px; }
  .song-meta { font-size: 0.75rem; color: var(--t3); }
  .song-wave { display: flex; align-items: flex-end; gap: 2px; height: 24px; width: 80px; flex-shrink: 0; }
  .sw-bar { flex: 1; border-radius: 1px; background: var(--c-lift); }
  .song-row:hover .sw-bar { background: rgba(200,255,0,0.25); }

  /* ── Service cards ── */
  .svc-card {
    background: var(--c-raised); border: 1px solid var(--c-rim);
    border-radius: var(--r-lg); padding: 20px;
    margin-bottom: 12px; transition: border-color 0.2s;
  }
  .svc-card:hover { border-color: rgba(200,255,0,0.2); }
  .svc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; gap: 12px; }
  .svc-name { font-size: 0.9375rem; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
  .svc-category { font-size: 0.75rem; color: var(--t3); font-family: var(--font-mono); }
  .svc-price-block { text-align: right; flex-shrink: 0; }
  .svc-from { font-size: 0.625rem; color: var(--t4); text-transform: uppercase; letter-spacing: 0.08em; }
  .svc-price { font-family: var(--font-mono); font-size: 1.125rem; font-weight: 700; color: var(--signal); }
  .svc-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .svc-pill {
    font-size: 0.6875rem; padding: 3px 9px;
    border-radius: var(--r-full); background: var(--c-lift);
    border: 1px solid var(--c-rim); color: var(--t3);
    font-family: var(--font-mono);
  }
  .svc-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .svc-detail { font-size: 0.75rem; color: var(--t3); display: flex; gap: 12px; }
  .svc-detail span { display: flex; align-items: center; gap: 4px; }
  .svc-detail i { color: var(--t4); font-size: 10px; }

  /* ── Reviews ── */
  .rev-card {
    padding: 16px 0; border-bottom: 1px solid var(--c-wire);
  }
  .rev-card:last-child { border-bottom: none; }
  .rev-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .rev-avt { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: var(--c-raised); flex-shrink: 0; }
  .rev-avt img { width: 100%; height: 100%; object-fit: cover; }
  .rev-name { font-size: 0.875rem; font-weight: 600; color: var(--t1); }
  .rev-rating { font-size: 0.75rem; color: var(--s-warn); }
  .rev-date { font-size: 0.75rem; color: var(--t4); margin-left: auto; }
  .rev-text { font-size: 0.875rem; color: var(--t2); line-height: 1.6; }

  /* ── Right sidebar ── */
  .ap-sidebar { position: sticky; top: 76px; }
  .ap-sidebar-card {
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); padding: 20px;
    margin-bottom: 12px;
  }
  .ap-sidebar-card.primary { border-top: 2px solid var(--signal); }
  .ap-escrow-badge {
    display: flex; align-items: center; gap: 8px;
    background: rgba(45,202,114,0.08);
    border: 1px solid rgba(45,202,114,0.18);
    border-radius: var(--r-md); padding: 10px 12px;
    font-size: 0.75rem; color: var(--s-ok); font-weight: 600; margin-top: 12px;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .ap-layout { grid-template-columns: 1fr; }
    .ap-sidebar { position: static; }
  }
  @media (max-width: 768px) {
    .ap-hero { grid-template-columns: auto 1fr; }
    .ap-hero-actions { display: none; }
    .ap-name { font-size: 1.375rem; }
    .ap-stats { grid-template-columns: repeat(2, 1fr); }
    .ap-stat:nth-child(2) { border-right: none; }
  }
  @media (max-width: 480px) {
    .ap-hero { grid-template-columns: 1fr; }
    .ap-avatar { margin: 0 auto; display: block; margin-top: -56px; }
    .ap-hero-info { padding-top: 12px; }
    .ap-name { font-size: 1.25rem; }
    .ap-tabs .ap-tab { font-size: 0.6875rem; padding: 11px 4px; }
  }

  `, publicNav() + `

  <!-- Cover image -->
  <div class="ap-cover">
    <img src="${user.coverImage || user.profileImage}" alt="${user.artistName} cover">
    <div class="ap-cover-grad"></div>
  </div>

  <div class="ap-page">

    <!-- ── HERO ─────────────────────────────────────────────────────────────── -->
    <div class="ap-hero">
      <!-- Avatar -->
      <div class="ap-avatar">
        <img src="${user.profileImage}" alt="${user.artistName}">
      </div>

      <!-- Name + meta -->
      <div class="ap-hero-info">
        <div class="ap-name">
          ${user.artistName}
          ${user.verified ? '<span class="ap-verify-badge"><i class="fas fa-check"></i> Verified</span>' : ''}
        </div>
        <div class="ap-meta">
          <span class="ap-meta-item"><i class="fas fa-map-marker-alt"></i>${user.location}</span>
          <span class="ap-meta-item"><i class="fas fa-headphones"></i>${formatListeners(user.monthlyListeners)} listeners</span>
          <span class="ap-meta-item">
            <span class="ap-avail-dot"></span>${availLabel}
          </span>
          <span class="ap-meta-item"><i class="fas fa-star" style="color:var(--s-warn);"></i>${avgRating.toFixed(1)} (${user.reviewCount})</span>
        </div>
      </div>

      <!-- Actions (desktop only) -->
      <div class="ap-hero-actions">
        <div class="ap-price-label">Starting from</div>
        <div class="ap-price-num">${formatPrice(user.startingPrice)}</div>
        <a href="/booking/${user.id}" class="btn ap-book-btn">
          <i class="fas fa-bolt"></i> Book Collab
        </a>
        <a href="/dashboard/messages" class="btn btn-secondary ap-msg-btn">
          <i class="fas fa-comment"></i> Message
        </a>
      </div>
    </div>

    <!-- ── STATS STRIP ────────────────────────────────────────────────────── -->
    <div class="ap-stats">
      <div class="ap-stat">
        <div class="ap-stat-num">${avgRating.toFixed(1)}★</div>
        <div class="ap-stat-label">Rating</div>
      </div>
      <div class="ap-stat">
        <div class="ap-stat-num">${user.completedProjects}</div>
        <div class="ap-stat-label">Projects Done</div>
      </div>
      <div class="ap-stat">
        <div class="ap-stat-num">${user.responseTime || '<1 hr'}</div>
        <div class="ap-stat-label">Response Time</div>
      </div>
      <div class="ap-stat">
        <div class="ap-stat-num" style="color:${availColor};">${availLabel}</div>
        <div class="ap-stat-label">Availability</div>
      </div>
    </div>

    <!-- ── MAIN LAYOUT ────────────────────────────────────────────────────── -->
    <div class="ap-layout">

      <!-- Left: content -->
      <div>
        <!-- Tabs -->
        <div class="ap-tabs" role="tablist">
          <button class="ap-tab active" role="tab" aria-selected="true" data-tab="music">Music</button>
          <button class="ap-tab" role="tab" data-tab="services">Services</button>
          <button class="ap-tab" role="tab" data-tab="about">About</button>
          <button class="ap-tab" role="tab" data-tab="reviews">Reviews</button>
          <button class="ap-tab" role="tab" data-tab="more">More ↓</button>
        </div>

        <!-- Music tab -->
        <div class="ap-panel active" id="panel-music" role="tabpanel">
          <div class="ap-section">
            <div class="ap-section-title">Featured Songs</div>
            ${(user.featuredSongs || []).slice(0, 3).map((song, i) => `
            <div class="song-row">
              <button class="song-play" aria-label="Play ${song.title}">
                <i class="fas fa-play"></i>
              </button>
              <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-meta">${user.artistName}</div>
              </div>
              <div class="song-wave">
                ${wh.slice(i*10, i*10+10).map(h => `<div class="sw-bar" style="height:${Math.round(h*24)}px;"></div>`).join('')}
              </div>
            </div>`).join('') || `
            <div style="text-align:center;padding:32px;color:var(--t3);">
              <i class="fas fa-music" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
              No songs added yet
            </div>`}
          </div>

          ${user.socialLinks?.length ? `
          <div class="ap-section">
            <div class="ap-section-title">Listen on</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${renderSocialLinks(user.socialLinks)}
            </div>
          </div>` : ''}
        </div>

        <!-- Services tab -->
        <div class="ap-panel" id="panel-services" role="tabpanel">
          ${activeListings.length ? activeListings.map(listing => {
            const basePkg = listing.packages?.[0];
            const topPkg  = listing.packages?.[listing.packages.length - 1];
            return `
          <div class="svc-card">
            <div class="svc-top">
              <div>
                <div class="svc-name">${listing.title}</div>
                <div class="svc-category">${listing.category}</div>
              </div>
              <div class="svc-price-block">
                <div class="svc-from">From</div>
                <div class="svc-price">${formatPrice(basePkg?.price ?? 0)}</div>
              </div>
            </div>
            <div class="svc-pills">
              ${(listing.collabTypes || []).map(ct => `<span class="svc-pill">${ct === 'pay_for_hire' ? 'Pay-for-Hire' : 'Split'}</span>`).join('')}
              ${(listing.fileFormats || []).slice(0, 2).map(f => `<span class="svc-pill">${f}</span>`).join('')}
            </div>
            <div class="svc-bottom">
              <div class="svc-detail">
                <span><i class="fas fa-clock"></i>${basePkg?.deliveryDays}d delivery</span>
                <span><i class="fas fa-redo"></i>${basePkg?.revisions} revisions</span>
                ${topPkg && topPkg.price !== basePkg?.price
                  ? `<span><i class="fas fa-layer-group"></i>${listing.packages?.length} packages</span>` : ''}
              </div>
              <a href="/booking/${user.id}/${listing.id}" class="btn btn-primary btn-sm">
                Book <i class="fas fa-arrow-right" style="margin-left:4px;"></i>
              </a>
            </div>
          </div>`;
          }).join('') : `
          <div class="ap-section" style="text-align:center;padding:48px;">
            <i class="fas fa-store" style="font-size:2rem;color:var(--t3);margin-bottom:12px;display:block;"></i>
            <p style="color:var(--t3);">No active services yet</p>
          </div>`}
        </div>

        <!-- About tab -->
        <div class="ap-panel" id="panel-about" role="tabpanel">
          <div class="ap-section">
            <div class="ap-section-title">Bio</div>
            <p style="font-size:0.9375rem;line-height:1.7;color:var(--t2);">${user.bio || 'No bio added yet.'}</p>
          </div>

          ${user.genre?.length ? `
          <div class="ap-section">
            <div class="ap-section-title">Genres</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${user.genre.map(g => `<span class="ac-tag" style="font-size:0.75rem;padding:4px 12px;">${g}</span>`).join('')}
            </div>
          </div>` : ''}
        </div>

        <!-- Reviews tab -->
        <div class="ap-panel" id="panel-reviews" role="tabpanel">
          <div class="ap-section">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
              <div>
                <div style="font-family:var(--font-display);font-size:2.5rem;font-weight:800;color:var(--t1);line-height:1;">${avgRating.toFixed(1)}</div>
                <div style="color:var(--s-warn);font-size:1rem;margin-top:4px;">★★★★★</div>
              </div>
              <div style="color:var(--t3);font-size:0.875rem;">${user.reviewCount} reviews</div>
            </div>
            ${artistReviews.slice(0, 5).map(r => {
              const reviewer = users.find(u => u.id === r.reviewerId);
              return `
            <div class="rev-card">
              <div class="rev-header">
                <div class="rev-avt">
                  ${reviewer ? `<img src="${reviewer.profileImage}" alt="${reviewer.artistName}">` : ''}
                </div>
                <div>
                  <div class="rev-name">${reviewer?.artistName || 'Anonymous'}</div>
                  <div class="rev-rating">${'★'.repeat(Math.round((r.quality+r.professionalism+r.communication+r.deliveryTime)/4))}${'☆'.repeat(5-Math.round((r.quality+r.professionalism+r.communication+r.deliveryTime)/4))}</div>
                </div>
                <div class="rev-date">${new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
              </div>
              <div class="rev-text">"${r.text}"</div>
            </div>`;
            }).join('') || `<div style="text-align:center;padding:32px;color:var(--t3);">No reviews yet</div>`}
          </div>
        </div>

        <!-- More tab (collab info, PRO, management) -->
        <div class="ap-panel" id="panel-more" role="tabpanel">
          <div class="ap-section">
            <div class="ap-section-title">Collaboration Preferences</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div style="background:var(--c-raised);border-radius:var(--r-md);padding:14px;">
                <div style="font-size:0.6875rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Collab Types</div>
                <div style="font-size:0.875rem;color:var(--t1);">
                  ${cp?.preferredCollabTypes?.map(t => t === 'pay_for_hire' ? 'Pay-for-Hire' : 'Revenue Split').join(', ') || '—'}
                </div>
              </div>
              <div style="background:var(--c-raised);border-radius:var(--r-md);padding:14px;">
                <div style="font-size:0.6875rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Min Split %</div>
                <div style="font-size:0.875rem;color:var(--t1);">${cp?.splitMin != null ? `${cp.splitMin}%` : '—'}</div>
              </div>
              <div style="background:var(--c-raised);border-radius:var(--r-md);padding:14px;">
                <div style="font-size:0.6875rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">PRO Affiliation</div>
                <div style="font-size:0.875rem;color:var(--t1);">${user.proAffiliation || 'None'}</div>
              </div>
              <div style="background:var(--c-raised);border-radius:var(--r-md);padding:14px;">
                <div style="font-size:0.6875rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Open to Splits</div>
                <div style="font-size:0.875rem;color:${cp?.openToSplits ? 'var(--s-ok)' : 'var(--t3)'};">${cp?.openToSplits ? 'Yes' : 'No'}</div>
              </div>
            </div>
            ${cp?.notes ? `<p style="font-size:0.875rem;color:var(--t2);margin-top:14px;line-height:1.6;">${cp.notes}</p>` : ''}
          </div>

          ${user.socialLinks?.length ? `
          <div class="ap-section">
            <div class="ap-section-title">Social & Streaming</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">${renderSocialLinks(user.socialLinks)}</div>
          </div>` : ''}

          <div class="ap-section">
            <div class="ap-section-title">Agreements & Legal</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              ${user.ndaStatus === 'signed' ? `
              <span style="display:inline-flex;align-items:center;gap:5px;background:var(--s-ok-d);border:1px solid rgba(45,202,114,0.2);border-radius:var(--r-full);padding:5px 12px;font-size:0.75rem;color:var(--s-ok);">
                <i class="fas fa-check"></i> NDA Signed
              </span>` : ''}
              ${user.platformAgreementSigned ? `
              <span style="display:inline-flex;align-items:center;gap:5px;background:var(--patch-dim);border:1px solid rgba(0,194,255,0.2);border-radius:var(--r-full);padding:5px 12px;font-size:0.75rem;color:var(--patch);">
                <i class="fas fa-file-contract"></i> Platform Agreement
              </span>` : ''}
            </div>
          </div>
        </div>

      </div><!-- /left -->

      <!-- Right: sidebar -->
      <div class="ap-sidebar">
        <div class="ap-sidebar-card primary">
          <!-- Availability -->
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px;">
            <span class="ap-avail-dot"></span>
            <span style="font-size:0.875rem;font-weight:600;color:var(--t1);">${availLabel}</span>
          </div>

          <!-- Price -->
          <div style="font-family:var(--font-mono);font-size:0.6875rem;color:var(--t3);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Starting from</div>
          <div style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;color:var(--signal);margin-bottom:16px;">${formatPrice(user.startingPrice)}</div>

          <!-- Quick stats trio -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--c-rim);border-radius:var(--r-md);overflow:hidden;margin-bottom:16px;">
            <div style="background:var(--c-raised);padding:10px;text-align:center;">
              <div style="font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--t1);">
                ${activeListings.length ? activeListings[0]?.packages?.[0]?.deliveryDays + 'd' : '—'}
              </div>
              <div style="font-size:0.625rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;">Delivery</div>
            </div>
            <div style="background:var(--c-raised);padding:10px;text-align:center;">
              <div style="font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--t1);">
                ${activeListings.length ? activeListings[0]?.packages?.[0]?.revisions : '—'}
              </div>
              <div style="font-size:0.625rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;">Revisions</div>
            </div>
            <div style="background:var(--c-raised);padding:10px;text-align:center;">
              <div style="font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--t1);">${avgRating.toFixed(1)}★</div>
              <div style="font-size:0.625rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;">Rating</div>
            </div>
          </div>

          <!-- CTAs -->
          <a href="/booking/${user.id}" class="btn ap-book-btn" style="display:flex;margin-bottom:10px;">
            <i class="fas fa-bolt"></i> Book Collab
          </a>
          <a href="/dashboard/messages" class="btn btn-secondary" style="display:flex;width:100%;justify-content:center;gap:8px;">
            <i class="fas fa-comment"></i> Send Message
          </a>

          <!-- Escrow notice -->
          <div class="ap-escrow-badge">
            <i class="fas fa-shield-alt"></i>
            <span>Payments protected by escrow</span>
          </div>
        </div>

        <!-- Collab terms link -->
        <div class="ap-sidebar-card" style="text-align:center;">
          <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center;gap:6px;"
            onclick="document.querySelector('[data-tab=more]').click()">
            <i class="fas fa-file-contract"></i> View Collab Terms & PRO Info
          </button>
        </div>
      </div>
    </div><!-- /layout -->
  </div><!-- /page -->

  ${siteFooter()}

  <script>
  // Tab switching
  document.querySelectorAll('.ap-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.ap-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ap-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + tab);
      if (panel) panel.classList.add('active');
    });
  });

  // Play button feedback
  document.querySelectorAll('.song-play').forEach(btn => {
    btn.addEventListener('click', function() {
      const icon = this.querySelector('i');
      const isPlaying = icon.classList.contains('fa-pause');
      document.querySelectorAll('.song-play i').forEach(i => {
        i.classList.remove('fa-pause'); i.classList.add('fa-play');
        i.parentElement.style.background = '';
        i.parentElement.style.borderColor = '';
      });
      if (!isPlaying) {
        icon.classList.remove('fa-play'); icon.classList.add('fa-pause');
        this.style.background = 'var(--signal-dim)';
        this.style.borderColor = 'var(--signal)';
        this.querySelectorAll && this.closest('.song-row')?.querySelectorAll('.sw-bar')
          .forEach(b => b.style.background = 'var(--signal)');
      }
    });
  });
  </script>
  ${closeShell()}`);
}
