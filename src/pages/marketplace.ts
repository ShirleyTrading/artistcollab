import { head, nav, footer, closeHTML } from '../layout';
import { listings, users, formatPrice } from '../data';

export function marketplacePage(): string {
  return head('Feature Marketplace') + nav('marketplace') + `

<section style="padding:40px 24px 32px;background:var(--bg2);border-bottom:1px solid var(--border);">
  <div class="container">
    <div class="mb-6">
      <div class="badge badge-purple mb-3">Marketplace</div>
      <h1 style="font-size:2.4rem;margin-bottom:8px;">Feature Marketplace</h1>
      <p style="font-size:16px;color:var(--text2);">Book features, hooks, verses, beats, and more from verified artists and producers.</p>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <select class="form-select" style="width:auto;" id="catFilter" onchange="filterListings()">
        <option value="">All Categories</option>
        <option>Feature Verse</option><option>Hook / Chorus</option>
        <option>Custom Beat</option><option>Songwriter / Topline</option>
        <option>Mixing</option><option>Full Song</option>
      </select>
      <select class="form-select" style="width:auto;" id="priceFilter" onchange="filterListings()">
        <option value="">Any Price</option>
        <option value="0-200">Under $200</option>
        <option value="200-500">$200 – $500</option>
        <option value="500-1000">$500 – $1,000</option>
        <option value="1000+">$1,000+</option>
      </select>
      <select class="form-select" style="width:auto;" id="deliveryFilter" onchange="filterListings()">
        <option value="">Any Delivery</option>
        <option value="1">1 Day</option>
        <option value="3">Within 3 Days</option>
        <option value="7">Within 1 Week</option>
      </select>
      <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;">
        <input type="checkbox" id="verifiedFilter" onchange="filterListings()" style="accent-color:var(--accent);">
        <span style="color:var(--text2);">Verified Artists Only</span>
      </label>
    </div>
  </div>
</section>

<!-- Category pills -->
<div style="padding:20px 24px;border-bottom:1px solid var(--border);overflow-x:auto;white-space:nowrap;">
  <div class="container" style="display:flex;gap:8px;">
    ${['All', 'Feature Verse', 'Hook / Chorus', 'Custom Beat', 'Songwriter', 'Mixing & Mastering', 'Full Song', 'Promo / Content'].map((cat, i) => `
    <button class="tag" style="${i === 0 ? 'background:var(--accent);color:white;border-color:var(--accent);' : ''}" onclick="selectCategory(this, '${cat === 'All' ? '' : cat}')" id="cat-btn-${i}">
      ${cat}
    </button>`).join('')}
  </div>
</div>

<section style="padding:32px 24px;">
  <div class="container">
    <div id="listingGrid" style="display:flex;flex-direction:column;gap:20px;">
      ${listings.map(l => renderListingRow(l)).join('')}
    </div>
  </div>
</section>

<script>
const listingData = ${JSON.stringify(listings.map(l => {
  const artist = users.find(u => u.id === l.userId);
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    category: l.category,
    basePrice: l.packages[0].price,
    deliveryDays: l.packages[0].deliveryDays,
    fileFormats: l.fileFormats,
    orders: l.orders,
    rating: l.rating,
    artist: artist ? {
      id: artist.id,
      name: artist.artistName,
      profileImage: artist.profileImage,
      genre: artist.genre,
      verified: artist.verified,
      location: artist.location,
    } : null
  };
}))};

function filterListings() {
  const cat = document.getElementById('catFilter').value;
  const price = document.getElementById('priceFilter').value;
  const delivery = document.getElementById('deliveryFilter').value;
  const verified = document.getElementById('verifiedFilter').checked;
  
  let filtered = listingData.filter(l => {
    if(cat && l.category !== cat) return false;
    if(verified && !l.artist?.verified) return false;
    if(delivery && l.deliveryDays > parseInt(delivery)) return false;
    if(price) {
      const [min, max] = price === '1000+' ? [1000, Infinity] : price.split('-').map(Number);
      if(l.basePrice < min || l.basePrice > (max || Infinity)) return false;
    }
    return true;
  });
  
  const grid = document.getElementById('listingGrid');
  grid.innerHTML = filtered.length ? filtered.map(l => renderRow(l)).join('') : 
    '<div style="text-align:center;padding:64px;"><i class="fas fa-search" style="font-size:48px;color:var(--bg4);margin-bottom:16px;display:block;"></i><h3>No listings found</h3><p style="color:var(--text2);">Try adjusting your filters.</p></div>';
}

function selectCategory(btn, cat) {
  document.querySelectorAll('[id^="cat-btn-"]').forEach(b => {
    b.style.background = ''; b.style.color = ''; b.style.borderColor = '';
  });
  btn.style.background = 'var(--accent)';
  btn.style.color = 'white';
  btn.style.borderColor = 'var(--accent)';
  document.getElementById('catFilter').value = cat;
  filterListings();
}

function renderRow(l) {
  return \`<a href="/listing/\${l.id}" style="display:block;transition:transform 0.15s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform=''">
    <div class="card" style="padding:24px;display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;transition:border-color 0.2s;" onmouseover="this.style.borderColor='rgba(124,58,237,0.4)'" onmouseout="this.style.borderColor='var(--border)'">
      <img src="\${l.artist?.profileImage}" class="avatar" style="width:64px;height:64px;flex-shrink:0;" alt="\${l.artist?.name}">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:8px;">
          <div>
            <h3 style="font-size:18px;font-weight:700;margin-bottom:4px;">\${l.title}</h3>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span style="font-size:14px;color:var(--text2);">by \${l.artist?.name}</span>
              \${l.artist?.verified ? '<span class="badge badge-purple" style="font-size:11px;"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
              <span class="badge badge-gray" style="font-size:11px;">\${l.category}</span>
            </div>
          </div>
          <div class="text-right">
            <div style="font-size:11px;color:var(--text2);">Starting at</div>
            <div style="font-size:26px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--accent3);">\$\${l.basePrice.toLocaleString()}</div>
          </div>
        </div>
        <p style="font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">\${l.description}</p>
        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:13px;color:var(--text2);"><i class="fas fa-clock" style="margin-right:5px;"></i>\${l.deliveryDays} day delivery</span>
          <span style="font-size:13px;color:var(--text2);"><i class="fas fa-file-audio" style="margin-right:5px;"></i>\${l.fileFormats.join(', ')}</span>
          <span class="stars" style="font-size:12px;">★★★★★</span>
          <span style="font-size:13px;color:var(--text2);">\${l.rating} (\${l.orders} orders)</span>
          <span class="btn btn-primary btn-sm" style="margin-left:auto;">View Package <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </div>
  </a>\`;
}
</script>
` + footer() + closeHTML();
}

