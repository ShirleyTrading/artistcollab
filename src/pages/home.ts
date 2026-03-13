import { head, nav, footer, closeHTML } from '../layout';
import { users, listings, formatPrice, formatListeners } from '../data';

export function homePage(): string {
  const featuredArtists = users.filter(u => u.verified).slice(0, 4);
  const topListings = listings.slice(0, 3);

  return head('Remote Music Collaboration') + nav() + `

<!-- ─── HERO ─── -->
<section class="hero-gradient" style="padding: 100px 24px 120px; position:relative; overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 60% 50%, rgba(124,58,237,0.12) 0%, transparent 60%);pointer-events:none;"></div>
  <div style="position:absolute;top:20%;left:5%;width:300px;height:300px;background:radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%);pointer-events:none;border-radius:50%;filter:blur(40px);"></div>
  <div style="position:absolute;bottom:10%;right:5%;width:400px;height:400px;background:radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);pointer-events:none;border-radius:50%;filter:blur(60px);"></div>
  <div class="container text-center" style="position:relative;">
    <div class="badge badge-purple mb-6" style="font-size:13px;padding:6px 16px;">
      <i class="fas fa-microphone"></i> The Remote Studio for Artists
    </div>
    <h1 style="font-size:clamp(2.8rem, 6vw, 5rem); font-weight:900; line-height:1.1; max-width:840px; margin:0 auto 24px;" class="glow-text">
      Remote Music Collaboration,<br>Built for Real Artists
    </h1>
    <p style="font-size:clamp(1rem, 2vw, 1.25rem); color:var(--text2); max-width:600px; margin:0 auto 48px; line-height:1.7;">
      Artist Collab helps artists discover collaborators, book paid features, share stems, and manage projects in one secure platform — like you're all in the same studio.
    </p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/signup" class="btn btn-primary btn-xl" style="font-size:17px;">
        <i class="fas fa-rocket"></i> Join as an Artist
      </a>
      <a href="/explore" class="btn btn-outline btn-xl" style="font-size:17px;">
        <i class="fas fa-search"></i> Explore Artists
      </a>
    </div>
    <div style="margin-top:56px;display:flex;justify-content:center;gap:48px;flex-wrap:wrap;">
      <div class="text-center">
        <div style="font-size:28px;font-weight:800;font-family:'Space Grotesk',sans-serif;">12,000+</div>
        <div style="font-size:13px;color:var(--text2);margin-top:4px;">Artists & Producers</div>
      </div>
      <div style="width:1px;background:var(--border);height:50px;align-self:center;"></div>
      <div class="text-center">
        <div style="font-size:28px;font-weight:800;font-family:'Space Grotesk',sans-serif;">$2.8M+</div>
        <div style="font-size:13px;color:var(--text2);margin-top:4px;">Paid to Creators</div>
      </div>
      <div style="width:1px;background:var(--border);height:50px;align-self:center;"></div>
      <div class="text-center">
        <div style="font-size:28px;font-weight:800;font-family:'Space Grotesk',sans-serif;">8,400+</div>
        <div style="font-size:13px;color:var(--text2);margin-top:4px;">Collaborations Completed</div>
      </div>
      <div style="width:1px;background:var(--border);height:50px;align-self:center;"></div>
      <div class="text-center">
        <div style="font-size:28px;font-weight:800;font-family:'Space Grotesk',sans-serif;">4.9★</div>
        <div style="font-size:13px;color:var(--text2);margin-top:4px;">Average Platform Rating</div>
      </div>
    </div>
  </div>
</section>

<!-- ─── HOW IT WORKS ─── -->
<section class="section" style="background:var(--bg2);">
  <div class="container">
    <div class="text-center mb-8">
      <div class="badge badge-purple mb-4">How It Works</div>
      <h2 style="font-size:2.4rem;margin-bottom:16px;">Collaborate Like You're in the Same Room</h2>
      <p style="font-size:16px;color:var(--text2);max-width:520px;margin:0 auto;">Four simple steps from discovery to delivering your best work together.</p>
    </div>
    <div class="grid-4" style="position:relative;">
      <div style="position:absolute;top:36px;left:12.5%;right:12.5%;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent3));opacity:0.3;z-index:0;display:none;"></div>
      ${[
        { num: '01', icon: 'fas fa-search', title: 'Discover Artists', desc: 'Browse verified artists, producers, and songwriters by genre, location, price, and more.' },
        { num: '02', icon: 'fas fa-calendar-check', title: 'Book a Feature', desc: 'Select a service package, submit your project notes, and upload your reference track.' },
        { num: '03', icon: 'fas fa-layer-group', title: 'Collaborate in Your Workspace', desc: 'Your private project workspace is instantly created. Chat, share stems, and track progress.' },
        { num: '04', icon: 'fas fa-check-circle', title: 'Deliver & Get Paid', desc: 'Files are delivered securely. Payment releases automatically when you approve the work.' },
      ].map(step => `
      <div class="card" style="padding:32px 24px;text-align:center;transition:transform 0.2s,border-color 0.2s;" onmouseover="this.style.transform='translateY(-4px)';this.style.borderColor='rgba(124,58,237,0.4)'" onmouseout="this.style.transform='';this.style.borderColor='var(--border)'">
        <div style="width:56px;height:56px;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(157,91,245,0.1));border:1px solid rgba(124,58,237,0.3);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:22px;color:var(--accent3);">
          <i class="${step.icon}"></i>
        </div>
        <div style="font-size:11px;font-weight:700;color:var(--accent3);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px;">${step.num}</div>
        <h3 style="font-size:18px;margin-bottom:12px;">${step.title}</h3>
        <p style="font-size:14px;color:var(--text2);line-height:1.7;">${step.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ─── FEATURED ARTISTS ─── -->
<section class="section">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
      <div>
        <div class="badge badge-purple mb-3">Top Artists</div>
        <h2 style="font-size:2.2rem;">Featured Collaborators</h2>
      </div>
      <a href="/explore" class="btn btn-secondary">View All Artists <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="grid-4">
      ${featuredArtists.map(user => `
      <a href="/artist/${user.id}" style="display:block;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform=''">
        <div class="card" style="overflow:hidden;">
          <div style="height:100px;background:linear-gradient(135deg, rgba(124,58,237,0.3), rgba(30,30,40,0.8));position:relative;">
            <div style="position:absolute;inset:0;background:url('${user.coverImage}') center/cover;opacity:0.4;"></div>
          </div>
          <div style="padding:0 20px 24px;position:relative;">
            <div style="position:relative;margin-top:-36px;margin-bottom:12px;">
              <img src="${user.profileImage}" class="avatar" style="width:72px;height:72px;border:3px solid var(--bg2);" alt="${user.artistName}">
              ${user.verified ? '<div class="verified-badge" style="position:absolute;bottom:4px;left:52px;"><i class="fas fa-check" style="font-size:8px;"></i></div>' : ''}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
              <div>
                <h3 style="font-size:16px;font-weight:700;">${user.artistName}</h3>
                <div style="font-size:13px;color:var(--text2);">${user.genre.slice(0,2).join(' · ')}</div>
              </div>
              <div class="text-right">
                <div class="stars">★★★★★</div>
                <div style="font-size:12px;color:var(--text2);">${user.rating} (${user.reviewCount})</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;margin-top:10px;">
              <i class="fas fa-map-marker-alt" style="font-size:11px;color:var(--text2);"></i>
              <span style="font-size:12px;color:var(--text2);">${user.location}</span>
              <span style="margin-left:auto;font-size:13px;font-weight:700;color:var(--accent3);">From ${formatPrice(user.startingPrice)}</span>
            </div>
            <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap;">
              ${user.tags.slice(0,2).map(t => `<span class="tag" style="font-size:11px;">${t}</span>`).join('')}
              ${user.liveSession ? '<span class="badge badge-green" style="font-size:11px;"><i class="fas fa-video"></i> Live</span>' : ''}
            </div>
          </div>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<!-- ─── FEATURE HIGHLIGHTS ─── -->
<section class="section" style="background:var(--bg2);">
  <div class="container">
    <div class="text-center mb-8">
      <div class="badge badge-purple mb-4">Platform Features</div>
      <h2 style="font-size:2.4rem;margin-bottom:16px;">Everything You Need to Collab Remotely</h2>
      <p style="font-size:16px;color:var(--text2);max-width:520px;margin:0 auto;">Built by people who understand artists. Every feature exists to solve a real pain point in remote collaboration.</p>
    </div>
    <div class="grid-3" style="gap:20px;">
      ${[
        { icon: 'fas fa-search', color: 'rgba(124,58,237,0.2)', border: 'rgba(124,58,237,0.3)', iconColor: 'var(--accent3)', title: 'Artist Discovery', desc: 'Filter by genre, location, price, ratings, and more. Find the exact collaborator your record needs.' },
        { icon: 'fas fa-shopping-cart', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.25)', iconColor: '#6ee7b7', title: 'Feature Marketplace', desc: 'Browse service packages with clear pricing, delivery times, and included files. Book in minutes.' },
        { icon: 'fas fa-layer-group', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.25)', iconColor: '#93c5fd', title: 'Private Workspaces', desc: 'Every booking creates a secure project room with messaging, file storage, and progress tracking.' },
        { icon: 'fas fa-music', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.25)', iconColor: '#fcd34d', title: 'Stem Locker', desc: 'Drag-and-drop file uploads for WAV, MP3, AIFF, and stems. Organized by project with version history.' },
        { icon: 'fas fa-shield-alt', color: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.25)', iconColor: '#f87171', title: 'Secure Payments', desc: 'Platform-held payments protect both parties. Funds release only when work is approved and accepted.' },
        { icon: 'fas fa-star', color: 'rgba(192,132,252,0.15)', border: 'rgba(192,132,252,0.25)', iconColor: 'var(--accent3)', title: 'Reviews & Trust', desc: 'Verified profiles, ratings across 4 categories, and transparent work history build real trust.' },
      ].map(f => `
      <div class="card" style="padding:28px;transition:transform 0.2s,border-color 0.2s;" onmouseover="this.style.transform='translateY(-3px)';this.style.borderColor='rgba(124,58,237,0.3)'" onmouseout="this.style.transform='';this.style.borderColor='var(--border)'">
        <div style="width:50px;height:50px;background:${f.color};border:1px solid ${f.border};border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:20px;color:${f.iconColor};">
          <i class="${f.icon}"></i>
        </div>
        <h3 style="font-size:18px;margin-bottom:10px;">${f.title}</h3>
        <p style="font-size:14px;color:var(--text2);line-height:1.7;">${f.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ─── WHY ARTIST COLLAB ─── -->
<section class="section">
  <div class="container">
    <div class="grid-2" style="gap:64px;align-items:center;">
      <div>
        <div class="badge badge-purple mb-4">Why Artist Collab</div>
        <h2 style="font-size:2.4rem;margin-bottom:20px;line-height:1.2;">Stop Collaborating Through Messy DMs</h2>
        <p style="font-size:16px;color:var(--text2);margin-bottom:32px;line-height:1.8;">
          Artists deserve a real platform — not Instagram back-and-forths, PayPal disputes, and lost stems in your email. Artist Collab organizes the chaos.
        </p>
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${[
            { text: 'No more scattered conversations across 5 different apps', icon: 'fas fa-times-circle', color: 'var(--red)' },
            { text: 'No more insecure file sharing over Google Drive', icon: 'fas fa-times-circle', color: 'var(--red)' },
            { text: 'No more payment disputes with no protection', icon: 'fas fa-times-circle', color: 'var(--red)' },
            { text: 'No more confusion about who owns what', icon: 'fas fa-times-circle', color: 'var(--red)' },
          ].map(i => `
          <div style="display:flex;align-items:center;gap:12px;">
            <i class="${i.icon}" style="color:${i.color};font-size:16px;flex-shrink:0;"></i>
            <span style="font-size:15px;color:var(--text2);">${i.text}</span>
          </div>`).join('')}
        </div>
        <div style="margin-top:32px;display:flex;flex-direction:column;gap:16px;">
          ${[
            { text: 'One platform for discovery, booking, communication, files, and payment', icon: 'fas fa-check-circle', color: 'var(--green)' },
            { text: 'Private workspaces keep every project organized and secure', icon: 'fas fa-check-circle', color: 'var(--green)' },
            { text: 'Platform-held payments protect buyers and sellers', icon: 'fas fa-check-circle', color: 'var(--green)' },
            { text: 'Real artist profiles with verifiable work history and reviews', icon: 'fas fa-check-circle', color: 'var(--green)' },
          ].map(i => `
          <div style="display:flex;align-items:center;gap:12px;">
            <i class="${i.icon}" style="color:${i.color};font-size:16px;flex-shrink:0;"></i>
            <span style="font-size:15px;">${i.text}</span>
          </div>`).join('')}
        </div>
        <a href="/signup" class="btn btn-primary btn-lg mt-8">Start Collaborating Free <i class="fas fa-arrow-right"></i></a>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div class="card" style="padding:24px;border-color:rgba(124,58,237,0.25);">
          <i class="fas fa-comment-dots" style="font-size:28px;color:var(--accent3);margin-bottom:16px;display:block;"></i>
          <h4 style="font-size:16px;margin-bottom:8px;">In-Platform Messaging</h4>
          <p style="font-size:13px;color:var(--text2);">Direct and project-based chat built into every workspace.</p>
        </div>
        <div class="card" style="padding:24px;border-color:rgba(16,185,129,0.25);margin-top:24px;">
          <i class="fas fa-folder-open" style="font-size:28px;color:#6ee7b7;margin-bottom:16px;display:block;"></i>
          <h4 style="font-size:16px;margin-bottom:8px;">Secure Stem Locker</h4>
          <p style="font-size:13px;color:var(--text2);">Upload WAV, stems, and files privately per project.</p>
        </div>
        <div class="card" style="padding:24px;border-color:rgba(245,158,11,0.25);">
          <i class="fas fa-dollar-sign" style="font-size:28px;color:#fcd34d;margin-bottom:16px;display:block;"></i>
          <h4 style="font-size:16px;margin-bottom:8px;">Escrow Payments</h4>
          <p style="font-size:13px;color:var(--text2);">Funds held safely until delivery is approved by both sides.</p>
        </div>
        <div class="card" style="padding:24px;border-color:rgba(59,130,246,0.25);margin-top:24px;">
          <i class="fas fa-chart-line" style="font-size:28px;color:#93c5fd;margin-bottom:16px;display:block;"></i>
          <h4 style="font-size:16px;margin-bottom:8px;">Progress Tracking</h4>
          <p style="font-size:13px;color:var(--text2);">Clear status timeline from booking to completion.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ─── MARKETPLACE PREVIEW ─── -->
<section class="section" style="background:var(--bg2);">
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
      <div>
        <div class="badge badge-purple mb-3">Marketplace</div>
        <h2 style="font-size:2.2rem;">Top Feature Listings</h2>
      </div>
      <a href="/marketplace" class="btn btn-secondary">Browse All Services <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="grid-3">
      ${topListings.map(listing => {
        const artist = users.find(u => u.id === listing.userId);
        const basePrice = listing.packages[0].price;
        return `
        <a href="/listing/${listing.id}" style="display:block;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform=''">
          <div class="card" style="padding:24px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
              <img src="${artist?.profileImage}" class="avatar avatar-md" alt="${artist?.artistName}">
              <div>
                <div style="font-weight:700;font-size:15px;">${artist?.artistName}</div>
                <div style="font-size:13px;color:var(--text2);">${artist?.genre[0]}</div>
              </div>
              ${artist?.verified ? '<div class="verified-badge" style="margin-left:auto;"><i class="fas fa-check" style="font-size:9px;"></i></div>' : ''}
            </div>
            <h3 style="font-size:17px;margin-bottom:10px;line-height:1.4;">${listing.title}</h3>
            <p style="font-size:13px;color:var(--text2);margin-bottom:16px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${listing.description}</p>
            <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
              <span class="tag" style="font-size:11px;">${listing.category}</span>
              ${listing.fileFormats.slice(0,2).map(f => `<span class="tag" style="font-size:11px;">${f}</span>`).join('')}
            </div>
            <hr class="divider" style="margin:12px 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:12px;color:var(--text2);">Starting at</div>
                <div style="font-size:22px;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--accent3);">${formatPrice(basePrice)}</div>
              </div>
              <div class="text-right">
                <div class="stars" style="font-size:12px;">★★★★★</div>
                <div style="font-size:12px;color:var(--text2);">${listing.rating} · ${listing.orders} orders</div>
              </div>
            </div>
          </div>
        </a>`;
      }).join('')}
    </div>
  </div>
</section>

<!-- ─── TESTIMONIALS ─── -->
<section class="section">
  <div class="container">
    <div class="text-center mb-8">
      <div class="badge badge-purple mb-4">Artist Reviews</div>
      <h2 style="font-size:2.4rem;margin-bottom:16px;">What Artists Are Saying</h2>
    </div>
    <div class="grid-3">
      ${[
        { quote: "I booked 3 features through Artist Collab and every single one was smooth. The workspace keeps everything organized and the payment protection is exactly what we needed.", name: "Marcus T.", role: "Independent Rapper · Atlanta", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=face", stars: 5 },
        { quote: "As a producer, I was tired of artists ghosting me after I sent beats. Artist Collab's escrow system fixed that completely. I've made $12K in 4 months on this platform.", name: "DJ Wavez", role: "Producer · Los Angeles", avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=80&h=80&fit=crop&crop=face", stars: 5 },
        { quote: "The project workspace is everything. Having all my stems, messages, and files in one place instead of scattered across my email and DMs changed how I work remotely.", name: "Aria S.", role: "Singer/Songwriter · NYC", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face", stars: 5 },
      ].map(t => `
      <div class="card" style="padding:28px;">
        <div class="stars mb-3">★★★★★</div>
        <p style="font-size:15px;line-height:1.8;color:var(--text2);margin-bottom:24px;font-style:italic;">"${t.quote}"</p>
        <div style="display:flex;align-items:center;gap:12px;border-top:1px solid var(--border);padding-top:20px;">
          <img src="${t.avatar}" class="avatar avatar-sm" style="width:44px;height:44px;" alt="${t.name}">
          <div>
            <div style="font-weight:700;font-size:14px;">${t.name}</div>
            <div style="font-size:13px;color:var(--text2);">${t.role}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ─── CTA BANNER ─── -->
<section style="padding:80px 24px;background:linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(192,132,252,0.1) 50%, rgba(10,10,15,0.0) 100%);border-top:1px solid rgba(124,58,237,0.2);border-bottom:1px solid rgba(124,58,237,0.2);">
  <div class="container text-center">
    <h2 style="font-size:2.8rem;margin-bottom:20px;max-width:600px;margin-left:auto;margin-right:auto;">
      Ready to Build Your Next Record?
    </h2>
    <p style="font-size:18px;color:var(--text2);max-width:480px;margin:0 auto 40px;line-height:1.7;">
      Join thousands of independent artists already booking features, sharing stems, and getting paid on Artist Collab.
    </p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/signup" class="btn btn-primary btn-xl">
        <i class="fas fa-microphone"></i> Join as an Artist — It's Free
      </a>
      <a href="/explore" class="btn btn-outline btn-xl">
        <i class="fas fa-headphones"></i> Browse Artists
      </a>
    </div>
    <p style="font-size:13px;color:var(--text2);margin-top:20px;">No credit card required. Start discovering and booking in minutes.</p>
  </div>
</section>

` + footer() + closeHTML();
}
