import { shell, closeShell, publicNav, siteFooter } from '../layout';
import { users, formatPrice, formatListeners } from '../data';

export function explorePage(): string {
  const allUsers = users.filter(u => u.verified || u.rating >= 4.0);
  const allGenres = Array.from(new Set(allUsers.flatMap(u => u.genre || []))).sort();

  return shell('Find Artists — ArtistCollab', `

  /* ══ EXPLORE PAGE ══════════════════════════════════════════════════════════ */

  .exp-page { max-width: 1200px; margin: 0 auto; padding: 0 24px 80px; }

  /* ── Page header ── */
  .exp-header {
    padding: 40px 0 28px;
    border-bottom: 1px solid var(--c-wire);
    margin-bottom: 28px;
  }
  .exp-h1 {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 800; letter-spacing: -0.02em;
    color: var(--t1); margin-bottom: 6px;
  }
  .exp-sub { font-size: 0.9375rem; color: var(--t2); }
  .exp-count {
    font-family: var(--font-mono); font-size: 0.75rem;
    color: var(--t3); margin-top: 4px;
  }

  /* ── Filter bar ── */
  .exp-filters {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 28px; flex-wrap: wrap;
  }
  .exp-search-wrap {
    flex: 1; min-width: 240px; position: relative;
  }
  .exp-search-wrap i {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--t3); font-size: 13px; pointer-events: none;
  }
  .exp-search {
    width: 100%; background: var(--c-raised);
    border: 1px solid var(--c-rim); border-radius: var(--r-lg);
    padding: 11px 14px 11px 38px;
    color: var(--t1); font-size: 0.875rem; font-family: var(--font-body);
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .exp-search:focus { border-color: var(--signal); box-shadow: 0 0 0 3px var(--signal-dim); }
  .exp-search::placeholder { color: var(--t4); }
  .exp-select {
    background: var(--c-raised); border: 1px solid var(--c-rim);
    border-radius: var(--r-lg); padding: 11px 14px;
    color: var(--t1); font-size: 0.875rem; font-family: var(--font-body);
    outline: none; cursor: pointer; min-width: 140px;
    transition: border-color 0.15s;
  }
  .exp-select:focus { border-color: var(--signal); }
  .exp-chip {
    display: flex; align-items: center; gap: 6px;
    background: var(--c-raised); border: 1px solid var(--c-rim);
    border-radius: var(--r-lg); padding: 10px 14px;
    font-size: 0.8125rem; color: var(--t2); cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .exp-chip.on {
    border-color: var(--signal); background: var(--signal-dim);
    color: var(--signal);
  }
  .exp-chip i { font-size: 11px; }

  /* ── Results header ── */
  .exp-results-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; gap: 12px; flex-wrap: wrap;
  }
  .exp-results-count { font-size: 0.875rem; color: var(--t2); }
  .exp-sort {
    background: var(--c-raised); border: 1px solid var(--c-rim);
    border-radius: var(--r-md); padding: 8px 12px;
    font-size: 0.8125rem; color: var(--t2); font-family: var(--font-body);
    outline: none; cursor: pointer;
  }

  /* ── Artist grid ── */
  .exp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  /* ── Artist card ── */
  .ec {
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); overflow: hidden;
    text-decoration: none; display: block;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .ec:hover {
    transform: translateY(-3px);
    border-color: rgba(200,255,0,0.2);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  }
  .ec-cover {
    position: relative; height: 140px; overflow: hidden;
    background: var(--c-raised);
  }
  .ec-cover img {
    width: 100%; height: 100%; object-fit: cover;
    opacity: 0.5; transition: opacity 0.2s, transform 0.2s;
  }
  .ec:hover .ec-cover img { opacity: 0.65; transform: scale(1.04); }
  .ec-cover-grad {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 30%, var(--c-panel) 100%);
  }
  .ec-avt {
    position: absolute; bottom: -18px; left: 14px;
    width: 44px; height: 44px; border-radius: 50%;
    border: 2px solid var(--c-panel); overflow: hidden;
    background: var(--c-raised);
  }
  .ec-avt img { width: 100%; height: 100%; object-fit: cover; }
  .ec-avail-dot {
    position: absolute; bottom: -4px; right: -2px;
    width: 10px; height: 10px; border-radius: 50%;
    border: 2px solid var(--c-panel);
  }
  .ec-body { padding: 26px 14px 14px; }
  .ec-name {
    font-family: var(--font-display); font-size: 0.9375rem;
    font-weight: 700; color: var(--t1); margin-bottom: 2px;
    display: flex; align-items: center; gap: 6px;
  }
  .ec-verify { color: var(--s-ok); font-size: 11px; }
  .ec-location { font-size: 0.75rem; color: var(--t3); margin-bottom: 8px; }
  .ec-stat-row {
    display: flex; align-items: center; gap: 12px;
    font-size: 0.75rem; color: var(--t2); margin-bottom: 10px;
  }
  .ec-stat { display: flex; align-items: center; gap: 4px; }
  .ec-stat i { font-size: 10px; color: var(--t4); }
  .ec-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }
  .ec-tag {
    font-size: 0.625rem; padding: 2px 7px; border-radius: var(--r-full);
    background: var(--c-lift); border: 1px solid var(--c-wire);
    color: var(--t3); font-family: var(--font-mono);
  }
  .ec-foot {
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px; padding-top: 10px; border-top: 1px solid var(--c-wire);
  }
  .ec-price { font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 700; color: var(--signal); }
  .ec-book {
    background: var(--signal); color: var(--c-void);
    border: none; border-radius: var(--r-md);
    padding: 6px 14px; font-size: 0.75rem; font-weight: 700;
    cursor: pointer; text-decoration: none;
    transition: opacity 0.15s;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .ec-book:hover { opacity: 0.85; }

  /* ── Empty state ── */
  .exp-empty {
    text-align: center; padding: 80px 24px;
    grid-column: 1 / -1;
  }
  .exp-empty i { font-size: 2.5rem; color: var(--t4); margin-bottom: 16px; display: block; }
  .exp-empty p { color: var(--t3); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .exp-filters { gap: 8px; }
    .exp-search-wrap { min-width: 100%; }
    .exp-select { flex: 1; min-width: 120px; }
    .exp-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
  }
  @media (max-width: 480px) {
    .exp-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .ec-cover { height: 110px; }
    .ec-body { padding: 24px 10px 10px; }
    .exp-chips { display: none; }
  }

  `, publicNav() + `

  <div class="exp-page">

    <!-- Header -->
    <div class="exp-header">
      <h1 class="exp-h1">Find Artists</h1>
      <p class="exp-sub">Discover verified producers, vocalists, engineers, and beatmakers ready to collaborate.</p>
      <div class="exp-count" id="result-count">${allUsers.length} artists available</div>
    </div>

    <!-- Filter bar -->
    <div class="exp-filters" id="filters">
      <div class="exp-search-wrap">
        <i class="fas fa-search"></i>
        <input class="exp-search" id="exp-search" type="text" placeholder="Search by name, genre, location…" autocomplete="off">
      </div>

      <select class="exp-select" id="filter-genre">
        <option value="">All Genres</option>
        ${allGenres.map(g => `<option value="${g.toLowerCase()}">${g}</option>`).join('')}
      </select>

      <select class="exp-select" id="filter-price">
        <option value="">Any Price</option>
        <option value="0-100">Under $100</option>
        <option value="100-250">$100 – $250</option>
        <option value="250-500">$250 – $500</option>
        <option value="500+">$500+</option>
      </select>

      <select class="exp-select" id="filter-sort" style="min-width:130px;">
        <option value="rating">Top Rated</option>
        <option value="price_asc">Price: Low–High</option>
        <option value="price_desc">Price: High–Low</option>
        <option value="listeners">Most Popular</option>
      </select>

      <div class="exp-chip" id="chip-available" data-key="available">
        <i class="fas fa-circle" style="color:var(--s-ok);font-size:8px;"></i> Available Now
      </div>
      <div class="exp-chip" id="chip-verified" data-key="verified">
        <i class="fas fa-check-circle"></i> Verified Only
      </div>
    </div>

    <!-- Results -->
    <div class="exp-results-head">
      <div class="exp-results-count" id="results-label">Showing all artists</div>
    </div>

    <div class="exp-grid" id="artist-grid">
      ${allUsers.map(u => {
        const availColor = u.availability === 'available' ? '#2DCA72' : u.availability === 'busy' ? '#FF4D6D' : '#52526A';
        return `
      <a class="ec"
         href="/artist/${u.id}"
         data-name="${u.artistName.toLowerCase()}"
         data-genre="${(u.genre || []).join(',').toLowerCase()}"
         data-location="${(u.location || '').toLowerCase()}"
         data-price="${u.startingPrice}"
         data-rating="${u.rating}"
         data-listeners="${u.monthlyListeners}"
         data-available="${u.availability === 'available' ? '1' : '0'}"
         data-verified="${u.verified ? '1' : '0'}">
        <div class="ec-cover">
          <img src="${u.coverImage || u.profileImage}" alt="${u.artistName}">
          <div class="ec-cover-grad"></div>
          <div class="ec-avt">
            <img src="${u.profileImage}" alt="${u.artistName}">
            <div class="ec-avail-dot" style="background:${availColor};"></div>
          </div>
        </div>
        <div class="ec-body">
          <div class="ec-name">
            ${u.artistName}
            ${u.verified ? '<i class="fas fa-check-circle ec-verify"></i>' : ''}
          </div>
          <div class="ec-location"><i class="fas fa-map-marker-alt" style="margin-right:4px;font-size:9px;"></i>${u.location}</div>
          <div class="ec-stat-row">
            <span class="ec-stat"><i class="fas fa-headphones"></i>${formatListeners(u.monthlyListeners)}</span>
            <span class="ec-stat"><i class="fas fa-star" style="color:var(--s-warn);"></i>${u.rating.toFixed(1)}</span>
            <span class="ec-stat"><i class="fas fa-check"></i>${u.completedProjects}</span>
          </div>
          <div class="ec-tags">
            ${(u.genre || []).slice(0, 2).map(g => `<span class="ec-tag">${g}</span>`).join('')}
          </div>
          <div class="ec-foot">
            <span class="ec-price">From ${formatPrice(u.startingPrice)}</span>
            <a class="ec-book" href="/booking/${u.id}" onclick="event.stopPropagation();">
              <i class="fas fa-bolt"></i> Book
            </a>
          </div>
        </div>
      </a>`;
      }).join('')}
    </div>

  </div><!-- /exp-page -->

  ${siteFooter()}

  <script>
  (function() {
    const grid      = document.getElementById('artist-grid');
    const searchEl  = document.getElementById('exp-search');
    const genreEl   = document.getElementById('filter-genre');
    const priceEl   = document.getElementById('filter-price');
    const sortEl    = document.getElementById('filter-sort');
    const countEl   = document.getElementById('result-count');
    const labelEl   = document.getElementById('results-label');
    const chipAvail = document.getElementById('chip-available');
    const chipVer   = document.getElementById('chip-verified');

    let filterAvail = false, filterVer = false;

    function getCards() { return Array.from(grid.querySelectorAll('.ec')); }

    function applyFilters() {
      const q     = searchEl.value.trim().toLowerCase();
      const genre = genreEl.value;
      const sort  = sortEl.value;
      const price = priceEl.value;

      let cards = getCards();

      // Filter
      cards.forEach(c => {
        let show = true;
        if (q && !c.dataset.name.includes(q) && !c.dataset.genre.includes(q) && !c.dataset.location.includes(q)) show = false;
        if (genre && !c.dataset.genre.includes(genre)) show = false;
        if (filterAvail && c.dataset.available !== '1') show = false;
        if (filterVer   && c.dataset.verified   !== '1') show = false;
        if (price) {
          const p = parseInt(c.dataset.price, 10);
          if (price === '0-100' && p >= 100) show = false;
          if (price === '100-250' && (p < 100 || p >= 250)) show = false;
          if (price === '250-500' && (p < 250 || p >= 500)) show = false;
          if (price === '500+' && p < 500) show = false;
        }
        c.style.display = show ? '' : 'none';
      });

      // Sort visible cards
      const visible = cards.filter(c => c.style.display !== 'none');
      visible.sort((a, b) => {
        if (sort === 'rating')      return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (sort === 'price_asc')   return parseInt(a.dataset.price,10) - parseInt(b.dataset.price,10);
        if (sort === 'price_desc')  return parseInt(b.dataset.price,10) - parseInt(a.dataset.price,10);
        if (sort === 'listeners')   return parseInt(b.dataset.listeners,10) - parseInt(a.dataset.listeners,10);
        return 0;
      });
      visible.forEach(c => grid.appendChild(c));

      // Update counts
      const n = visible.length;
      countEl.textContent = n + ' artist' + (n !== 1 ? 's' : '') + ' available';
      labelEl.textContent = 'Showing ' + n + ' artist' + (n !== 1 ? 's' : '');

      // Empty state
      let empty = grid.querySelector('.exp-empty');
      if (n === 0) {
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'exp-empty';
          empty.innerHTML = '<i class="fas fa-search"></i><p>No artists match your filters.<br>Try adjusting your search.</p>';
          grid.appendChild(empty);
        }
      } else if (empty) {
        empty.remove();
      }
    }

    searchEl.addEventListener('input', applyFilters);
    genreEl.addEventListener('change', applyFilters);
    priceEl.addEventListener('change', applyFilters);
    sortEl.addEventListener('change', applyFilters);

    chipAvail.addEventListener('click', () => {
      filterAvail = !filterAvail;
      chipAvail.classList.toggle('on', filterAvail);
      applyFilters();
    });
    chipVer.addEventListener('click', () => {
      filterVer = !filterVer;
      chipVer.classList.toggle('on', filterVer);
      applyFilters();
    });

    // Initial sort
    applyFilters();
  })();
  </script>
  ${closeShell()}`);
}