function renderListingRow(listing: typeof listings[0]): string {
  const artist = users.find(u => u.id === listing.userId);
  return `
  <a href="/listing/${listing.id}" style="display:block;transition:transform 0.15s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform=''">
    <div class="card" style="padding:24px;display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;transition:border-color 0.2s;" onmouseover="this.style.borderColor='rgba(124,58,237,0.4)'" onmouseout="this.style.borderColor='var(--border)'">
      <img src="${artist?.profileImage}" class="avatar" style="width:64px;height:64px;flex-shrink:0;" alt="${artist?.artistName}">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:8px;">
          <div>
            <h3 style="font-size:18px;font-weight:700;margin-bottom:4px;">${listing.title}</h3>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span style="font-size:14px;color:var(--text2);">by ${artist?.artistName}</span>
              ${artist?.verified ? '<span class="badge badge-purple" style="font-size:11px;"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
              <span class="badge badge-gray" style="font-size:11px;">${listing.category}</span>
            </div>
          </div>
          <div class="text-right">
            <div style="font-size:11px;color:var(--text2);">Starting at</div>
            <div style="font-size:26px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--accent3);">${formatPrice(listing.packages[0].price)}</div>
          </div>
        </div>
        <p style="font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${listing.description}</p>
        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:13px;color:var(--text2);"><i class="fas fa-clock" style="margin-right:5px;"></i>${listing.packages[0].deliveryDays} day delivery</span>
          <span style="font-size:13px;color:var(--text2);"><i class="fas fa-redo" style="margin-right:5px;"></i>${listing.packages[0].revisions === 999 ? 'Unlimited' : listing.packages[0].revisions} revisions</span>
          <span style="font-size:13px;color:var(--text2);"><i class="fas fa-file-audio" style="margin-right:5px;"></i>${listing.fileFormats.join(', ')}</span>
          <span class="stars" style="font-size:12px;">★★★★★</span>
          <span style="font-size:13px;color:var(--text2);">${listing.rating} (${listing.orders} orders)</span>
          <span class="btn btn-primary btn-sm" style="margin-left:auto;">View Package <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </div>
  </a>`;
}

