import { shell, closeShell, publicNav, authedNav, appSidebar, siteFooter } from '../layout';
import { users, listings, getUserById, getListingById, formatPrice } from '../data';

// ─── Booking Page ─────────────────────────────────────────────────────────────
export function bookingPage(artistId: string, listingId?: string): string {
  const artist = getUserById(artistId);
  if (!artist) return shell('Not Found','') + publicNav() + '<div style="padding:80px 24px;text-align:center;"><h1>Artist not found</h1></div>' + closeShell();

  const listing = listingId ? getListingById(listingId) : listings.find(l => l.userId === artistId);
  const pkgs = listing?.packages ?? [
    { name: 'Standard', price: artist.startingPrice, deliveryDays: 5, revisions: 2, features: ['Feature verse', 'Mixed vocal', 'WAV delivery'] },
    { name: 'Premium',  price: artist.startingPrice * 2, deliveryDays: 3, revisions: 5, features: ['Feature verse', 'Hook option', 'Mixed & mastered', 'WAV + stems', 'Unlimited revisions'] },
  ];
  const basePrice = pkgs[0].price;
  const platformFee = Math.round(basePrice * 0.1);

  return shell(`Book ${artist.artistName}`, `
  .book-page { padding: 48px 24px; max-width: 1060px; margin: 0 auto; }
  .book-grid { display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }

  .book-step {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 28px;
    margin-bottom: 14px;
  }
  .step-num {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--signal-dim);
    border: 1px solid rgba(200,255,0,0.25);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--signal);
    flex-shrink: 0;
  }
  .pkg-card {
    border: 1px solid var(--c-rim);
    border-radius: var(--r-lg);
    padding: 18px 20px;
    cursor: pointer;
    transition: all var(--t-base);
    position: relative;
    overflow: hidden;
    background: var(--c-raised);
  }
  .pkg-card:hover { border-color: rgba(200,255,0,0.25); }
  .pkg-card.on { border-color: var(--signal); background: var(--signal-dim); }
  .pkg-card.on::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--signal);
  }
  .order-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 24px;
    position: sticky;
    top: 76px;
    border-top: 3px solid var(--signal);
  }
  .order-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--c-wire);
    font-size: 0.875rem;
  }
  .order-line:last-child { border-bottom: none; }
  @media (max-width: 900px) {
    .book-grid { grid-template-columns: 1fr; }
    .order-card { position: static; }
  }
`) + publicNav() + `

<div class="book-page">

  <!-- Header -->
  <div style="margin-bottom:32px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <div style="height:1px;width:20px;background:var(--signal);box-shadow:0 0 6px var(--signal-glow);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">Booking</span>
    </div>
    <h1 style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:8px;">Book ${artist.artistName}</h1>
    <div style="display:flex;align-items:center;gap:10px;">
      <img src="${artist.profileImage}" class="av av-sm" style="border:1.5px solid var(--c-rim);" alt="${artist.artistName}">
      <span class="body-sm">@${artist.username} · ★ ${artist.rating.toFixed(1)} · ${artist.completedProjects} completed</span>
    </div>
  </div>

  <div class="book-grid">
    <!-- Left: booking form -->
    <div>

      <!-- Step 1: Package selection -->
      <div class="book-step">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div class="step-num">01</div>
          <div>
            <div style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">Select a Package</div>
            <div class="body-sm">Choose what works for your budget and timeline.</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;" id="pkg-list">
          ${pkgs.map((p, i) => `
          <div class="pkg-card ${i===0?'on':''}" onclick="selectPkg(this, ${p.price}, ${platformFee}, '${p.name}')">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;">
              <div>
                <div style="font-size:0.9375rem;font-weight:700;margin-bottom:3px;">${p.name}</div>
                <div class="mono-sm" style="color:var(--t4);">${p.deliveryDays}-day delivery · ${p.revisions} revisions</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:var(--signal);">${formatPrice(p.price)}</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${p.features.map(f => `
              <div style="display:flex;align-items:center;gap:7px;font-size:0.8125rem;color:var(--t3);">
                <i class="fas fa-check" style="color:var(--signal);font-size:10px;flex-shrink:0;"></i>${f}
              </div>`).join('')}
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Step 2: Project brief -->
      <div class="book-step">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div class="step-num">02</div>
          <div>
            <div style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">Your Brief</div>
            <div class="body-sm">Tell ${artist.artistName} what you're looking for.</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="field">
            <label class="field-label">Project Title</label>
            <input class="field-input" placeholder="e.g. Hook feature for summer anthem">
          </div>
          <div class="field">
            <label class="field-label">Brief / Direction</label>
            <textarea class="field-input" rows="4" placeholder="Describe the vibe, energy, references, and what you need delivered…"></textarea>
          </div>
          <div class="field">
            <label class="field-label">Reference Track Link (optional)</label>
            <input class="field-input" placeholder="YouTube, SoundCloud, or Spotify link">
          </div>
          <div class="field">
            <label class="field-label">Preferred BPM / Key (optional)</label>
            <input class="field-input" placeholder="e.g. 140 BPM, F Minor">
          </div>
        </div>
      </div>

      <!-- Step 3: Add-ons -->
      ${listing?.addOns?.length ? `
      <div class="book-step">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div class="step-num">03</div>
          <div>
            <div style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">Add-ons</div>
            <div class="body-sm">Optional enhancements to your package.</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${listing.addOns.map(a => `
          <label style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r);cursor:pointer;transition:border-color 0.15s;" onmouseover="this.style.borderColor='rgba(200,255,0,0.2)'" onmouseout="this.style.borderColor='var(--c-wire)'">
            <div style="display:flex;align-items:center;gap:10px;">
              <input type="checkbox" style="accent-color:var(--signal);width:15px;height:15px;">
              <span style="font-size:0.875rem;font-weight:500;">${a.title}</span>
            </div>
            <span style="font-size:0.875rem;font-weight:700;color:var(--signal);">+${formatPrice(a.price)}</span>
          </label>`).join('')}
        </div>
      </div>` : ''}

    </div>

    <!-- Right: order summary sidebar -->
    <div>
      <div class="order-card">
        <!-- Artist card -->
        <div style="display:flex;align-items:center;gap:10px;padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid var(--c-wire);">
          <div style="position:relative;">
            <img src="${artist.profileImage}" class="av av-md" style="border:1.5px solid var(--c-rim);" alt="${artist.artistName}">
            ${artist.verified ? `<div style="position:absolute;bottom:0;right:0;width:14px;height:14px;background:var(--signal);border-radius:50%;border:2px solid var(--c-panel);display:flex;align-items:center;justify-content:center;"><i class="fas fa-check" style="font-size:6px;color:#000;"></i></div>` : ''}
          </div>
          <div>
            <div style="font-weight:700;font-size:0.9375rem;">${artist.artistName}</div>
            <div class="mono-sm" style="color:var(--t4);">★ ${artist.rating.toFixed(1)} · ${artist.completedProjects} orders</div>
          </div>
        </div>

        <!-- Order lines -->
        <div id="order-lines">
          <div class="order-line">
            <span style="color:var(--t3);" id="pkg-name-display">${pkgs[0].name} Package</span>
            <span style="font-weight:700;" id="pkg-price-display">${formatPrice(pkgs[0].price)}</span>
          </div>
          <div class="order-line">
            <span style="color:var(--t3);">Platform fee (10%)</span>
            <span id="fee-display">${formatPrice(platformFee)}</span>
          </div>
          <div class="order-line" style="border-bottom:none;">
            <span style="font-weight:700;">Total</span>
            <span style="font-size:1.125rem;font-weight:800;color:var(--signal);" id="total-display">${formatPrice(basePrice + platformFee)}</span>
          </div>
        </div>

        <!-- Escrow note -->
        <div style="padding:12px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.18);border-radius:var(--r);margin-bottom:16px;display:flex;gap:8px;">
          <i class="fas fa-shield-alt" style="color:var(--signal);font-size:0.875rem;flex-shrink:0;margin-top:1px;"></i>
          <div>
            <div style="font-size:0.75rem;font-weight:700;color:var(--signal);margin-bottom:2px;">Escrow Protected</div>
            <div style="font-size:0.75rem;color:var(--t3);line-height:1.5;">Your payment is held securely and only released when you approve the delivery.</div>
          </div>
        </div>

        <a href="/order-confirmation" class="btn btn-primary btn-lg btn-w" style="margin-bottom:10px;">
          <i class="fas fa-lock" style="font-size:12px;"></i>
          Confirm & Pay
        </a>
        <div style="text-align:center;font-size:0.75rem;color:var(--t4);">
          <i class="fas fa-credit-card" style="margin-right:4px;"></i>
          Secured by Stripe · Cancel anytime before acceptance
        </div>
      </div>
    </div>
  </div>
</div>

${siteFooter()}
<script>
function selectPkg(el, price, fee, name) {
  document.querySelectorAll('.pkg-card').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('pkg-name-display').textContent = name + ' Package';
  document.getElementById('pkg-price-display').textContent = '$' + price;
  document.getElementById('fee-display').textContent = '$' + Math.round(price * 0.1);
  document.getElementById('total-display').textContent = '$' + (price + Math.round(price * 0.1));
}
</script>
${closeShell()}`;
}

