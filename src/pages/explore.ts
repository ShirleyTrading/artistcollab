import { shell, closeShell, publicNav, siteFooter } from '../layout';
import { users, formatPrice, formatListeners } from '../data';

export function explorePage(): string {
  return shell('Explore Artists', `

  /* ── Explore page styles ── */
  .explore-header {
    background: var(--c-base);
    border-bottom: 1px solid var(--c-wire);
    padding: 48px 24px 36px;
  }
  .explore-header-inner {
    max-width: 1280px; margin: 0 auto;
  }

  /* Search + filter toolbar */
  .explore-toolbar {
    background: var(--c-base);
    border-bottom: 1px solid var(--c-wire);
    padding: 14px 24px;
    position: sticky;
    top: 56px;
    z-index: 200;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background: rgba(7,7,11,0.92);
  }
  .explore-toolbar-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
  }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--t4);
    font-size: 0.8125rem;
  }
  .search-input {
    width: 100%;
    background: var(--c-raised);
    border: 1px solid var(--c-rim);
    border-radius: var(--r);
    padding: 9px 14px 9px 34px;
    color: var(--t1);
    font-size: 0.875rem;
    font-family: var(--font-body);
    outline: none;
    transition: border-color var(--t-fast), box-shadow var(--t-fast);
  }
  .search-input:focus {
    border-color: var(--signal);
    box-shadow: 0 0 0 3px var(--signal-dim);
  }
  .search-input::placeholder { color: var(--t4); }
  .filter-select {
    background: var(--c-raised);
    border: 1px solid var(--c-rim);
    border-radius: var(--r);
    padding: 9px 30px 9px 12px;
    color: var(--t2);
    font-size: 0.8125rem;
    font-family: var(--font-body);
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2352526A'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    transition: border-color var(--t-fast);
    white-space: nowrap;
  }
  .filter-select:focus { border-color: var(--signal); }

  .filter-chip {
    padding: 9px 14px;
    border-radius: var(--r);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--t-fast);
    border: 1px solid var(--c-rim);
    background: transparent;
    color: var(--t3);
    font-family: var(--font-body);
    white-space: nowrap;
    min-height: 40px;
  }
  .filter-chip:hover { color: var(--t1); border-color: rgba(255,255,255,0.12); background: var(--c-ghost); }
  .filter-chip.on { background: var(--signal-dim); border-color: rgba(200,255,0,0.25); color: var(--signal); }

  /* Results grid */
  .results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    flex-wrap: wrap;
    gap: 12px;
  }

  /* Artist card — identity-focused */
  .ac-artist-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--t-slow) var(--ease);
    display: flex;
    flex-direction: column;
  }
  .ac-artist-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--sh-lg);
    border-color: rgba(255,255,255,0.1);
  }

  /* Cover */
  .ac-cover {
    height: 120px;
    position: relative;
    overflow: hidden;
  }
  .ac-cover img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.4;
    transition: opacity var(--t-slow), transform var(--t-slow);
  }
  .ac-artist-card:hover .ac-cover img { opacity: 0.55; transform: scale(1.03); }
  .ac-cover-grad {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 20%, var(--c-panel) 100%);
  }

  /* Body */
  .ac-artist-body { padding: 0 16px 18px; flex: 1; display: flex; flex-direction: column; }
  .ac-artist-av-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-top: -22px;
  }

  /* Waveform tag on the card — the studio motif */
  .ac-waveform-tag {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 20px;
    opacity: 0.5;
  }
  .ac-wv-bar { width: 2px; border-radius: 1px; flex-shrink: 0; }

  /* Tags row */
  .ac-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }

  /* Stats row */
  .ac-stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid var(--c-wire);
    margin-top: auto;
  }

  /* Grid */
  .artist-results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 80px 24px;
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    .explore-toolbar-inner { gap: 8px; }
    .filter-select { display: none; }
    .artist-results-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  }
  @media (max-width: 480px) {
    .artist-results-grid { grid-template-columns: 1fr; }
  }

`) + publicNav('explore') + `

<!-- ── Page header ── -->
<div class="explore-header">
  <div class="explore-header-inner">

    <!-- Section label -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
      <div style="height:1px;width:24px;background:var(--signal);box-shadow:0 0 6px var(--signal-glow);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">Artist Roster</span>
    </div>

    <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:12px;">
      <div>
        <h1 class="d2" style="margin-bottom:8px;">Find your<br>collaborator</h1>
        <p class="body-lg" style="max-width:500px;">
          Browse ${users.length}+ verified artists by vibe, genre, and price. View their full profiles, audio samples, and reviews — then book directly.
        </p>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0;align-self:flex-end;">
        <a href="/marketplace" class="btn btn-ghost btn-sm" style="color:var(--t3);">
          <i class="fas fa-store" style="font-size:11px;"></i>
          Browse Services Instead
        </a>
      </div>
    </div>
  </div>
</div>

<!-- ── Filter toolbar ── -->
<div class="explore-toolbar">
  <div class="explore-toolbar-inner">
    <div class="search-wrap">
      <i class="fas fa-search search-icon"></i>
      <input type="text" class="search-input" placeholder="Search artists, genres, styles…" id="ac-search">
    </div>

    <select class="filter-select" id="filter-genre">
      <option value="">All Genres</option>
      <option>Hip Hop</option>
      <option>R&B</option>
      <option>Pop</option>
      <option>Afrobeats</option>
      <option>Trap</option>
      <option>Soul</option>
      <option>Electronic</option>
    </select>

    <select class="filter-select" id="filter-type">
      <option value="">Artist & Producer</option>
      <option value="artist">Artists only</option>
      <option value="producer">Producers only</option>
    </select>

    <select class="filter-select" id="filter-price">
      <option value="">Any price</option>
      <option value="200">Under $200</option>
      <option value="500">Under $500</option>
      <option value="1000">Under $1,000</option>
    </select>

    <button class="filter-chip on" id="chip-verified" onclick="this.classList.toggle('on')">
      <i class="fas fa-check-circle" style="font-size:11px;margin-right:4px;"></i>Verified
    </button>

    <button class="filter-chip" id="chip-live" onclick="this.classList.toggle('on')">
      <i class="fas fa-broadcast-tower" style="font-size:11px;margin-right:4px;"></i>Live sessions
    </button>
  </div>
</div>

<!-- ── Results ── -->
<div style="max-width:1280px;margin:0 auto;padding:0 24px 80px;">

  <div class="results-header">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--t4);">${users.length} results</span>
      <div class="node node-signal" style="animation:pulse 2s infinite;"></div>
    </div>
    <select class="filter-select" style="width:auto;">
      <option>Top Rated</option>
      <option>Price: Low to High</option>
      <option>Price: High to Low</option>
      <option>Most Listeners</option>
    </select>
  </div>

  <div class="artist-results-grid" id="artists-grid">
    ${users.map((u, i) => {
      const stripColors = ['var(--signal)','var(--patch)','var(--warm)','var(--channel)','var(--s-ok)'];
      const sc = stripColors[i % stripColors.length];
      const wh = [0.4,0.7,1.0,0.8,0.6,0.9,0.5,0.7,0.85,0.6,0.4,0.75,0.9,0.65,0.5];
      return `
    <div class="ac-artist-card" data-href="/artist/${u.id}" data-name="${u.artistName.toLowerCase()} ${u.username.toLowerCase()} ${u.genre.join(' ').toLowerCase()}" data-verified="${u.verified}" data-type="${u.accountType}" data-price="${u.startingPrice}" style="border-left:3px solid ${sc};">
      <div class="ac-cover">
        <img src="${u.coverImage || u.profileImage}" alt="${u.artistName}">
        <div class="ac-cover-grad"></div>
        <!-- Level meter: decorative motif -->
        <div style="position:absolute;top:10px;right:10px;display:flex;align-items:flex-end;gap:2px;height:16px;opacity:0.5;">
          ${[0.4,0.65,0.9,0.7,0.5,0.8,0.6].map((h,j) => `<div style="width:2.5px;height:${Math.round(h*100)}%;background:${sc};border-radius:1px;"></div>`).join('')}
        </div>
      </div>

      <div class="ac-artist-body">
        <div class="ac-artist-av-row">
          <div style="position:relative;">
            <img src="${u.profileImage}" class="av av-md" style="border:2px solid var(--c-panel);" alt="${u.artistName}">
            ${u.verified ? `<div style="position:absolute;bottom:0;right:0;width:15px;height:15px;background:var(--signal);border-radius:50%;border:2px solid var(--c-panel);display:flex;align-items:center;justify-content:center;"><i class="fas fa-check" style="font-size:7px;color:#000;"></i></div>` : ''}
          </div>
          <!-- Mini waveform motif -->
          <div class="ac-waveform-tag" style="color:${sc};">
            ${wh.map(h => `<div class="ac-wv-bar" style="height:${Math.round(h*100)}%;background:currentColor;"></div>`).join('')}
          </div>
        </div>

        <div style="font-weight:700;font-size:0.9375rem;letter-spacing:-0.01em;margin-bottom:2px;">${u.artistName}</div>
        <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);margin-bottom:10px;">@${u.username} · ${u.accountType === 'producer' ? 'Producer' : 'Artist'}</div>

        <div class="ac-tags">
          ${u.genre.slice(0,2).map(g => `<span class="badge badge-muted">${g}</span>`).join('')}
          ${u.liveSession ? `<span class="badge badge-ok"><i class="fas fa-broadcast-tower" style="font-size:8px;"></i> Live</span>` : ''}
        </div>

        <!-- Bio snippet -->
        <p style="font-size:0.8125rem;color:var(--t3);line-height:1.55;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${u.bio}</p>

        <div class="ac-stats">
          <div>
            <div style="font-size:0.65rem;color:var(--t4);font-family:var(--font-mono);margin-bottom:2px;">STARTING AT</div>
            <div style="font-size:1rem;font-weight:800;letter-spacing:-0.02em;color:${sc};">${formatPrice(u.startingPrice)}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem;font-weight:600;"><span style="color:var(--signal);">★</span> ${u.rating.toFixed(1)}</div>
            <div class="mono-sm" style="color:var(--t4);">${u.reviewCount} reviews</div>
          </div>
        </div>
      </div>
    </div>`}).join('')}
  </div>
</div>

${siteFooter()}

<script>
// Live search/filter
const searchEl = document.getElementById('ac-search');
const cards = document.querySelectorAll('.ac-artist-card');
const chipVerified = document.getElementById('chip-verified');

function applyFilters() {
  const q = searchEl.value.toLowerCase().trim();
  const priceMax = parseInt(document.getElementById('filter-price').value) || Infinity;
  const typeFilter = document.getElementById('filter-type').value;
  const verifiedOnly = chipVerified.classList.contains('on');

  cards.forEach(card => {
    const name = card.dataset.name || '';
    const price = parseInt(card.dataset.price) || 0;
    const verified = card.dataset.verified === 'true';
    const type = card.dataset.type || '';

    const matchQ = !q || name.includes(q);
    const matchPrice = price <= priceMax;
    const matchType = !typeFilter || type === typeFilter;
    const matchVerified = !verifiedOnly || verified;

    card.style.display = (matchQ && matchPrice && matchType && matchVerified) ? '' : 'none';
  });
}

searchEl.addEventListener('input', applyFilters);
document.getElementById('filter-genre').addEventListener('change', applyFilters);
document.getElementById('filter-type').addEventListener('change', applyFilters);
document.getElementById('filter-price').addEventListener('change', applyFilters);
chipVerified.addEventListener('click', () => setTimeout(applyFilters, 0));
document.getElementById('chip-live').addEventListener('click', () => setTimeout(applyFilters, 0));

// Stagger animation
cards.forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(12px)';
  card.style.transition = 'opacity 0.35s ease, transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease';
  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transform = '';
  }, i * 45);
});
</script>

${closeShell()}
`;
}
