import { shell, closeShell, publicNav, siteFooter } from '../layout';
import { users, listings, formatPrice } from '../data';

export function marketplacePage(): string {
  const activeListings = listings.filter(l => l.active);

  return shell('Marketplace', `

  /* ── Marketplace styles ── */
  .mkt-header {
    background: var(--c-base);
    border-bottom: 1px solid var(--c-wire);
    padding: 48px 24px 36px;
    overflow: hidden;
  }

  /* Category tabs */
  .cat-tabs {
    display: flex;
    gap: 2px;
    border-bottom: 1px solid var(--c-wire);
    padding: 0 24px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    background: var(--c-base);
    position: sticky;
    top: 56px;
    z-index: 200;
    backdrop-filter: blur(16px);
    background: rgba(7,7,11,0.92);
    /* Clip tab content from overflowing viewport */
    max-width: 100vw;
  }
  .cat-tabs::-webkit-scrollbar { display: none; }
  .cat-tab {
    padding: 13px 16px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--t3);
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    transition: all var(--t-fast);
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    font-family: var(--font-body);
    margin-bottom: -1px;
  }
  .cat-tab:hover { color: var(--t1); }
  .cat-tab.on { color: var(--t1); border-bottom-color: var(--signal); }

  /* Listing card */
  .listing-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--t-base) var(--ease);
    display: flex;
    flex-direction: column;
  }
  .listing-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--sh-lg);
    border-color: rgba(255,255,255,0.1);
  }

  /* Package selector on card hover */
  .listing-packages {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
    border-top: 1px solid var(--c-wire);
    background: var(--c-raised);
  }
  .pkg-tab {
    flex: 1;
    padding: 6px 8px;
    font-size: 0.71rem;
    font-weight: 600;
    text-align: center;
    border-radius: var(--r-xs);
    background: var(--c-sub);
    border: 1px solid var(--c-wire);
    color: var(--t3);
    cursor: pointer;
    transition: all var(--t-fast);
  }
  .pkg-tab:hover, .pkg-tab.on {
    background: var(--signal-dim);
    border-color: rgba(200,255,0,0.25);
    color: var(--signal);
  }

  /* Artist mini-strip */
  .listing-artist {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--c-wire);
  }

  .listing-body {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .listing-features {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 16px;
  }
  .listing-feature-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.8125rem;
    color: var(--t3);
  }

  .listing-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid var(--c-wire);
    margin-top: auto;
  }

  /* Grid layout: 3 cols */
  .listing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  /* Category strip colors */
  .cat-vocal    { border-top: 2px solid var(--signal); }
  .cat-mixing   { border-top: 2px solid var(--patch); }
  .cat-beat     { border-top: 2px solid var(--warm); }
  .cat-feature  { border-top: 2px solid var(--channel); }
  .cat-writing  { border-top: 2px solid var(--s-ok); }

  /* Featured / hero listing */
  .featured-listing {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-xl);
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 360px;
    margin-bottom: 48px;
  }
  .featured-listing-left { padding: 36px; display: flex; flex-direction: column; justify-content: space-between; }
  .featured-listing-right {
    background: var(--c-raised);
    border-left: 1px solid var(--c-wire);
    padding: 28px;
  }

  @media (max-width: 1024px) {
    .listing-grid { grid-template-columns: repeat(2, 1fr); }
    .featured-listing { grid-template-columns: 1fr; }
    .featured-listing-right { border-left: none; border-top: 1px solid var(--c-wire); }
  }
  @media (max-width: 768px) {
    .listing-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .cat-tabs { padding: 0 8px; gap: 0; }
    .cat-tab { padding: 12px 12px; font-size: 0.75rem; min-height: 44px; }
    .mkt-header { padding: 36px 16px 28px; }
    .mkt-header h1.d2 br { display: none; }
    .mkt-header h1.d2 { word-break: break-word; overflow-wrap: break-word; }
    .mkt-header .body-lg { word-break: break-word; }
    /* Header inner max-width: clip the flex row */
    .mkt-header > div { overflow: hidden; }
  }
  @media (max-width: 480px) {
    .listing-grid { grid-template-columns: 1fr; }
    .featured-listing-left { padding: 24px 20px; }
    .cat-tab { padding: 12px 10px; font-size: 0.7rem; }
    /* Stack the header row vertically on small screens */
    .mkt-header > div > div[style] { flex-direction: column; align-items: flex-start !important; }
  }

`) + publicNav('marketplace') + `

<!-- ── Header ── -->
<div class="mkt-header">
  <div style="max-width:1280px;margin:0 auto;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
      <div style="height:1px;width:24px;background:var(--signal);box-shadow:0 0 6px var(--signal-glow);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">Feature Marketplace</span>
    </div>
    <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;">
      <div>
        <h1 class="d2" style="margin-bottom:10px;word-break:break-word;overflow-wrap:break-word;">Book studio-grade<br class="mob-hide"> services</h1>
        <p class="body-lg" style="max-width:520px;">
          ${activeListings.length} active service listings from verified artists — vocals, mixing, beats, songwriting, and more.
        </p>
      </div>
      <a href="/signup" class="btn btn-primary">
        <i class="fas fa-plus" style="font-size:12px;"></i>
        List Your Services
      </a>
    </div>
  </div>
</div>

<!-- ── Category tabs ── -->
<div class="cat-tabs">
  ${[
    { label:'All Services', id:'all', count: activeListings.length },
    { label:'Vocal Features', id:'vocal', count: activeListings.filter(l => l.category?.toLowerCase().includes('feature') || l.category?.toLowerCase().includes('vocal')).length || 3 },
    { label:'Mixing & Mastering', id:'mixing', count: 4 },
    { label:'Beat Production', id:'beat', count: 5 },
    { label:'Songwriting', id:'writing', count: 3 },
  ].map((t,i) => `<button class="cat-tab ${i===0?'on':''}" onclick="filterCat('${t.id}',this)">${t.label} <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);margin-left:4px;">${t.count}</span></button>`).join('')}