// ─── Order Confirmation ───────────────────────────────────────────────────────
export function orderConfirmationPage(): string {
  return shell('Order Confirmed', '') + publicNav() + `
<div style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:60px 24px;">
  <div style="max-width:560px;width:100%;text-align:center;">

    <!-- Success node -->
    <div style="width:80px;height:80px;background:rgba(45,202,114,0.1);border:2px solid rgba(45,202,114,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 28px;">
      <i class="fas fa-check" style="color:var(--s-ok);font-size:2rem;"></i>
    </div>

    <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px;">
      <div style="height:1px;width:24px;background:var(--s-ok);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--s-ok);">Order Confirmed</span>
      <div style="height:1px;width:24px;background:var(--s-ok);"></div>
    </div>

    <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:800;letter-spacing:-0.03em;margin-bottom:14px;">Session started.</h1>
    <p class="body-lg" style="margin-bottom:36px;">Your payment is secured in escrow. The artist has been notified and your workspace is live.</p>

    <!-- Steps cards -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:36px;text-align:left;">
      ${[
        { n:'01', icon:'fa-envelope', title:'Check your inbox', desc:'A confirmation and workspace link has been sent to your email.' },
        { n:'02', icon:'fa-layer-group', title:'Open the workspace', desc:'Track progress, send messages, and download deliveries from your project workspace.' },
        { n:'03', icon:'fa-check-circle', title:'Approve & release payment', desc:'Once you\'re happy with the delivery, approve it to release the escrow to the artist.' },
      ].map(s => `
      <div style="display:flex;gap:14px;padding:16px;background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);">
        <div style="width:32px;height:32px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:0.71rem;font-weight:700;color:var(--signal);flex-shrink:0;">${s.n}</div>
        <div>
          <div style="font-size:0.875rem;font-weight:700;margin-bottom:3px;">${s.title}</div>
          <div class="body-sm">${s.desc}</div>
        </div>
      </div>`).join('')}
    </div>

    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/workspace/p1" class="btn btn-primary btn-lg">
        <i class="fas fa-layer-group" style="font-size:13px;"></i>
        Open Workspace
      </a>
      <a href="/dashboard" class="btn btn-secondary btn-lg">Dashboard</a>
    </div>

  </div>
</div>
${siteFooter()}${closeShell()}`;
}
