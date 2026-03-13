import { head, nav, footer, closeHTML } from '../layout';
import { users, listings, formatPrice, formatListeners } from '../data';

export function explorePage(): string {
  return head('Explore Artists') + nav('explore') + `

<section style="padding:40px 24px;background:var(--bg2);border-bottom:1px solid var(--border);">
  <div class="container">
    <div class="mb-6">
      <h1 style="font-size:2.4rem;margin-bottom:8px;">Explore Artists & Producers</h1>
      <p style="font-size:16px;color:var(--text2);">Discover your next collaborator. Filter by genre, location, price, and more.</p>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
      <div style="flex:1;min-width:280px;position:relative;">
        <i class="fas fa-search" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text2);font-size:14px;"></i>
        <input class="form-input" type="text" placeholder="Search artists, genres, locations..." style="padding-left:40px;" id="searchInput" oninput="filterArtists()">
      </div>
      <select class="form-select" style="width:auto;min-width:150px;" id="genreFilter" onchange="filterArtists()">
        <option value="">All Genres</option>
        <option>Hip-Hop</option><option>Trap</option><option>R&B</option><option>Drill</option>
        <option>Pop</option><option>Afrobeats</option><option>Soul</option><option>Indie</option>
      </select>
      <select class="form-select" style="width:auto;min-width:150px;" id="typeFilter" onchange="filterArtists()">
        <option value="">All Types</option>
        <option value="artist">Artist</option>
        <option value="producer">Producer</option>
      </select>
      <select class="form-select" style="width:auto;min-width:160px;" id="priceFilter" onchange="filterArtists()">
        <option value="">Any Price</option>
        <option value="0-200">Under $200</option>
        <option value="200-500">$200 – $500</option>
        <option value="500-1000">$500 – $1,000</option>
        <option value="1000+">$1,000+</option>
      </select>
      <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;white-space:nowrap;">
        <input type="checkbox" id="verifiedOnly" onchange="filterArtists()" style="accent-color:var(--accent);width:16px;height:16px;">
        <span style="color:var(--text2);">Verified Only</span>
      </label>
      <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;white-space:nowrap;">
        <input type="checkbox" id="liveOnly" onchange="filterArtists()" style="accent-color:var(--accent);width:16px;height:16px;">
        <span style="color:var(--text2);">Live Sessions</span>
      </label>
    </div>
  </div>
</section>

<section style="padding:32px 24px;">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
      <div id="resultsCount" style="font-size:14px;color:var(--text2);">Showing ${users.length} artists</div>
      <select class="form-select" style="width:auto;" id="sortFilter" onchange="filterArtists()">
        <option value="rating">Top Rated</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="listeners">Most Listeners</option>
        <option value="reviews">Most Reviews</option>
      </select>
    </div>
    <div id="artistGrid" class="grid-auto">
      ${users.map(user => renderArtistCard(user)).join('')}
    </div>
    <div id="noResults" style="display:none;text-align:center;padding:64px 24px;">
      <i class="fas fa-search" style="font-size:48px;color:var(--bg4);margin-bottom:16px;display:block;"></i>
      <h3 style="margin-bottom:8px;">No artists found</h3>
      <p style="color:var(--text2);">Try adjusting your filters or search term.</p>
    </div>
  </div>
</section>

<script>
const artistData = ${JSON.stringify(users.map(u => ({
  id: u.id,
  name: u.artistName,
  username: u.username,
  genre: u.genre,
  location: u.location,
  verified: u.verified,
  rating: u.rating,
  reviewCount: u.reviewCount,
  startingPrice: u.startingPrice,
  liveSession: u.liveSession,
  availability: u.availability,
  accountType: u.accountType,
  monthlyListeners: u.monthlyListeners,
  tags: u.tags,
  bio: u.bio,
  profileImage: u.profileImage,
  coverImage: u.coverImage,
})))}; 

function filterArtists() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const genre = document.getElementById('genreFilter').value.toLowerCase();
  const type = document.getElementById('typeFilter').value;
  const price = document.getElementById('priceFilter').value;
  const verifiedOnly = document.getElementById('verifiedOnly').checked;
  const liveOnly = document.getElementById('liveOnly').checked;
  const sort = document.getElementById('sortFilter').value;
  
  let filtered = artistData.filter(a => {
    if(search && !a.name.toLowerCase().includes(search) && !a.location.toLowerCase().includes(search) && !a.tags.some(t=>t.toLowerCase().includes(search)) && !a.genre.some(g=>g.toLowerCase().includes(search))) return false;
    if(genre && !a.genre.some(g=>g.toLowerCase().includes(genre))) return false;
    if(type && a.accountType !== type) return false;
    if(verifiedOnly && !a.verified) return false;
    if(liveOnly && !a.liveSession) return false;
    if(price) {
      const [min,max] = price === '1000+' ? [1000, Infinity] : price.split('-').map(Number);
      if(a.startingPrice < min || a.startingPrice > (max||Infinity)) return false;
    }
    return true;
  });
  
  filtered.sort((a,b) => {
    if(sort === 'rating') return b.rating - a.rating;
    if(sort === 'price_asc') return a.startingPrice - b.startingPrice;
    if(sort === 'price_desc') return b.startingPrice - a.startingPrice;
    if(sort === 'listeners') return b.monthlyListeners - a.monthlyListeners;
    if(sort === 'reviews') return b.reviewCount - a.reviewCount;
    return 0;
  });
  
  document.getElementById('resultsCount').textContent = 'Showing ' + filtered.length + ' artist' + (filtered.length!==1?'s':'');
  
  const grid = document.getElementById('artistGrid');
  const noResults = document.getElementById('noResults');
  
  if(filtered.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }
  grid.style.display = 'grid';
  noResults.style.display = 'none';
  
  grid.innerHTML = filtered.map(a => renderCard(a)).join('');
}

function renderCard(a) {
  const stars = '★'.repeat(Math.round(a.rating));
  const availColor = a.availability === 'available' ? 'var(--green)' : a.availability === 'busy' ? 'var(--gold)' : 'var(--red)';
  const availLabel = a.availability === 'available' ? 'Available' : a.availability === 'busy' ? 'Busy' : 'Unavailable';
  return \`<a href="/artist/\${a.id}" style="display:block;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform=''">
    <div class="card" style="overflow:hidden;">
      <div style="height:90px;background:linear-gradient(135deg,rgba(124,58,237,0.3),rgba(30,30,40,0.8));position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background:url('\${a.coverImage}') center/cover;opacity:0.35;"></div>
        <div style="position:absolute;top:10px;right:10px;display:flex;gap:6px;">
          \${a.verified ? '<span class="badge badge-purple" style="font-size:10px;"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
          \${a.liveSession ? '<span class="badge badge-green" style="font-size:10px;"><i class="fas fa-video"></i> Live</span>' : ''}
        </div>
      </div>
      <div style="padding:0 18px 20px;">
        <div style="position:relative;margin-top:-32px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:flex-end;">
          <img src="\${a.profileImage}" class="avatar" style="width:64px;height:64px;border:3px solid var(--bg2);" alt="\${a.name}">
          <div style="display:flex;align-items:center;gap:6px;padding-bottom:4px;">
            <div style="width:8px;height:8px;border-radius:50%;background:\${availColor};"></div>
            <span style="font-size:12px;color:var(--text2);">\${availLabel}</span>
          </div>
        </div>
        <h3 style="font-size:16px;font-weight:700;margin-bottom:3px;">\${a.name}</h3>
        <div style="font-size:13px;color:var(--text2);margin-bottom:10px;">\${a.genre.slice(0,2).join(' · ')}</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px;display:flex;align-items:center;gap:6px;">
          <i class="fas fa-map-marker-alt" style="font-size:11px;"></i>\${a.location}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
          \${a.tags.slice(0,3).map(t=>\`<span class="tag" style="font-size:11px;">\${t}</span>\`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:12px;">
          <div>
            <div class="stars" style="font-size:12px;">\${stars}</div>
            <div style="font-size:12px;color:var(--text2);">\${a.rating} (\${a.reviewCount} reviews)</div>
          </div>
          <div class="text-right">
            <div style="font-size:11px;color:var(--text2);">Starting at</div>
            <div style="font-size:18px;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--accent3);">\$\${a.startingPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  </a>\`;
}
</script>
` + footer() + closeHTML();
}

