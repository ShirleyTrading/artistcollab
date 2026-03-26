import { shell, closeShell, publicNav, siteFooter } from '../layout';
import { users, listings, getUserById, formatPrice } from '../data';

export function marketplacePage(): string {
  const activeListings = listings.filter(l => l.active);
  const categories     = Array.from(new Set(activeListings.map(l => l.category))).sort();

  return shell('Browse Services — ArtistCollab', `

  /* ══ MARKETPLACE ═══════════════════════════════════════════════════════════ */

  .mkt-page { max-width: 1200px; margin: 0 auto; padding: 0 24px 80px; }

  .mkt-header {
    padding: 40px 0 28px;
    border-bottom: 1px solid var(--c-wire);
    margin-bottom: 28px;
  }
  .mkt-h1 {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 800; letter-spacing: -0.02em;
    color: var(--t1); margin-bottom: 6px;
  }
  .mkt-sub { font-size: 0.9375rem; color: var(--t2); }

  /* ── Filter row ── */
  .mkt-filters {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 28px; flex-wrap: wrap;
  }
  .mkt-search-wrap { flex: 1; min-width: 240px; position: relative; }
  .mkt-search-wrap i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--t3); font-size: 13px; pointer-events: none; }
  .mkt-search {
    width: 100%; background: var(--c-raised); border: 1px solid var(--c-rim);
    border-radius: var(--r-lg); padding: 11px 14px 11px 38px;
    color: var(--t1); font-size: 0.875rem; font-family: var(--font-body);
    outline: none; transition: border-color 0.15s;
  }
  .mkt-search:focus { border-color: var(--signal); }
  .mkt-search::placeholder { color: var(--t4); }
  .mkt-select {
    background: var(--c-raised); border: 1px solid var(--c-rim); border-radius: var(--r-lg);
    padding: 11px 14px; color: var(--t1); font-size: 0.875rem; font-family: var(--font-body);
    outline: none; cursor: pointer; min-width: 140px;
  }
  .mkt-select:focus { border-color: var(--signal); }

  /* ── Category chips ── */
  .mkt-cats {
    display: flex; gap: 8px; flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .mkt-cat {
    padding: 6px 16px; border-radius: var(--r-full);
    background: var(--c-raised); border: 1px solid var(--c-rim);
    font-size: 0.8125rem; color: var(--t2); cursor: pointer;
    transition: all 0.15s;
  }
  .mkt-cat.on { border-color: var(--signal); background: var(--signal-dim); color: var(--signal); }

  /* ── Listing grid ── */
  .mkt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  /* ── Listing card ── */
  .lc {
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); overflow: hidden;
    text-decoration: none; display: flex; flex-direction: column;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .lc:hover {
    transform: translateY(-3px);
    border-color: rgba(200,255,0,0.2);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  }
  .lc-head {
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--c-wire);
    display: flex; align-items: center; gap: 10px;
  }
  .lc-avt { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
  .lc-artist-name { font-size: 0.875rem; font-weight: 700; color: var(--t1); }
  .lc-artist-loc { font-size: 0.75rem; color: var(--t3); }
  .lc-body { padding: 14px 16px; flex: 1; }
  .lc-title { font-size: 0.9375rem; font-weight: 700; color: var(--t1); margin-bottom: 6px; }
  .lc-category { font-family: var(--font-mono); font-size: 0.625rem; color: var(--t3); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px; }
  .lc-collab-types { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }
  .lc-ct {
    font-size: 0.6875rem; padding: 2px 8px; border-radius: var(--r-full);
    background: var(--c-lift); border: 1px solid var(--c-wire); color: var(--t3);
  }
  .lc-pkgs { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; }
  .lc-pkg {
    font-size: 0.6875rem; padding: 3px 9px; border-radius: var(--r-full);
    background: var(--c-raised); border: 1px solid var(--c-rim); color: var(--t2);
    font-family: var(--font-mono);
  }
  .lc-foot {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-top: 1px solid var(--c-wire);
    background: var(--c-raised);
    margin-top: auto;
  }
  .lc-price-block {}
  .lc-from { font-size: 0.625rem; color: var(--t4); text-transform: uppercase; letter-spacing: 0.06em; }
  .lc-price { font-family: var(--font-mono); font-size: 1rem; font-weight: 700; color: var(--signal); }
  .lc-meta { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: var(--t3); }
  .lc-book {
    background: var(--signal); color: var(--c-void); border: none;
    border-radius: var(--r-md); padding: 7px 16px; font-size: 0.8125rem;
    font-weight: 700; cursor: pointer; text-decoration: none;
    transition: opacity 0.15s; display: inline-flex; align-items: center; gap: 5px;
  }
  .lc-book:hover { opacity: 0.85; }

  /* Cross-link */
  .mkt-xlink {
    background: var(--c-raised); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px; gap: 16px; flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .mkt-filters { flex-direction: column; align-items: stretch; }
    .mkt-search-wrap { min-width: 100%; }
    .mkt-grid { grid-template-columns: 1fr; }
  }

  `, publicNav() + `

  <div class="mkt-page">

    <!-- Header -->
    <div class="mkt-header">
      <h1 class="mkt-h1">Browse Services</h1>
      <p class="mkt-sub">Find and book professional music services from verified artists.</p>
    </div>

    <!-- Cross-link to Explore -->
    <div class="mkt-xlink">
      <div>
        <div style="font-size:0.875rem;font-weight:600;color:var(--t1);margin-bottom:4px;">Looking for an artist instead?</div>
        <div style="font-size:0.8125rem;color:var(--t2);">Browse artist profiles, listen to music, and book directly.</div>
      </div>
      <a href="/explore" class="btn btn-secondary">
        <i class="fas fa-users"></i> Find Artists
      </a>
    </div>

    <!-- Filters -->
    <div class="mkt-filters">
      <div class="mkt-search-wrap">
        <i class="fas fa-search"></i>
        <input class="mkt-search" id="mkt-search" type="text" placeholder="Search services…" autocomplete="off">
      </div>
      <select class="mkt-select" id="mkt-sort">
        <option value="rating">Top Rated</option>
        <option value="price_asc">Price: Low–High</option>
        <option value="price_desc">Price: High–Low</option>
        <option value="orders">Most Orders</option>
      </select>
    </div>

    <!-- Category pills -->
    <div class="mkt-cats">
      <div class="mkt-cat on" data-cat="">All Services</div>
      ${categories.map(c => `<div class="mkt-cat" data-cat="${c.toLowerCase()}">${c}</div>`).join('')}
    </div>

    <!-- Grid -->
    <div class="mkt-grid" id="mkt-grid">
      ${activeListings.map(l => {
        const artist  = getUserById(l.userId);
        const basePkg = l.packages?.[0];
        if (!artist) return '';
        return `
      <a class="lc" href="/artist/${artist.id}"
         data-title="${l.title.toLowerCase()}"
         data-cat="${l.category.toLowerCase()}"
         data-price="${basePkg?.price || 0}"
         data-rating="${l.rating}"
         data-orders="${l.orders}">
        <div class="lc-head">
          <img class="lc-avt" src="${artist.profileImage}" alt="${artist.artistName}">
          <div>
            <div class="lc-artist-name">${artist.artistName}</div>
            <div class="lc-artist-loc"><i class="fas fa-map-marker-alt" style="font-size:9px;margin-right:4px;"></i>${artist.location}</div>
          </div>
          ${artist.verified ? '<i class="fas fa-check-circle" style="color:var(--s-ok);margin-left:auto;font-size:14px;"></i>' : ''}
        </div>
        <div class="lc-body">
          <div class="lc-title">${l.title}</div>
          <div class="lc-category">${l.category}</div>
          <div class="lc-collab-types">
            ${(l.collabTypes || []).map(ct => `<span class="lc-ct">${ct === 'pay_for_hire' ? 'Pay-for-Hire' : 'Revenue Split'}</span>`).join('')}
          </div>
          <div class="lc-pkgs">
            ${(l.packages || []).slice(0, 3).map(pkg => `<span class="lc-pkg">${pkg.name} · $${pkg.price}</span>`).join('')}
          </div>
        </div>
        <div class="lc-foot">
          <div class="lc-price-block">
            <div class="lc-from">From</div>
            <div class="lc-price">${formatPrice(basePkg?.price || 0)}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
            <div class="lc-meta">
              <span><i class="fas fa-star" style="color:var(--s-warn);"></i> ${l.rating.toFixed(1)}</span>
              <span><i class="fas fa-check"></i> ${l.orders}</span>
            </div>
            <a class="lc-book" href="/booking/${artist.id}/${l.id}" onclick="event.stopPropagation();">
              <i class="fas fa-bolt"></i> Book
            </a>
          </div>
        </div>
      </a>`;
      }).join('')}
    </div>

  </div>

  ${siteFooter()}

  <script>
  (function() {
    const grid     = document.getElementById('mkt-grid');
    const searchEl = document.getElementById('mkt-search');
    const sortEl   = document.getElementById('mkt-sort');
    let activeCat  = '';

    function getCards() { return Array.from(grid.querySelectorAll('.lc')); }

    function apply() {
      const q    = searchEl.value.trim().toLowerCase();
      const sort = sortEl.value;
      let cards  = getCards();

      cards.forEach(c => {
        const show = (!q || c.dataset.title.includes(q))
                  && (!activeCat || c.dataset.cat === activeCat);
        c.style.display = show ? '' : 'none';
      });

      const visible = cards.filter(c => c.style.display !== 'none');
      visible.sort((a, b) => {
        if (sort === 'rating')     return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (sort === 'price_asc')  return parseInt(a.dataset.price, 10) - parseInt(b.dataset.price, 10);
        if (sort === 'price_desc') return parseInt(b.dataset.price, 10) - parseInt(a.dataset.price, 10);
        if (sort === 'orders')     return parseInt(b.dataset.orders, 10) - parseInt(a.dataset.orders, 10);
        return 0;
      });
      visible.forEach(c => grid.appendChild(c));
    }

    searchEl.addEventListener('input', apply);
    sortEl.addEventListener('change', apply);

    document.querySelectorAll('.mkt-cat').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.mkt-cat').forEach(c => c.classList.remove('on'));
        chip.classList.add('on');
        activeCat = chip.dataset.cat || '';
        apply();
      });
    });

    apply();
  })();
  </script>

  ${closeShell()}`);
}

