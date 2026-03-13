import { shell, closeShell, publicNav, siteFooter } from '../layout';
import { users, listings, getUserById, getListingById, formatPrice } from '../data';

// ─── Booking Page ─────────────────────────────────────────────────────────────
export function bookingPage(artistId: string, listingId?: string): string {
  const artist = getUserById(artistId);
  if (!artist) return '<h1>Artist not found</h1>';
  const listing = listingId ? getListingById(listingId) : listings.find(l => l.userId === artistId);
  const pkgs = listing?.packages ?? [
    { name: 'Standard', price: artist.startingPrice, deliveryDays: 5, revisions: 2, features: ['Feature verse', 'Mixed vocal', 'WAV delivery'] },
    { name: 'Premium', price: artist.startingPrice * 2, deliveryDays: 3, revisions: 5, features: ['Feature verse', 'Hook option', 'Mixed & mastered', 'WAV + stems', 'Unlimited revisions'] },
  ];
  const basePrice = pkgs[0].price;
  const platformFee = Math.round(basePrice * 0.1);
  const total = basePrice + platformFee;

  return shell(`Book ${artist.artistName}`, `
    .book-page { padding: 48px 24px; }
    .book-grid { display: grid; grid-template-columns: 1fr 360px; gap: 28px; max-width: 1060px; margin: 0 auto; align-items: start; }
    .book-step { background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-xl); padding: 28px; margin-bottom: 16px; }
    .step-num { width: 32px; height: 32px; background: var(--uv-dim); border: 1.5px solid rgba(139,92,246,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.875rem; color: var(--uv-bright); flex-shrink: 0; }
    .pkg-card {
      border: 1.5px solid var(--hairline); border-radius: var(--r-lg); padding: 18px 20px;
      cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
    }
    .pkg-card:hover { border-color: rgba(139,92,246,0.4); background: rgba(139,92,246,0.03); }
    .pkg-card.selected { border-color: var(--uv); background: rgba(139,92,246,0.07); }
    .pkg-card.selected::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--uv), var(--uv-bright)); }
    .order-summary { background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-xl); padding: 24px; position: sticky; top: 80px; }
    .add-on-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .timeline-step { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; }
    .tl-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--uv); flex-shrink: 0; margin-top: 5px; box-shadow: 0 0 10px rgba(139,92,246,0.4); }
    @media (max-width: 900px) { .book-grid { grid-template-columns: 1fr; } .book-page { padding: 32px 16px; } }
  `) + publicNav() + `

<div class="book-page">
  <div style="max-width:1060px;margin:0 auto 32px;">
    <!-- Breadcrumb -->
    <div style="display:flex;align-items:center;gap:7px;font-size:0.8125rem;color:var(--t4);margin-bottom:28px;">
      <a href="/explore" style="color:var(--t4);transition:color 0.15s;" onmouseover="this.style.color='var(--t2)'" onmouseout="this.style.color='var(--t4)'">Explore</a>
      <i class="fas fa-chevron-right" style="font-size:9px;"></i>
      <a href="/artist/${artist.id}" style="color:var(--t4);transition:color 0.15s;" onmouseover="this.style.color='var(--t2)'" onmouseout="this.style.color='var(--t4)'">${artist.artistName}</a>
      <i class="fas fa-chevron-right" style="font-size:9px;"></i>
      <span style="color:var(--t2);">Book Feature</span>
    </div>

    <!-- Artist Header Card -->
    <div style="background:linear-gradient(135deg,rgba(139,92,246,0.12) 0%,rgba(5,5,7,0) 60%);border:1px solid rgba(139,92,246,0.2);border-radius:var(--r-xl);padding:24px 28px;margin-bottom:28px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
      <div style="position:relative;">
        <img src="${artist.profileImage}" class="av av-xl" style="border:3px solid rgba(139,92,246,0.4);" alt="${artist.artistName}">
        ${artist.verified ? `<div style="position:absolute;bottom:0;right:0;width:22px;height:22px;background:var(--uv);border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid var(--void);"><i class="fas fa-check" style="color:white;font-size:9px;"></i></div>` : ''}
      </div>
      <div style="flex:1;min-width:200px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap;">
          <h1 style="font-size:1.5rem;letter-spacing:-0.025em;">Book a Feature with ${artist.artistName}</h1>
          ${artist.verified ? `<span class="badge badge-uv" style="font-size:0.69rem;"><i class="fas fa-shield-check"></i> Verified</span>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
          <span style="color:var(--t3);font-size:0.875rem;">${artist.genre.slice(0,2).join(' · ')}</span>
          <div style="display:flex;align-items:center;gap:4px;">
            <i class="fas fa-star" style="color:var(--ember);font-size:12px;"></i>
            <span style="font-weight:700;font-size:0.875rem;">${artist.rating}</span>
            <span style="font-size:0.8125rem;color:var(--t3);">(${artist.reviewCount} reviews)</span>
          </div>
          <span style="font-size:0.875rem;color:var(--t3);"><i class="fas fa-map-marker-alt" style="margin-right:5px;color:var(--t4);"></i>${artist.location}</span>
        </div>
      </div>
      <div style="display:flex;gap:16px;text-align:center;">
        <div>
          <div style="font-size:1.125rem;font-weight:800;letter-spacing:-0.02em;color:var(--ok);">${artist.responseTime}</div>
          <div style="font-size:0.69rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--t4);margin-top:2px;">Response</div>
        </div>
        <div style="width:1px;background:var(--hairline);"></div>
        <div>
          <div style="font-size:1.125rem;font-weight:800;letter-spacing:-0.02em;">${artist.completedProjects}</div>
          <div style="font-size:0.69rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--t4);margin-top:2px;">Delivered</div>
        </div>
      </div>
    </div>
  </div>

  <div class="book-grid">
    <!-- Left: Booking Form -->
    <div>

      <!-- Step 1: Package -->
      <div class="book-step">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <div class="step-num">1</div>
          <div>
            <h2 style="font-size:1.125rem;letter-spacing:-0.01em;">Select Package</h2>
            <p style="font-size:0.8125rem;color:var(--t3);margin-top:2px;">Choose the scope that fits your record.</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${pkgs.map((pkg, i) => `
          <label style="cursor:pointer;" onclick="selectPkg(${i}, ${pkg.price}, '${pkg.name}', ${pkg.deliveryDays})">
            <input type="radio" name="package" value="${pkg.name}" ${i === 0 ? 'checked' : ''} style="display:none;">
            <div class="pkg-card ${i === 0 ? 'selected' : ''}" id="pkg-${i}">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:12px;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:${i===0?'var(--uv)':'var(--rim)'};transition:background 0.15s;" id="pkg-dot-${i}"></div>
                  <div>
                    <span style="font-weight:800;font-size:1rem;letter-spacing:-0.01em;">${pkg.name}</span>
                    ${i === 1 ? '<span class="badge badge-uv" style="margin-left:8px;font-size:0.69rem;">Most Popular</span>' : ''}
                  </div>
                </div>
                <div style="font-size:1.375rem;font-weight:800;letter-spacing:-0.03em;color:var(--uv-bright);">${formatPrice(pkg.price)}</div>
              </div>
              <div style="display:flex;gap:16px;font-size:0.8125rem;color:var(--t3);margin-bottom:12px;flex-wrap:wrap;">
                <span><i class="fas fa-clock" style="margin-right:5px;font-size:11px;"></i>${pkg.deliveryDays} day delivery</span>
                <span><i class="fas fa-rotate-left" style="margin-right:5px;font-size:11px;"></i>${pkg.revisions === 999 ? 'Unlimited' : pkg.revisions} revisions</span>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${pkg.features.map(f => `<span style="font-size:0.78rem;color:var(--t2);display:flex;align-items:center;gap:5px;"><i class="fas fa-check" style="color:var(--ok);font-size:10px;"></i>${f}</span>`).join('')}
              </div>
            </div>
          </label>`).join('')}
        </div>
      </div>

      <!-- Step 2: Project Notes -->
      <div class="book-step">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <div class="step-num">2</div>
          <div>
            <h2 style="font-size:1.125rem;letter-spacing:-0.01em;">Project Brief</h2>
            <p style="font-size:0.8125rem;color:var(--t3);margin-top:2px;">Give ${artist.artistName} the context they need to deliver.</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="field">
            <label class="field-label">What's the record about?</label>
            <textarea class="field-input" rows="4" placeholder="Describe the vibe, theme, BPM range, reference tracks, or any mood you're going for..."></textarea>
          </div>
          <div class="field">
            <label class="field-label">Genre & Style Direction</label>
            <input class="field-input" type="text" placeholder="e.g. Dark trap, melodic drill, afrobeats pop crossover...">
          </div>
          <div class="field">
            <label class="field-label">Reference Track / Inspiration</label>
            <input class="field-input" type="text" placeholder="Paste a SoundCloud, YouTube, or Spotify link...">
          </div>
          <div class="field">
            <label class="field-label">File Delivery Format</label>
            <select class="field-select">
              <option>WAV (24-bit / 44.1kHz)</option>
              <option>WAV + Stems</option>
              <option>MP3 320kbps</option>
              <option>FLAC Lossless</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Step 3: Add-ons -->
      ${listing?.addOns && listing.addOns.length > 0 ? `
      <div class="book-step">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <div class="step-num">3</div>
          <div>
            <h2 style="font-size:1.125rem;letter-spacing:-0.01em;">Add-ons & Extras</h2>
            <p style="font-size:0.8125rem;color:var(--t3);margin-top:2px;">Enhance your order with additional services.</p>
          </div>
        </div>
        ${listing.addOns.map(ao => `
        <div class="add-on-row">
          <div>
            <div style="font-weight:600;font-size:0.875rem;">${ao.title}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-weight:700;color:var(--uv-bright);">+${formatPrice(ao.price)}</span>
            <input type="checkbox" onchange="updateAddOn('${ao.title}', ${ao.price}, this.checked)" style="width:16px;height:16px;accent-color:var(--uv);cursor:pointer;">
          </div>
        </div>`).join('')}
      </div>` : ''}

      <!-- Step 4: Payment -->
      <div class="book-step">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <div class="step-num">${listing?.addOns?.length ? 4 : 3}</div>
          <div>
            <h2 style="font-size:1.125rem;letter-spacing:-0.01em;">Payment</h2>
            <p style="font-size:0.8125rem;color:var(--t3);margin-top:2px;">Secure escrow — released only when you approve the delivery.</p>
          </div>
        </div>
        <!-- Escrow info -->
        <div style="background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.2);border-radius:var(--r-md);padding:14px 16px;margin-bottom:20px;display:flex;gap:10px;">
          <i class="fas fa-shield-halved" style="color:var(--ok);margin-top:1px;flex-shrink:0;"></i>
          <p style="font-size:0.8125rem;color:var(--t2);line-height:1.6;">Your payment is held in secure escrow. <strong>You only release funds when you're 100% satisfied</strong> with the delivery. Artist Collab handles all disputes.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="field">
            <label class="field-label">Card Number</label>
            <div style="position:relative;">
              <input class="field-input" type="text" placeholder="4242 4242 4242 4242" style="padding-right:80px;">
              <div style="position:absolute;right:14px;top:50%;transform:translateY(-50%);display:flex;gap:6px;">
                <i class="fab fa-cc-visa" style="font-size:1.25rem;color:var(--t4);"></i>
                <i class="fab fa-cc-mastercard" style="font-size:1.25rem;color:var(--t4);"></i>
              </div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="field">
              <label class="field-label">Expiry</label>
              <input class="field-input" type="text" placeholder="MM / YY">
            </div>
            <div class="field">
              <label class="field-label">CVC</label>
              <input class="field-input" type="text" placeholder="•••">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Order Summary -->
    <div>
      <div class="order-summary">
        <h3 style="font-size:1rem;letter-spacing:-0.01em;margin-bottom:20px;">Order Summary</h3>

        <!-- Artist row -->
        <div style="display:flex;align-items:center;gap:10px;padding:14px 0;border-bottom:1px solid var(--hairline);margin-bottom:14px;">
          <img src="${artist.profileImage}" class="av av-sm" style="border:1.5px solid rgba(139,92,246,0.3);" alt="${artist.artistName}">
          <div>
            <div style="font-weight:700;font-size:0.875rem;">${artist.artistName}</div>
            <div style="font-size:0.75rem;color:var(--t3);">${artist.genre[0]}</div>
          </div>
          <div style="margin-left:auto;text-align:right;">
            <div style="font-size:0.69rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t4);">Responds</div>
            <div style="font-size:0.8125rem;font-weight:700;color:var(--ok);">${artist.responseTime}</div>
          </div>
        </div>

        <!-- Line items -->
        <div id="summary-items">
          <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:0.875rem;">
            <span style="color:var(--t3);" id="pkg-name">Standard Package</span>
            <span id="pkg-price">${formatPrice(basePrice)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:0.875rem;border-bottom:1px solid var(--hairline);margin-bottom:8px;">
            <span style="color:var(--t3);">Platform fee (10%)</span>
            <span id="fee-price">${formatPrice(platformFee)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:1.0625rem;font-weight:800;letter-spacing:-0.02em;">
            <span>Total</span>
            <span id="total-price" style="color:var(--uv-bright);">${formatPrice(total)}</span>
          </div>
        </div>

        <!-- Delivery timeline -->
        <div style="background:rgba(255,255,255,0.03);border-radius:var(--r);padding:14px;margin-bottom:20px;">
          <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--t4);margin-bottom:12px;">Delivery Timeline</div>
          ${[
            { step: 'Order Confirmed', time: 'Today', active: true },
            { step: 'Work Begins', time: 'Within 24hrs', active: false },
            { step: 'Delivery', time: `In ${pkgs[0].deliveryDays} days`, active: false },
            { step: 'Revisions', time: 'Up to ${pkgs[0].revisions}x', active: false },
          ].map(s => `
          <div class="timeline-step">
            <div class="tl-dot" style="background:${s.active ? 'var(--uv)' : 'var(--rim)'};box-shadow:${s.active ? '0 0 10px rgba(139,92,246,0.4)' : 'none'};"></div>
            <div>
              <div style="font-weight:600;font-size:0.8125rem;">${s.step}</div>
              <div style="font-size:0.75rem;color:var(--t4);">${s.time}</div>
            </div>
          </div>`).join('')}
        </div>

        <button class="btn btn-primary w-full btn-lg" style="justify-content:center;font-size:1rem;" onclick="window.location.href='/order-confirmation'">
          <i class="fas fa-lock"></i> Confirm & Pay <span id="btn-price">${formatPrice(total)}</span>
        </button>
        <div style="text-align:center;margin-top:12px;font-size:0.75rem;color:var(--t4);">
          <i class="fas fa-shield-halved" style="margin-right:5px;color:var(--ok);"></i>
          Protected by Artist Collab Escrow
        </div>
        <div style="text-align:center;margin-top:6px;font-size:0.75rem;color:var(--t4);">
          Cancel within 24hrs for a full refund · Dispute resolution included
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let currentBase = ${basePrice};
let addOnsTotal = 0;

function selectPkg(i, price, name, days) {
  document.querySelectorAll('.pkg-card').forEach((c,idx) => {
    c.classList.toggle('selected', idx === i);
    const dot = document.getElementById('pkg-dot-'+idx);
    if (dot) dot.style.background = idx === i ? 'var(--uv)' : 'var(--rim)';
  });
  currentBase = price;
  updateSummary();
}

function updateAddOn(title, price, checked) {
  addOnsTotal += checked ? price : -price;
  updateSummary();
}

function updateSummary() {
  const base = currentBase + addOnsTotal;
  const fee = Math.round(base * 0.1);
  const tot = base + fee;
  document.getElementById('pkg-price').innerText = '$' + base.toFixed(0);
  document.getElementById('fee-price').innerText = '$' + fee.toFixed(0);
  document.getElementById('total-price').innerText = '$' + tot.toFixed(0);
  document.getElementById('btn-price').innerText = '$' + tot.toFixed(0);
}
</script>
` + closeShell();
}

// ─── Order Confirmation Page ──────────────────────────────────────────────────
export function orderConfirmationPage(): string {
  const artist = users.find(u => u.verified)!;

  return shell('Order Confirmed', `
    .confirm-page { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 48px 24px; }
    .confirm-card { background: var(--surface); border: 1px solid rgba(139,92,246,0.25); border-radius: var(--r-xl); padding: 48px 40px; max-width: 560px; width: 100%; text-align: center; }
    @keyframes popIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
    .check-circle { animation: popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
  `) + publicNav() + `
<div class="confirm-page">
  <div class="confirm-card">
    <!-- Checkmark -->
    <div class="check-circle" style="width:80px;height:80px;background:linear-gradient(135deg,var(--ok),#34d399);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 28px;box-shadow:0 0 40px rgba(16,185,129,0.3);">
      <i class="fas fa-check" style="font-size:2rem;color:white;"></i>
    </div>

    <!-- Confetti bg (decorative) -->
    <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:var(--r-xl);">
      ${Array.from({length:12}).map((_,i) => `<div style="position:absolute;width:6px;height:6px;border-radius:50%;background:${['var(--uv)','var(--ember)','var(--arc)','var(--ok)'][i%4]};top:${Math.random()*100}%;left:${Math.random()*100}%;opacity:0.4;"></div>`).join('')}
    </div>

    <span class="badge badge-ok" style="margin-bottom:16px;font-size:0.78rem;">Order Confirmed</span>
    <h1 style="font-size:clamp(1.5rem,3vw,2rem);letter-spacing:-0.03em;margin-bottom:12px;">You're locked in with<br><span style="color:var(--uv-bright);">${artist.artistName}</span></h1>
    <p style="color:var(--t3);font-size:0.9375rem;margin-bottom:28px;line-height:1.7;">Your collaboration has been confirmed and payment is secured in escrow. ${artist.artistName} has been notified and will begin work shortly.</p>

    <!-- Details -->
    <div style="background:var(--raised);border:1px solid var(--hairline);border-radius:var(--r-lg);padding:18px 20px;margin-bottom:28px;text-align:left;">
      ${[
        ['Order ID', `#AC-${Math.random().toString(36).slice(2,8).toUpperCase()}`],
        ['Artist', artist.artistName],
        ['Expected Delivery', `${(new Date(Date.now() + 5*86400000)).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`],
        ['Payment', `${formatPrice(artist.startingPrice + Math.round(artist.startingPrice*0.1))} (Escrow)`],
        ['Revisions', '3 included'],
      ].map(([k, v]) => `
      <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.875rem;">
        <span style="color:var(--t3);">${k}</span>
        <span style="font-weight:700;">${v}</span>
      </div>`).join('')}
    </div>

    <!-- What's next -->
    <div style="background:rgba(139,92,246,0.07);border:1px solid rgba(139,92,246,0.15);border-radius:var(--r-lg);padding:16px 18px;margin-bottom:28px;text-align:left;">
      <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--uv-bright);margin-bottom:10px;">What Happens Next</div>
      ${[
        [`<i class="fas fa-bell" style="color:var(--uv-bright);width:16px;"></i>`, `${artist.artistName} reviews your brief and starts work`],
        [`<i class="fas fa-comment-dots" style="color:var(--uv-bright);width:16px;"></i>`, 'You can message each other in the Project Workspace'],
        [`<i class="fas fa-file-audio" style="color:var(--uv-bright);width:16px;"></i>`, 'Delivery arrives in your private file locker'],
        [`<i class="fas fa-check-circle" style="color:var(--ok);width:16px;"></i>`, 'Approve delivery → payment releases from escrow'],
      ].map(([ic, text]) => `
      <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:0.8125rem;color:var(--t2);">
        ${ic} <span>${text}</span>
      </div>`).join('')}
    </div>

    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
      <a href="/workspace/p1" class="btn btn-primary btn-lg" style="flex:1;justify-content:center;max-width:220px;">
        <i class="fas fa-layer-group"></i> Open Workspace
      </a>
      <a href="/dashboard" class="btn btn-secondary btn-lg" style="flex:1;justify-content:center;max-width:220px;">
        <i class="fas fa-grid-2"></i> Dashboard
      </a>
    </div>
  </div>
</div>
` + closeShell();
}