function renderArtistCard(user: typeof users[0]): string {
  const availColor = user.availability === 'available' ? 'var(--green)' : user.availability === 'busy' ? 'var(--gold)' : 'var(--red)';
  const availLabel = user.availability === 'available' ? 'Available' : user.availability === 'busy' ? 'Busy' : 'Unavailable';
  return `
  <a href="/artist/${user.id}" style="display:block;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform=''">
    <div class="card" style="overflow:hidden;">
      <div style="height:90px;background:linear-gradient(135deg,rgba(124,58,237,0.3),rgba(30,30,40,0.8));position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background:url('${user.coverImage}') center/cover;opacity:0.35;"></div>
        <div style="position:absolute;top:10px;right:10px;display:flex;gap:6px;">
          ${user.verified ? '<span class="badge badge-purple" style="font-size:10px;"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
          ${user.liveSession ? '<span class="badge badge-green" style="font-size:10px;"><i class="fas fa-video"></i> Live</span>' : ''}
        </div>
      </div>
      <div style="padding:0 18px 20px;">
        <div style="position:relative;margin-top:-32px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:flex-end;">
          <img src="${user.profileImage}" class="avatar" style="width:64px;height:64px;border:3px solid var(--bg2);" alt="${user.artistName}">
          <div style="display:flex;align-items:center;gap:6px;padding-bottom:4px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${availColor};"></div>
            <span style="font-size:12px;color:var(--text2);">${availLabel}</span>
          </div>
        </div>
        <h3 style="font-size:16px;font-weight:700;margin-bottom:3px;">${user.artistName}</h3>
        <div style="font-size:13px;color:var(--text2);margin-bottom:10px;">${user.genre.slice(0,2).join(' · ')}</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px;display:flex;align-items:center;gap:6px;">
          <i class="fas fa-map-marker-alt" style="font-size:11px;"></i>${user.location}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
          ${user.tags.slice(0,3).map(t => `<span class="tag" style="font-size:11px;">${t}</span>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:12px;">
          <div>
            <div class="stars" style="font-size:12px;">★★★★★</div>
            <div style="font-size:12px;color:var(--text2);">${user.rating} (${user.reviewCount} reviews)</div>
          </div>
          <div class="text-right">
            <div style="font-size:11px;color:var(--text2);">Starting at</div>
            <div style="font-size:18px;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--accent3);">${formatPrice(user.startingPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  </a>`;
}