export function listingPage(listingId: string): string {
  const listing = listings.find(l => l.id === listingId);
  if (!listing) {
    return shell('Service Not Found', '') + publicNav() + `
    <div style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:60px 24px;">
      <div style="text-align:center;">
        <h1 style="font-family:var(--font-display);font-size:2rem;color:var(--t1);margin-bottom:12px;">Service not found</h1>
        <a href="/marketplace" class="btn btn-primary">Browse Services</a>
      </div>
    </div>
    ${siteFooter()}${closeShell()}`;
  }

  const artist = getUserById(listing.userId);
  if (!artist) return shell('Not Found','') + publicNav() + '<div style="padding:80px;text-align:center;color:var(--t2);">Artist not found</div>' + siteFooter() + closeShell();

  return shell(`${listing.title} — ArtistCollab`, `
  .lst-page { max-width: 960px; margin: 0 auto; padding: 40px 24px 80px; }
  .lst-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
  @media(max-width:900px){.lst-grid{grid-template-columns:1fr;}}
  `, publicNav() + `
  <div class="lst-page">
    <nav style="font-size:0.8125rem;color:var(--t3);margin-bottom:24px;">
      <a href="/marketplace" style="color:var(--t3);text-decoration:none;">Browse Services</a>
      <span style="margin:0 8px;">›</span>
      <span style="color:var(--t1);">${listing.title}</span>
    </nav>

    <div class="lst-grid">
      <div>
        <h1 style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;color:var(--t1);margin-bottom:8px;">${listing.title}</h1>
        <div style="font-family:var(--font-mono);font-size:0.6875rem;color:var(--t3);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">${listing.category}</div>

        <!-- Artist row -->
        <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-lg);margin-bottom:24px;">
          <img src="${artist.profileImage}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" alt="${artist.artistName}">
          <div style="flex:1;">
            <div style="font-size:0.9375rem;font-weight:700;color:var(--t1);">${artist.artistName}</div>
            <div style="font-size:0.75rem;color:var(--t3);">${artist.location} · ${artist.rating.toFixed(1)}★ (${artist.reviewCount} reviews)</div>
          </div>
          <a href="/artist/${artist.id}" class="btn btn-secondary btn-sm">View Profile</a>
        </div>

        <div style="font-size:0.9375rem;line-height:1.7;color:var(--t2);margin-bottom:28px;">${listing.description}</div>

        <!-- Packages -->
        <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t3);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:14px;">Packages</div>
        ${(listing.packages || []).map((pkg, i) => `
        <div style="background:var(--c-panel);border:1px solid var(--c-rim);border-radius:var(--r-lg);padding:20px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div style="font-size:0.875rem;font-weight:700;color:var(--t1);">${pkg.name}</div>
            <div style="font-family:var(--font-mono);font-size:1.125rem;font-weight:800;color:var(--signal);">$${pkg.price}</div>
          </div>
          <div style="display:flex;gap:16px;margin-bottom:12px;font-size:0.75rem;color:var(--t3);">
            <span><i class="fas fa-clock" style="margin-right:4px;"></i>${pkg.deliveryDays} day delivery</span>
            <span><i class="fas fa-redo" style="margin-right:4px;"></i>${pkg.revisions} revisions</span>
          </div>
          ${(pkg.features || []).map(f => `<div style="display:flex;align-items:center;gap:8px;font-size:0.8125rem;color:var(--t2);margin-bottom:5px;"><i class="fas fa-check" style="color:var(--s-ok);font-size:10px;"></i>${f}</div>`).join('')}
          <a href="/booking/${artist.id}/${listing.id}" class="btn btn-primary btn-sm" style="margin-top:14px;width:100%;justify-content:center;display:flex;">Book This Package</a>
        </div>`).join('')}
      </div>

      <!-- Sidebar -->
      <div style="position:sticky;top:76px;">
        <div style="background:var(--c-panel);border:1px solid var(--c-rim);border-radius:var(--r-xl);padding:20px;border-top:2px solid var(--signal);">
          <div style="font-family:var(--font-mono);font-size:0.625rem;color:var(--t3);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">From</div>
          <div style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--signal);margin-bottom:16px;">${formatPrice(listing.packages?.[0]?.price || 0)}</div>
          <div style="display:flex;gap:12px;margin-bottom:16px;font-size:0.75rem;color:var(--t2);">
            <span><i class="fas fa-clock" style="margin-right:4px;color:var(--t4);"></i>${listing.packages?.[0]?.deliveryDays}d</span>
            <span><i class="fas fa-redo" style="margin-right:4px;color:var(--t4);"></i>${listing.packages?.[0]?.revisions} rev</span>
            <span><i class="fas fa-star" style="margin-right:4px;color:var(--s-warn);"></i>${listing.rating.toFixed(1)}</span>
          </div>
          <a href="/booking/${artist.id}/${listing.id}" class="btn btn-primary" style="width:100%;justify-content:center;display:flex;margin-bottom:10px;">
            <i class="fas fa-bolt"></i> Book Now
          </a>
          <a href="/artist/${artist.id}" class="btn btn-secondary" style="width:100%;justify-content:center;display:flex;margin-bottom:12px;">
            View Artist Profile
          </a>
          <div style="display:flex;align-items:center;gap:7px;background:rgba(45,202,114,0.07);border:1px solid rgba(45,202,114,0.18);border-radius:var(--r-md);padding:9px 12px;font-size:0.75rem;color:var(--s-ok);font-weight:600;">
            <i class="fas fa-shield-alt"></i> Escrow protected
          </div>
        </div>
      </div>
    </div>
  </div>
  ${siteFooter()}
  ${closeShell()}`);
}