</div>

<!-- ── Main content ── -->
<div style="max-width:1280px;margin:0 auto;padding:36px 24px 80px;">

  <!-- Results meta row -->
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px;">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--t4);">${activeListings.length} listings</span>
      <div class="node node-signal" style="animation:pulse 2s infinite;"></div>
    </div>
    <select style="background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r);padding:8px 28px 8px 12px;color:var(--t2);font-size:0.8125rem;font-family:var(--font-body);outline:none;cursor:pointer;appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2352526A'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 10px center;">
      <option>Best Match</option>
      <option>Price: Low to High</option>
      <option>Price: High to Low</option>
      <option>Top Rated</option>
    </select>
  </div>

  <!-- Listing grid -->
  <div class="listing-grid" id="listing-grid">
    ${activeListings.map((listing, i) => {
      const artist = users.find(u => u.id === listing.userId);
      if (!artist) return '';
      const pkg0 = listing.packages[0];
      const pkg1 = listing.packages[1];
      const pkg2 = listing.packages[2];
      const catColors: Record<string, string> = {
        'Feature': 'var(--signal)',
        'Vocal Feature': 'var(--signal)',
        'Mixing': 'var(--patch)',
        'Mastering': 'var(--patch)',
        'Beat Production': 'var(--warm)',
        'Songwriting': 'var(--s-ok)',
      };
      const catColor = catColors[listing.category] || 'var(--channel)';
      const catClass = listing.category?.toLowerCase().includes('mix') ? 'cat-mixing' :
                       listing.category?.toLowerCase().includes('beat') ? 'cat-beat' :
                       listing.category?.toLowerCase().includes('writ') ? 'cat-writing' : 'cat-feature';

      return `
      <div class="listing-card ${catClass}" data-href="/listing/${listing.id}">

        <!-- Artist identity strip -->
        <div class="listing-artist">
          <div style="position:relative;">
            <img src="${artist.profileImage}" class="av av-sm" alt="${artist.artistName}" style="border:1.5px solid var(--c-rim);">
            ${artist.verified ? `<div style="position:absolute;bottom:0;right:0;width:12px;height:12px;background:var(--signal);border-radius:50%;border:2px solid var(--c-panel);display:flex;align-items:center;justify-content:center;"><i class="fas fa-check" style="font-size:6px;color:#000;"></i></div>` : ''}
          </div>
          <div style="min-width:0;flex:1;">
            <div style="font-size:0.8125rem;font-weight:700;letter-spacing:-0.01em;">${artist.artistName}</div>
            <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);">@${artist.username} · ★ ${artist.rating.toFixed(1)}</div>
          </div>
          <span class="badge badge-muted" style="font-size:0.65rem;">${listing.category}</span>
        </div>

        <!-- Body -->
        <div class="listing-body">
          <h3 style="font-size:1rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:8px;line-height:1.3;">${listing.title}</h3>
          <p style="font-size:0.8125rem;color:var(--t3);line-height:1.55;margin-bottom:16px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${listing.description}</p>

          <!-- Key features from default package -->
          <div class="listing-features">
            ${pkg0?.features.slice(0,3).map(f => `
            <div class="listing-feature-item">
              <i class="fas fa-check" style="color:${catColor};font-size:10px;flex-shrink:0;"></i>
              <span>${f}</span>
            </div>`).join('')}
          </div>

          <!-- Format tags -->
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;">
            ${listing.fileFormats?.slice(0,3).map(f => `<span class="badge badge-muted">${f}</span>`).join('')}
          </div>

          <!-- Stats row -->
          <div class="listing-footer">
            <div>
              <div style="font-size:0.65rem;color:var(--t4);font-family:var(--font-mono);margin-bottom:3px;">STARTING AT</div>
              <div style="font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:${catColor};">${formatPrice(pkg0?.price || 0)}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.75rem;color:var(--t3);margin-bottom:2px;">
                <i class="fas fa-clock" style="font-size:10px;color:var(--t4);"></i> ${pkg0?.deliveryDays} day${pkg0?.deliveryDays === 1 ? '' : 's'}
              </div>
              <div class="mono-sm" style="color:var(--t4);">${listing.orders || 0} orders</div>
            </div>
          </div>
        </div>

        <!-- Package tabs -->
        <div class="listing-packages">
          ${[pkg0, pkg1, pkg2].filter(Boolean).map((p, pi) => `
          <div class="pkg-tab ${pi===0?'on':''}" onclick="event.stopPropagation();selectPkg(this,'${p?.name}','${formatPrice(p?.price||0)}')">
            <div>${p?.name}</div>
            <div style="margin-top:2px;">${formatPrice(p?.price||0)}</div>
          </div>`).join('')}
        </div>
      </div>`}).join('')}
  </div>

</div>

${siteFooter()}

<script>
function filterCat(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.listing-card').forEach(card => {
    if (cat === 'all') { card.style.display = ''; return; }
    const has = card.classList.contains('cat-' + cat);
    card.style.display = (has || cat === 'all') ? '' : 'none';
  });
}

function selectPkg(tab, name, price) {
  const row = tab.closest('.listing-packages');
  row.querySelectorAll('.pkg-tab').forEach(t => t.classList.remove('on'));
  tab.classList.add('on');
}

// Stagger animation
document.querySelectorAll('.listing-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(10px)';
  card.style.transition = 'opacity 0.35s ease, transform 0.35s ease, border-color 0.3s ease, box-shadow 0.3s ease';
  setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, i * 50);
});
</script>
${closeShell()}
`;
}
