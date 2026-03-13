import { shell, closeShell, publicNav, siteFooter } from '../layout';
import { users, listings, reviews, formatPrice, formatListeners, getListingsByUser, getReviewsByUser } from '../data';

export function artistPage(userId: string): string {
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

  const artistListings = getListingsByUser ? getListingsByUser(userId) : listings.filter(l => l.userId === userId);
  const artistReviews = getReviewsByUser ? getReviewsByUser(userId) : reviews.filter(r => r.artistId === userId);
  const activeListings = artistListings.filter(l => l.active);

  const stripColors = ['var(--signal)', 'var(--patch)', 'var(--warm)', 'var(--channel)', 'var(--s-ok)'];
  const userIndex = users.findIndex(u => u.id === userId);
  const idColor = stripColors[userIndex % stripColors.length];

  // TAB waveform heights (seeded)
  const wh = [0.3,0.6,0.9,0.8,1.0,0.85,0.6,0.4,0.7,0.9,0.8,0.6,0.4,0.7,0.5,0.8,0.9,0.65,0.5,0.75,0.85,0.55,0.7,0.4,0.6,0.8,0.5,0.3,0.6,0.4];

  return shell(`${user.artistName} — Artist Profile`, `

  /* ── Artist profile styles ── */

  /* Cover band: the artist's identity field */
  .artist-cover-band {
    position: relative;
    height: 280px;
    overflow: hidden;
    background: var(--c-base);
  }
  .artist-cover-img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.35;
    transition: opacity var(--t-slow);
  }
  .artist-cover-grad {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, transparent 30%, var(--c-void) 100%),
      linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 50%);
  }
  /* Waveform spine: the brand's structural divider */
  .artist-waveform-spine {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    padding: 0 40px;
    opacity: 0.15;
    pointer-events: none;
  }

  /* Profile strip */
  .artist-profile-strip {
    background: var(--c-void);
    border-bottom: 1px solid var(--c-wire);
    padding: 0 24px;
  }
  .artist-profile-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 20px;
    padding-bottom: 24px;
    margin-top: -52px;
    position: relative;
  }

  /* Identity node: channel strip concept applied to profile */
  .artist-id-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px 4px 4px;
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-full);
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--t4);
  }

  /* Stat grid below profile */
  .artist-stats-row {
    display: flex;
    gap: 0;
    background: var(--c-base);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .artist-stat {
    flex: 1;
    padding: 18px 16px;
    border-right: 1px solid var(--c-wire);
    text-align: center;
  }
  .artist-stat:last-child { border-right: none; }

  /* Tab navigation */
  .artist-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--c-wire);
    padding: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .artist-tabs::-webkit-scrollbar { display: none; }
  .artist-tab {
    padding: 14px 20px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--t3);
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    font-family: var(--font-body);
    margin-bottom: -1px;
    transition: color var(--t-fast), border-color var(--t-fast);
  }
  .artist-tab:hover { color: var(--t1); }
  .artist-tab.on { color: var(--t1); border-bottom-color: var(--signal); }

  /* Listing card in context of profile */
  .profile-listing {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--t-base) var(--ease);
  }
  .profile-listing:hover {
    border-color: rgba(255,255,255,0.1);
    transform: translateY(-2px);
    box-shadow: var(--sh);
  }

  /* Sticky sidebar (booking CTA) */
  .booking-sidebar {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    position: sticky;
    top: 76px;
  }
  .booking-sidebar-head {
    padding: 20px;
    border-bottom: 1px solid var(--c-wire);
    background: var(--c-raised);
  }

  /* Review card */
  .review-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 20px;
    transition: border-color var(--t-base);
  }
  .review-card:hover { border-color: rgba(255,255,255,0.09); }

  /* Featured song row */
  .song-row {
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
  .song-row:hover { border-color: rgba(255,255,255,0.1); background: var(--c-lift); }

  /* Two-col layout */
  .profile-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 32px;
    align-items: start;
  }

  @media (max-width: 1024px) {
    .profile-layout { grid-template-columns: 1fr; }
    .booking-sidebar { position: static; }
  }
  @media (max-width: 768px) {
    .artist-cover-band { height: 180px; }
    .artist-profile-inner { flex-wrap: wrap; margin-top: -36px; }
    .artist-stats-row { overflow-x: auto; scrollbar-width: none; flex-wrap: nowrap; -webkit-overflow-scrolling: touch; }
    .artist-stat { min-width: 80px; padding: 14px 12px; }
    .artist-profile-inner .btn-primary, .artist-profile-inner .btn-secondary { padding: 10px 16px; font-size: 0.875rem; min-height: 44px; }
    /* Tab: bigger touch target, scrollable */
    .artist-tab { padding: 14px 16px; min-height: 48px; font-size: 0.8125rem; }
    /* View All button bigger */
    .btn-ghost.btn-xs { min-height: 40px; padding: 8px 12px; font-size: 0.8125rem; }
  }
  @media (max-width: 480px) {
    .artist-cover-band { height: 160px; }
    .artist-profile-inner { gap: 12px; padding: 0 0 20px; }
    .artist-profile-inner > div:first-child img { width: 72px; height: 72px; }
    .artist-profile-strip { padding: 0 14px; }
    .artist-stats-row .artist-stat { min-width: 70px; padding: 12px 10px; }
    .profile-layout { padding: 0 0 60px; }
    /* Booking sidebar on mobile: not sticky, full width */
    .booking-sidebar { top: auto; margin-top: 24px; }
  }

`) + publicNav('explore') + `

<!-- ══ COVER BAND ══ -->
<div class="artist-cover-band" style="border-bottom:3px solid ${idColor};">
  <img src="${user.coverImage || user.profileImage}" class="artist-cover-img" alt="${user.artistName}">
  <div class="artist-cover-grad"></div>
  <!-- Waveform spine motif -->
  <div class="artist-waveform-spine" style="color:${idColor};">
    ${wh.map(h => `<div style="flex:1;height:${Math.round(h*100)}%;background:currentColor;border-radius:2px 2px 0 0;"></div>`).join('')}
  </div>
</div>

<!-- ══ PROFILE STRIP ══ -->
<div class="artist-profile-strip">
  <div class="artist-profile-inner">

    <!-- Avatar with verified ring -->
    <div style="position:relative;flex-shrink:0;">
      <img src="${user.profileImage}" class="av av-3xl" style="border:3px solid var(--c-void);box-shadow:0 0 0 2px ${idColor};" alt="${user.artistName}">
      ${user.verified ? `<div style="position:absolute;bottom:4px;right:4px;width:24px;height:24px;background:var(--signal);border-radius:50%;border:3px solid var(--c-void);display:flex;align-items:center;justify-content:center;"><i class="fas fa-check" style="font-size:9px;color:#000;"></i></div>` : ''}
    </div>

    <!-- Name + meta -->
    <div style="flex:1;min-width:0;padding-bottom:4px;">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px;">
        <h1 style="font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;letter-spacing:-0.02em;">${user.artistName}</h1>
        ${user.verified ? `<span class="badge badge-signal"><i class="fas fa-check-circle" style="font-size:10px;"></i> Verified</span>` : ''}
        <span class="badge badge-muted">${user.accountType === 'producer' ? 'Producer' : 'Artist'}</span>
      </div>

      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
        <div class="artist-id-pill" style="border-color:${idColor}33;">
          <div style="width:7px;height:7px;border-radius:50%;background:${idColor};box-shadow:0 0 5px ${idColor};"></div>
          <span>@${user.username}</span>
        </div>
        <span style="font-size:0.8125rem;color:var(--t3);"><i class="fas fa-map-marker-alt" style="color:var(--t4);margin-right:5px;"></i>${user.location}</span>
        <span style="font-size:0.8125rem;color:var(--t3);"><i class="fas fa-clock" style="color:var(--t4);margin-right:5px;"></i>Responds ${user.responseTime}</span>
        <span style="font-size:0.8125rem;color:var(--t3);"><i class="fas fa-headphones" style="color:${idColor};margin-right:5px;"></i>${formatListeners(user.monthlyListeners)}</span>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:5px;">
        ${user.genre.map(g => `<span class="badge badge-muted">${g}</span>`).join('')}
        ${user.tags?.slice(0,3).map((t: string) => `<span class="badge badge-muted">${t}</span>`).join('')}
      </div>
    </div>

    <!-- Quick CTA -->
    <div style="display:flex;gap:8px;flex-shrink:0;align-self:flex-end;">
      <a href="/booking/${user.id}" class="btn btn-primary">
        <i class="fas fa-microphone-alt" style="font-size:12px;"></i>
        Book Now
      </a>
      <button class="btn btn-secondary btn-sm" onclick="alert('Saved!')">
        <i class="fas fa-bookmark" style="font-size:12px;"></i>
      </button>
    </div>

  </div>

  <!-- Stats row -->
  <div style="max-width:1280px;margin:0 auto;padding-bottom:20px;">
    <div class="artist-stats-row">
      ${[
        { val: `★ ${user.rating.toFixed(1)}`, lbl: `${user.reviewCount} Reviews`, color: 'var(--signal)' },
        { val: user.completedProjects.toString(), lbl: 'Completed', color: 'var(--patch)' },
        { val: formatListeners(user.monthlyListeners), lbl: 'Listeners', color: 'var(--warm)' },
        { val: formatPrice(user.startingPrice), lbl: 'Starting Price', color: idColor },
        { val: user.availability ? 'Open' : 'Busy', lbl: 'Status', color: user.availability ? 'var(--s-ok)' : 'var(--channel)' },
      ].map(s => `
      <div class="artist-stat">
        <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:${s.color};margin-bottom:3px;">${s.val}</div>
        <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);letter-spacing:0.1em;text-transform:uppercase;">${s.lbl}</div>
      </div>`).join('')}
    </div>
  </div>
</div>

<!-- ══ TAB NAV ══ -->
<div style="background:var(--c-void);border-bottom:1px solid var(--c-wire);">
  <div style="max-width:1280px;margin:0 auto;padding:0 24px;">
    <div class="artist-tabs">
      <button class="artist-tab on" onclick="switchTab('about',this)">About</button>
      <button class="artist-tab" onclick="switchTab('listings',this)">Services <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);">${activeListings.length}</span></button>
      <button class="artist-tab" onclick="switchTab('reviews',this)">Reviews <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);">${user.reviewCount}</span></button>
      ${user.featuredSongs?.length ? `<button class="artist-tab" onclick="switchTab('music',this)">Music <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);">${user.featuredSongs.length}</span></button>` : ''}
    </div>
  </div>