export function listingDetailPage(listing: typeof listings[0]): string {
  const artist = users.find(u => u.id === listing.userId)!;
  return head(listing.title) + nav() + `

<section style="padding:32px 24px;">
  <div class="container">
    <!-- Breadcrumb -->
    <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);margin-bottom:24px;">
      <a href="/marketplace" style="color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Marketplace</a>
      <i class="fas fa-chevron-right" style="font-size:10px;"></i>
      <a href="/artist/${artist.id}" style="color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">${artist.artistName}</a>
      <i class="fas fa-chevron-right" style="font-size:10px;"></i>
      <span style="color:var(--text);">${listing.title}</span>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:start;">
      <!-- Left -->
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <a href="/artist/${artist.id}" style="display:flex;align-items:center;gap:12px;">
            <img src="${artist.profileImage}" class="avatar avatar-md" alt="${artist.artistName}" style="width:52px;height:52px;">
            <div>
              <div style="font-weight:700;">${artist.artistName}</div>
              <div style="font-size:13px;color:var(--text2);">${artist.genre[0]} ${artist.verified ? '· <span style="color:var(--accent3);">✓ Verified</span>' : ''}</div>
            </div>
          </a>
          <div class="stars" style="margin-left:auto;font-size:14px;">★★★★★ ${listing.rating} (${listing.orders})</div>
        </div>
        
        <h1 style="font-size:2rem;margin-bottom:16px;">${listing.title}</h1>
        <p style="font-size:16px;color:var(--text2);line-height:1.8;margin-bottom:32px;">${listing.description}</p>
        
        <!-- Packages -->
        <h2 style="font-size:20px;margin-bottom:20px;">Choose Your Package</h2>
        <div style="display:grid;grid-template-columns:repeat(${listing.packages.length},1fr);gap:16px;margin-bottom:32px;">
          ${listing.packages.map((pkg, i) => `
          <div class="card" style="padding:24px;cursor:pointer;transition:all 0.2s;${i === 1 ? 'border-color:rgba(124,58,237,0.5);background:linear-gradient(135deg,rgba(124,58,237,0.1),var(--bg2));' : ''}" 
               onclick="selectPackage(${i})" id="pkg-${i}">
            ${i === 1 ? '<div class="badge badge-purple" style="margin-bottom:12px;font-size:11px;">Most Popular</div>' : ''}
            <div style="font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">${pkg.name}</div>
            <div style="font-size:28px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--accent3);margin-bottom:4px;">${formatPrice(pkg.price)}</div>
            <div style="font-size:13px;color:var(--text2);margin-bottom:16px;">Delivered in ${pkg.deliveryDays} days</div>
            <div style="font-size:13px;color:var(--text2);margin-bottom:16px;">${pkg.revisions === 999 ? 'Unlimited' : pkg.revisions} revision${pkg.revisions !== 1 ? 's' : ''}</div>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
              ${pkg.features.map(f => `<li style="font-size:13px;display:flex;align-items:flex-start;gap:8px;"><i class="fas fa-check-circle" style="color:var(--green);margin-top:2px;flex-shrink:0;font-size:12px;"></i>${f}</li>`).join('')}
            </ul>
            <button class="btn btn-primary w-full" style="margin-top:20px;justify-content:center;" onclick="bookPackage('${listing.id}', '${pkg.name}', ${pkg.price})">
              Book ${pkg.name}
            </button>
          </div>`).join('')}
        </div>
        
        <!-- Add-ons -->
        ${listing.addOns.length > 0 ? `
        <div class="card p-6 mb-6">
          <h3 style="font-size:18px;margin-bottom:16px;">Add-Ons</h3>
          ${listing.addOns.map(addon => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border);">
            <div>
              <div style="font-weight:600;font-size:15px;">${addon.title}</div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-weight:700;color:var(--accent3);">+${formatPrice(addon.price)}</span>
              <button class="btn btn-secondary btn-sm" onclick="alert('Added to order')">Add</button>
            </div>
          </div>`).join('')}
        </div>` : ''}
        
        <!-- File Formats -->
        <div class="card p-6">
          <h3 style="font-size:18px;margin-bottom:16px;"><i class="fas fa-file-audio" style="color:var(--accent3);margin-right:8px;"></i>Included File Formats</h3>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${listing.fileFormats.map(f => `
            <div style="padding:10px 18px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;font-size:14px;font-weight:600;">
              ${f}
            </div>`).join('')}
          </div>
        </div>
      </div>
      
      <!-- Right Sidebar -->
      <div>
        <div class="card p-6" style="border-color:rgba(124,58,237,0.3);background:linear-gradient(135deg,rgba(124,58,237,0.08),var(--bg2));position:sticky;top:100px;">
          <div id="selected-pkg-display">
            <div style="font-size:12px;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Standard Package</div>
            <div style="font-size:32px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--accent3);margin-bottom:16px;">${formatPrice(listing.packages[1]?.price ?? listing.packages[0].price)}</div>
          </div>
          <a href="/booking/${artist.id}?listing=${listing.id}" class="btn btn-primary w-full btn-lg" style="justify-content:center;margin-bottom:12px;">
            <i class="fas fa-calendar-plus"></i> Book This Feature
          </a>
          <button class="btn btn-secondary w-full" style="justify-content:center;margin-bottom:20px;" onclick="alert('Sign up to message')">
            <i class="fas fa-comment-dots"></i> Contact ${artist.artistName}
          </button>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;font-size:13px;">
              <span style="color:var(--text2);">Delivery time</span>
              <span style="font-weight:600;">${listing.packages[1]?.deliveryDays ?? listing.packages[0].deliveryDays} days</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px;">
              <span style="color:var(--text2);">Revisions</span>
              <span style="font-weight:600;">${listing.packages[1]?.revisions === 999 ? 'Unlimited' : (listing.packages[1]?.revisions ?? listing.packages[0].revisions)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px;">
              <span style="color:var(--text2);">Orders completed</span>
              <span style="font-weight:600;">${listing.orders}+</span>
            </div>
          </div>
          <hr class="divider">
          <div style="display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--text2);">
            <div style="display:flex;align-items:center;gap:8px;"><i class="fas fa-shield-alt" style="color:var(--green);"></i> Payment held securely until delivery</div>
            <div style="display:flex;align-items:center;gap:8px;"><i class="fas fa-redo" style="color:var(--blue);"></i> Revision protection built in</div>
            <div style="display:flex;align-items:center;gap:8px;"><i class="fas fa-headset" style="color:var(--accent3);"></i> Platform support available</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
function selectPackage(index) {
  const prices = [${listing.packages.map(p => p.price).join(',')}];
  const names = [${listing.packages.map(p => `'${p.name}'`).join(',')}];
  document.getElementById('selected-pkg-display').innerHTML = \`
    <div style="font-size:12px;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">\${names[index]} Package</div>
    <div style="font-size:32px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--accent3);margin-bottom:16px;">$\${prices[index].toLocaleString()}</div>
  \`;
}

function bookPackage(listingId, pkgName, price) {
  window.location.href = '/booking?listing=' + listingId + '&package=' + encodeURIComponent(pkgName) + '&price=' + price;
}
</script>
` + footer() + closeHTML();
}
