import { head, nav, footer, closeHTML } from '../layout';
import { User, Listing, getListingsByUser, getReviewsByUser, formatPrice, formatListeners, users, reviews } from '../data';

export function artistProfilePage(user: User): string {
  const userListings = getListingsByUser(user.id);
  const userReviews = getReviewsByUser(user.id);
  const avgScore = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—';

  const socialIcons: Record<string, string> = {
    instagram: 'fab fa-instagram',
    spotify: 'fab fa-spotify',
    soundcloud: 'fab fa-soundcloud',
    youtube: 'fab fa-youtube',
    tiktok: 'fab fa-tiktok',
    twitter: 'fab fa-twitter',
    apple_music: 'fab fa-apple',
  };

  return head(user.artistName) + nav() + `

<!-- ─── PROFILE HEADER ─── -->
<div style="position:relative;height:240px;overflow:hidden;">
  <div style="position:absolute;inset:0;background:url('${user.coverImage}') center/cover;"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.85) 100%);"></div>
</div>

<div style="background:var(--bg2);border-bottom:1px solid var(--border);padding:0 24px 0;">
  <div class="container">
    <div style="display:flex;align-items:flex-end;gap:24px;margin-top:-60px;padding-bottom:24px;flex-wrap:wrap;">
      <div style="position:relative;flex-shrink:0;">
        <img src="${user.profileImage}" class="avatar" style="width:120px;height:120px;border:4px solid var(--bg2);" alt="${user.artistName}">
        ${user.verified ? `
        <div style="position:absolute;bottom:6px;right:6px;background:var(--accent);border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg2);">
          <i class="fas fa-check" style="font-size:11px;color:white;"></i>
        </div>` : ''}
      </div>
      <div style="flex:1;padding-top:60px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <h1 style="font-size:2rem;font-weight:900;">${user.artistName}</h1>
              ${user.verified ? '<span class="badge badge-purple"><i class="fas fa-check-circle"></i> Verified Artist</span>' : ''}
              <span class="badge ${user.accountType === 'producer' ? 'badge-blue' : 'badge-gold'}">${user.accountType === 'producer' ? '🎛️ Producer' : '🎤 Artist'}</span>
            </div>
            <div style="font-size:15px;color:var(--text2);margin-top:4px;">@${user.username}</div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="/booking/${user.id}" class="btn btn-primary btn-lg">
              <i class="fas fa-calendar-plus"></i> Book a Feature
            </a>
            <button class="btn btn-secondary btn-lg" onclick="alert('Message feature available after sign up')">
              <i class="fas fa-comment-dots"></i> Message
            </button>
            <button class="btn btn-secondary" onclick="alert('Saved!')">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Profile Stats Bar -->
    <div style="display:flex;gap:32px;padding:20px 0;border-top:1px solid var(--border);flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:8px;">
        <i class="fas fa-star" style="color:var(--gold);"></i>
        <span style="font-weight:700;">${user.rating}</span>
        <span style="color:var(--text2);font-size:14px;">(${user.reviewCount} reviews)</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <i class="fas fa-check-circle" style="color:var(--green);"></i>
        <span style="font-weight:700;">${user.completedProjects}</span>
        <span style="color:var(--text2);font-size:14px;">completed</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <i class="fas fa-map-marker-alt" style="color:var(--text2);"></i>
        <span style="color:var(--text2);font-size:14px;">${user.location}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <i class="fas fa-clock" style="color:var(--text2);"></i>
        <span style="color:var(--text2);font-size:14px;">Responds ${user.responseTime}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <i class="fas fa-headphones" style="color:var(--accent3);"></i>
        <span style="font-weight:700;color:var(--accent3);">${formatListeners(user.monthlyListeners)}</span>
        <span style="color:var(--text2);font-size:14px;">monthly listeners</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:10px;height:10px;border-radius:50%;background:${user.availability === 'available' ? 'var(--green)' : 'var(--gold)'};"></div>
        <span style="font-size:14px;text-transform:capitalize;">${user.availability}</span>
      </div>
    </div>
  </div>
</div>

<!-- ─── PROFILE BODY ─── -->
<section style="padding:32px 24px;">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 340px;gap:32px;align-items:start;">
      
      <!-- Left Column -->
      <div>
        <!-- About -->
        <div class="card p-6 mb-6">
          <h2 style="font-size:18px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-user" style="color:var(--accent3);font-size:14px;"></i> About ${user.artistName}
          </h2>
          <p style="font-size:15px;color:var(--text2);line-height:1.8;">${user.bio}</p>
          
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:20px;">
            ${user.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          
          ${user.socialLinks.length > 0 ? `
          <div style="display:flex;gap:12px;margin-top:20px;">
            ${user.socialLinks.map(s => `
            <a href="${s.url}" style="width:38px;height:38px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:16px;transition:all 0.2s;" onmouseover="this.style.color='white';this.style.borderColor='var(--border2)'" onmouseout="this.style.color='var(--text2)';this.style.borderColor='var(--border)'">
              <i class="${socialIcons[s.platform] ?? 'fas fa-link'}"></i>
            </a>`).join('')}
          </div>` : ''}
        </div>
        
        <!-- Services / Listings -->
        ${userListings.length > 0 ? `
        <div class="mb-6">
          <h2 style="font-size:20px;margin-bottom:20px;">Services & Packages</h2>
          ${userListings.map(listing => `
          <a href="/listing/${listing.id}" style="display:block;margin-bottom:16px;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
            <div class="card p-6" style="transition:border-color 0.2s;" onmouseover="this.style.borderColor='rgba(124,58,237,0.4)'" onmouseout="this.style.borderColor='var(--border)'">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:12px;">
                <div>
                  <h3 style="font-size:17px;font-weight:700;margin-bottom:6px;">${listing.title}</h3>
                  <span class="badge badge-purple">${listing.category}</span>
                </div>
                <div class="text-right">
                  <div style="font-size:11px;color:var(--text2);">Starting at</div>
                  <div style="font-size:24px;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--accent3);">${formatPrice(listing.packages[0].price)}</div>
                </div>
              </div>
              <p style="font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:16px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${listing.description}</p>
              <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--text2);">
                <span><i class="fas fa-clock" style="margin-right:6px;"></i>From ${listing.packages[0].deliveryDays} days</span>
                <span><i class="fas fa-redo" style="margin-right:6px;"></i>${listing.packages[0].revisions === 999 ? 'Unlimited' : listing.packages[0].revisions} revision${listing.packages[0].revisions !== 1 ? 's' : ''}</span>
                <span><i class="fas fa-file-audio" style="margin-right:6px;"></i>${listing.fileFormats.join(', ')}</span>
                <span class="stars" style="font-size:12px;margin-left:auto;">★★★★★ ${listing.rating} (${listing.orders} orders)</span>
              </div>
            </div>
          </a>`).join('')}
        </div>` : ''}
        
        <!-- Reviews -->
        <div>
          <h2 style="font-size:20px;margin-bottom:8px;">Reviews</h2>
          <div style="display:flex;gap:24px;margin-bottom:24px;flex-wrap:wrap;">
            <div style="text-align:center;">
              <div style="font-size:48px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--gold);">${user.rating}</div>
              <div class="stars" style="font-size:18px;margin:4px 0;">★★★★★</div>
              <div style="font-size:13px;color:var(--text2);">${user.reviewCount} reviews</div>
            </div>
            <div style="flex:1;min-width:200px;">
              ${[
                { label: 'Quality', val: 4.9 },
                { label: 'Communication', val: 4.8 },
                { label: 'Delivery Time', val: 4.7 },
                { label: 'Professionalism', val: 5.0 },
              ].map(cat => `
              <div style="margin-bottom:10px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                  <span style="font-size:13px;color:var(--text2);">${cat.label}</span>
                  <span style="font-size:13px;font-weight:600;">${cat.val}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${cat.val * 20}%;"></div>
                </div>
              </div>`).join('')}
            </div>
          </div>
          
          ${userReviews.length > 0 ? userReviews.map(rev => {
            const reviewer = users.find(u => u.id === rev.reviewerId);
            return `
            <div class="card p-6 mb-4">
              <div style="display:flex;gap:12px;margin-bottom:12px;">
                <img src="${reviewer?.profileImage}" class="avatar avatar-sm" style="width:44px;height:44px;flex-shrink:0;" alt="${reviewer?.artistName}">
                <div style="flex:1;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                    <div>
                      <div style="font-weight:700;font-size:14px;">${reviewer?.artistName ?? 'Artist'}</div>
                      <div style="font-size:12px;color:var(--text2);">${rev.createdAt}</div>
                    </div>
                    <div class="stars" style="font-size:14px;">${'★'.repeat(Math.round((rev.professionalism + rev.deliveryTime + rev.quality + rev.communication) / 4))}</div>
                  </div>
                </div>
              </div>
              <p style="font-size:14px;color:var(--text2);line-height:1.7;">"${rev.text}"</p>
              <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;">
                ${[
                  { l: 'Quality', v: rev.quality },
                  { l: 'Communication', v: rev.communication },
                  { l: 'Delivery', v: rev.deliveryTime },
                  { l: 'Professionalism', v: rev.professionalism },
                ].map(c => `<span style="font-size:12px;color:var(--text2);">${c.l}: <span style="color:var(--gold);">${'★'.repeat(c.v)}</span></span>`).join('')}
              </div>
            </div>`;
          }).join('') : `
          <div class="card p-8 text-center">
            <i class="fas fa-star" style="font-size:32px;color:var(--bg4);margin-bottom:12px;display:block;"></i>
            <p style="color:var(--text2);">No reviews yet — be the first to collaborate!</p>
          </div>`}
        </div>
      </div>
      
      <!-- Right Column / Sidebar -->
      <div>
        <!-- Quick Book CTA -->
        <div class="card p-6 mb-4" style="border-color:rgba(124,58,237,0.3);background:linear-gradient(135deg, rgba(124,58,237,0.1), rgba(30,30,40,0.9));">
          <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Starting at</div>
          <div style="font-size:36px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--accent3);margin-bottom:4px;">${formatPrice(user.startingPrice)}</div>
          <div style="font-size:13px;color:var(--text2);margin-bottom:20px;">per feature / collaboration</div>
          <a href="/booking/${user.id}" class="btn btn-primary w-full" style="justify-content:center;padding:14px;">
            <i class="fas fa-calendar-plus"></i> Book a Feature
          </a>
          <button class="btn btn-secondary w-full mt-2" style="justify-content:center;padding:14px;" onclick="alert('Sign up to message artists')">
            <i class="fas fa-comment-dots"></i> Message ${user.artistName}
          </button>
          <div style="text-align:center;margin-top:16px;font-size:13px;color:var(--text2);">
            <i class="fas fa-shield-alt" style="color:var(--green);margin-right:6px;"></i>
            Payment held securely until delivery
          </div>
        </div>
        
        <!-- Artist Details -->
        <div class="card p-6 mb-4">
          <h3 style="font-size:16px;margin-bottom:16px;">Artist Details</h3>
          ${[
            { icon: 'fas fa-map-marker-alt', label: 'Location', value: user.location },
            { icon: 'fas fa-clock', label: 'Response Time', value: user.responseTime },
            { icon: 'fas fa-headphones', label: 'Monthly Listeners', value: formatListeners(user.monthlyListeners) },
            { icon: 'fas fa-check-circle', label: 'Completed Projects', value: `${user.completedProjects}+` },
            { icon: 'fas fa-video', label: 'Live Sessions', value: user.liveSession ? 'Available' : 'Not Available' },
            { icon: 'fas fa-calendar', label: 'Member Since', value: user.joinedAt },
          ].map(d => `
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:14px;">
            <span style="color:var(--text2);display:flex;align-items:center;gap:8px;">
              <i class="${d.icon}" style="width:14px;text-align:center;"></i> ${d.label}
            </span>
            <span style="font-weight:600;">${d.value}</span>
          </div>`).join('')}
        </div>
        
        <!-- Featured Songs -->
        ${user.featuredSongs.length > 0 ? `
        <div class="card p-6">
          <h3 style="font-size:16px;margin-bottom:16px;">Featured Work</h3>
          ${user.featuredSongs.map(s => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg3);border-radius:10px;margin-bottom:8px;">
            <div style="width:36px;height:36px;background:linear-gradient(135deg,var(--accent),var(--accent3));border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-music" style="color:white;font-size:14px;"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.title}</div>
              <div style="font-size:12px;color:var(--text2);">by ${user.artistName}</div>
            </div>
            <button style="background:none;border:none;color:var(--text2);cursor:pointer;font-size:16px;padding:4px;" onclick="alert('Preview coming soon')">
              <i class="fas fa-play-circle"></i>
            </button>
          </div>`).join('')}
        </div>` : ''}
      </div>
    </div>
  </div>
</section>

` + footer() + closeHTML();
}