</div>

<!-- ══ CONTENT ══ -->
<div style="max-width:1280px;margin:0 auto;padding:28px 24px 80px;" class="artist-content">
  <div class="profile-layout">

    <!-- Left: tabbed content -->
    <div>

      <!-- ABOUT TAB -->
      <div id="tab-about">
        <!-- Bio -->
        <div style="margin-bottom:32px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
            <div style="height:1px;width:20px;background:${idColor};box-shadow:0 0 5px ${idColor};"></div>
            <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">About</span>
          </div>
          <p style="font-size:1rem;line-height:1.8;color:var(--t2);max-width:640px;">${user.bio}</p>
        </div>

        <!-- Social links -->
        ${user.socialLinks?.length ? `
        <div style="margin-bottom:32px;">
          <div style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--t4);margin-bottom:12px;">Connect</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${user.socialLinks.map((sl: {platform:string;url:string}) => `
            <a href="${sl.url}" target="_blank" class="btn btn-secondary btn-sm" style="gap:7px;">
              <i class="fab fa-${sl.platform.toLowerCase()}" style="font-size:13px;"></i>
              ${sl.platform}
            </a>`).join('')}
          </div>
        </div>` : ''}

        <!-- Featured listings preview (3 cards) -->
        ${activeListings.length > 0 ? `
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="height:1px;width:20px;background:${idColor};"></div>
              <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">Services</span>
            </div>
            <button class="btn btn-ghost btn-xs" style="color:var(--t3);" onclick="switchTab('listings', document.querySelector('.artist-tab:nth-child(2)'))">View All</button>
          </div>
          <div style="display:grid;gap:12px;">
            ${activeListings.slice(0,2).map(l => {
              const pkg0 = l.packages[0];
              return `
            <div class="profile-listing" data-href="/listing/${l.id}" style="border-left:3px solid ${idColor};">
              <div style="padding:16px;">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;">
                  <div>
                    <h3 style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:4px;">${l.title}</h3>
                    <span class="badge badge-muted">${l.category}</span>
                  </div>
                  <div style="text-align:right;flex-shrink:0;">
                    <div style="font-size:1.125rem;font-weight:800;letter-spacing:-0.02em;color:${idColor};">${formatPrice(pkg0?.price || 0)}</div>
                    <div class="mono-sm" style="color:var(--t4);">${pkg0?.deliveryDays}d delivery</div>
                  </div>
                </div>
                <p style="font-size:0.8125rem;color:var(--t3);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${l.description}</p>
              </div>
              <div style="padding:10px 16px;background:var(--c-raised);border-top:1px solid var(--c-wire);display:flex;gap:6px;">
                ${l.packages.map((p,pi) => `
                <span style="padding:4px 10px;border-radius:var(--r-xs);font-size:0.71rem;font-weight:600;background:${pi===0 ? 'var(--signal-dim)':'var(--c-sub)'};border:1px solid ${pi===0 ? 'rgba(200,255,0,0.25)':'var(--c-wire)'};color:${pi===0 ? 'var(--signal)':'var(--t3)'};">${p.name}</span>`).join('')}
              </div>
            </div>`}).join('')}
          </div>
        </div>` : ''}
      </div>

      <!-- LISTINGS TAB (hidden by default) -->
      <div id="tab-listings" style="display:none;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
          <div style="height:1px;width:20px;background:${idColor};"></div>
          <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">All Services</span>
        </div>
        <div style="display:grid;gap:16px;">
          ${activeListings.map(l => {
            const pkg0 = l.packages[0];
            return `
          <div class="profile-listing" data-href="/listing/${l.id}" style="border-left:3px solid ${idColor};">
            <div style="padding:20px;">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px;">
                <div>
                  <h3 style="font-size:1rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:6px;">${l.title}</h3>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <span class="badge badge-muted">${l.category}</span>
                    ${l.fileFormats?.slice(0,2).map((f: string) => `<span class="badge badge-muted">${f}</span>`).join('')}
                  </div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                  <div style="font-size:1.375rem;font-weight:800;letter-spacing:-0.03em;color:${idColor};">${formatPrice(pkg0?.price || 0)}</div>
                  <div class="mono-sm" style="color:var(--t4);">${pkg0?.deliveryDays}d · ${l.orders || 0} orders</div>
                </div>
              </div>
              <p style="font-size:0.875rem;color:var(--t3);line-height:1.6;margin-bottom:14px;">${l.description}</p>
              <div style="display:flex;flex-direction:column;gap:5px;">
                ${pkg0?.features.slice(0,4).map((f: string) => `
                <div style="display:flex;align-items:center;gap:7px;font-size:0.8125rem;color:var(--t3);">
                  <i class="fas fa-check" style="color:${idColor};font-size:10px;flex-shrink:0;"></i>${f}
                </div>`).join('')}
              </div>
            </div>
            <div style="padding:12px 20px;background:var(--c-raised);border-top:1px solid var(--c-wire);display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;gap:6px;">
                ${l.packages.map((p,pi) => `
                <span style="padding:5px 12px;border-radius:var(--r-xs);font-size:0.75rem;font-weight:600;background:${pi===0 ? 'var(--signal-dim)':'var(--c-sub)'};border:1px solid ${pi===0 ? 'rgba(200,255,0,0.25)':'var(--c-wire)'};color:${pi===0 ? 'var(--signal)':'var(--t3)'};">${p.name} · ${formatPrice(p.price)}</span>`).join('')}
              </div>
              <a href="/booking/${user.id}?listing=${l.id}" class="btn btn-primary btn-sm">Book</a>
            </div>
          </div>`}).join('')}
        </div>
      </div>

      <!-- REVIEWS TAB (hidden by default) -->
      <div id="tab-reviews" style="display:none;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="height:1px;width:20px;background:${idColor};"></div>
            <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">Reviews</span>
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
          ${artistReviews.length ? artistReviews.map((r: any) => {
            const reviewer = users.find(u => u.id === r.buyerId);
            return `
          <div class="review-card" style="border-left:2px solid ${idColor};">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <img src="${reviewer?.profileImage || 'https://i.pravatar.cc/40'}" class="av av-sm" alt="${reviewer?.artistName}" style="border:1.5px solid var(--c-rim);">
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.875rem;font-weight:700;">${reviewer?.artistName || 'Anonymous'}</div>
                <div class="mono-sm" style="color:var(--t4);">${r.createdAt}</div>
              </div>
              <div style="color:var(--signal);letter-spacing:2px;font-size:0.875rem;">${'★'.repeat(r.rating)}</div>
            </div>
            <p style="font-size:0.875rem;line-height:1.7;color:var(--t2);">"${r.text}"</p>
            ${r.category ? `<div style="margin-top:10px;"><span class="badge badge-muted">${r.category}</span></div>` : ''}
          </div>`}).join('') : `
          <div style="text-align:center;padding:60px 24px;">
            <div style="font-size:2rem;margin-bottom:12px;">🎵</div>
            <p class="body-sm">No reviews yet — be the first to collaborate!</p>
          </div>`}
        </div>
      </div>

      <!-- MUSIC TAB (hidden by default) -->
      <div id="tab-music" style="display:none;">
        ${user.featuredSongs?.length ? `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
          <div style="height:1px;width:20px;background:${idColor};"></div>
          <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${idColor};">Featured Songs</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${user.featuredSongs.map((song: {title:string;url:string}, si: number) => `
          <div class="song-row">
            <div style="width:36px;height:36px;background:${idColor}20;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-music" style="color:${idColor};font-size:13px;"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.875rem;font-weight:600;">${song.title}</div>
              <div class="mono-sm" style="color:var(--t4);">by ${user.artistName}</div>
            </div>
            <span class="mono-sm" style="color:var(--t4);">${String(si+1).padStart(2,'0')}</span>
            <button style="background:none;border:none;color:var(--t3);cursor:pointer;padding:6px;font-size:1rem;transition:color 0.15s;" onmouseover="this.style.color='var(--t1)'" onmouseout="this.style.color='var(--t3)'" onclick="alert('Preview: ${song.title}')">
              <i class="fas fa-play-circle"></i>
            </button>
          </div>`).join('')}
        </div>` : `<p class="body-sm" style="text-align:center;padding:40px 0;">No featured songs yet.</p>`}
      </div>

    </div>

    <!-- Right: booking sidebar -->
    <div>
      <div class="booking-sidebar">
        <div class="booking-sidebar-head" style="border-top:3px solid ${idColor};">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
            <div style="width:7px;height:7px;border-radius:50%;background:${user.availability ? 'var(--s-ok)' : 'var(--channel)'};box-shadow:0 0 6px ${user.availability ? 'rgba(45,202,114,0.5)' : 'rgba(255,77,109,0.5)'};"></div>
            <span class="mono-sm" style="color:${user.availability ? 'var(--s-ok)' : 'var(--channel)'};">${user.availability ? 'AVAILABLE NOW' : 'CURRENTLY BUSY'}</span>
          </div>
          <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);margin-bottom:4px;">STARTING AT</div>
          <div style="font-family:var(--font-display);font-size:2.25rem;font-weight:800;letter-spacing:-0.04em;color:${idColor};margin-bottom:8px;">${formatPrice(user.startingPrice)}</div>
          <div class="mono-sm" style="color:var(--t4);">per feature / collaboration</div>
        </div>

        <div style="padding:20px;">
          <!-- Key info -->
          ${[
            { icon:'fa-clock', label:'Response time', val:user.responseTime },
            { icon:'fa-redo', label:'Free revisions', val:`${activeListings[0]?.packages[0]?.revisions || 2} included` },
            { icon:'fa-shipping-fast', label:'Fastest delivery', val:`${Math.min(...activeListings.map(l => l.packages[0]?.deliveryDays || 7))} days` },
          ].map(row => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--c-wire);">
            <i class="fas ${row.icon}" style="color:var(--t4);width:16px;text-align:center;font-size:0.8125rem;flex-shrink:0;"></i>
            <div style="font-size:0.8125rem;color:var(--t3);flex:1;">${row.label}</div>
            <div style="font-size:0.8125rem;font-weight:600;">${row.val}</div>
          </div>`).join('')}

          <!-- CTA -->
          <a href="/booking/${user.id}" class="btn btn-primary btn-lg btn-w" style="margin-top:20px;margin-bottom:10px;">
            <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
            Book a Session
          </a>
          <a href="/dashboard/messages" class="btn btn-secondary btn-w btn-sm">
            <i class="fas fa-comment-dots" style="font-size:12px;"></i>
            Message Artist
          </a>

          <div style="margin-top:16px;padding:12px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.18);border-radius:var(--r);display:flex;gap:8px;">
            <i class="fas fa-shield-alt" style="color:var(--signal);font-size:0.875rem;flex-shrink:0;margin-top:1px;"></i>
            <div>
              <div style="font-size:0.75rem;font-weight:700;color:var(--signal);margin-bottom:3px;">Escrow Protected</div>
              <div style="font-size:0.75rem;color:var(--t3);line-height:1.5;">Your payment is held in escrow and only released when you approve the delivery.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

${siteFooter()}

<script>
function switchTab(name, btn) {
  // Hide all tabs
  ['about','listings','reviews','music'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('.artist-tab').forEach(t => t.classList.remove('on'));
  // Show selected
  const el = document.getElementById('tab-' + name);
  if (el) el.style.display = '';
  if (btn) btn.classList.add('on');
}
</script>
${closeShell()}
`;
}
