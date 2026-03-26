import { shell, closeShell, publicNav, authedNav, siteFooter } from '../layout';
import { users, listings, getUserById, getListingById, formatPrice } from '../data';

export function bookingPage(artistId: string, listingId?: string): string {
  const artist = getUserById(artistId);
  if (!artist) {
    return shell('Not Found', '') + publicNav() +
      '<div style="padding:80px 24px;text-align:center;"><h1 style="color:var(--t1);">Artist not found</h1></div>' +
      siteFooter() + closeShell();
  }

  const listing = listingId ? getListingById(listingId) : listings.find(l => l.userId === artistId && l.active);
  const pkgs = listing?.packages ?? [
    { name: 'Standard', price: artist.startingPrice, deliveryDays: 5, revisions: 2, features: ['Feature verse', 'Mixed vocal', 'WAV delivery'] },
    { name: 'Premium',  price: Math.round(artist.startingPrice * 2), deliveryDays: 3, revisions: 5, features: ['Feature verse', 'Hook option', 'Mixed & mastered', 'WAV + stems'] },
  ];

  const steps = [
    { n: '01', label: 'Select Package' },
    { n: '02', label: 'Upload Track' },
    { n: '03', label: 'Project Notes' },
    { n: '04', label: 'Sign Agreement' },
    { n: '05', label: 'Escrow Payment' },
    { n: '06', label: 'Project Room' },
  ];

  return shell(`Book ${artist.artistName}`, `

  /* ══ BOOKING PAGE ═══════════════════════════════════════════════════════════ */

  .bk-page { max-width: 1060px; margin: 0 auto; padding: 32px 24px 80px; }

  /* ── Progress bar ── */
  .bk-progress {
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); padding: 20px 24px;
    margin-bottom: 28px;
  }
  .bk-steps {
    display: flex; align-items: flex-start; gap: 0; position: relative;
  }
  .bk-step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
  .bk-step-line {
    position: absolute; top: 14px; left: 50%; right: -50%;
    height: 2px; background: var(--c-rim); z-index: 0;
  }
  .bk-step:last-child .bk-step-line { display: none; }
  .bk-step.done .bk-step-line { background: var(--signal); }
  .bk-step-circle {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--c-raised); border: 2px solid var(--c-rim);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 0.625rem; font-weight: 700; color: var(--t3);
    position: relative; z-index: 1; margin-bottom: 8px;
    transition: all 0.2s;
  }
  .bk-step.done .bk-step-circle { background: var(--signal-dim); border-color: var(--signal); color: var(--signal); }
  .bk-step.active .bk-step-circle { background: var(--signal); border-color: var(--signal); color: var(--c-void); font-weight: 800; }
  .bk-step-label { font-size: 0.6875rem; color: var(--t3); line-height: 1.3; }
  .bk-step.active .bk-step-label { color: var(--t1); font-weight: 600; }
  .bk-step.done .bk-step-label { color: var(--t2); }

  /* ── Layout ── */
  .bk-layout {
    display: grid; grid-template-columns: 1fr 320px;
    gap: 24px; align-items: start;
  }

  /* ── Step panels ── */
  .bk-panel {
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); padding: 28px;
    display: none;
  }
  .bk-panel.active { display: block; }
  .bk-panel-title {
    font-family: var(--font-display); font-size: 1.125rem;
    font-weight: 700; color: var(--t1); margin-bottom: 6px;
  }
  .bk-panel-sub { font-size: 0.875rem; color: var(--t2); margin-bottom: 24px; }

  /* ── Package cards ── */
  .pkg-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .pkg-card {
    border: 2px solid var(--c-rim); border-radius: var(--r-lg);
    padding: 18px 16px; cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    position: relative; overflow: hidden;
    background: var(--c-raised);
  }
  .pkg-card:hover { border-color: rgba(200,255,0,0.3); }
  .pkg-card.selected {
    border-color: var(--signal);
    background: var(--signal-dim);
  }
  .pkg-card.selected::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--signal);
  }
  .pkg-name { font-size: 0.75rem; font-weight: 700; color: var(--t2); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .pkg-price { font-family: var(--font-display); font-size: 1.375rem; font-weight: 800; color: var(--t1); margin-bottom: 10px; }
  .pkg-features { display: flex; flex-direction: column; gap: 5px; }
  .pkg-feat { display: flex; align-items: center; gap: 7px; font-size: 0.8125rem; color: var(--t2); }
  .pkg-feat i { color: var(--s-ok); font-size: 10px; flex-shrink: 0; }
  .pkg-detail { display: flex; gap: 12px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--c-wire); }
  .pkg-d-item { font-size: 0.75rem; color: var(--t3); display: flex; align-items: center; gap: 4px; }
  .pkg-d-item i { font-size: 10px; }

  /* ── Upload zone ── */
  .upload-zone {
    border: 2px dashed var(--c-rim); border-radius: var(--r-lg);
    padding: 48px 24px; text-align: center; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    background: var(--c-raised);
  }
  .upload-zone:hover { border-color: var(--signal); background: var(--signal-dim); }
  .upload-zone i { font-size: 2rem; color: var(--t3); margin-bottom: 12px; display: block; }
  .upload-zone p { font-size: 0.875rem; color: var(--t2); margin-bottom: 4px; }
  .upload-zone span { font-size: 0.75rem; color: var(--t4); }

  /* ── Notes textarea ── */
  .bk-textarea {
    width: 100%; background: var(--c-raised); border: 1px solid var(--c-rim);
    border-radius: var(--r-lg); padding: 14px;
    color: var(--t1); font-size: 0.9375rem; font-family: var(--font-body);
    resize: vertical; min-height: 140px; outline: none;
    transition: border-color 0.15s;
  }
  .bk-textarea:focus { border-color: var(--signal); }
  .bk-textarea::placeholder { color: var(--t4); }
  .bk-field { margin-bottom: 16px; }
  .bk-label {
    display: block; font-size: 0.6875rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--t3);
    margin-bottom: 6px;
  }

  /* ── Agreement ── */
  .agr-box {
    background: var(--c-raised); border: 1px solid var(--c-rim);
    border-radius: var(--r-lg); padding: 20px;
    font-size: 0.8125rem; line-height: 1.7; color: var(--t2);
    max-height: 200px; overflow-y: auto; margin-bottom: 16px;
  }
  .agr-check {
    display: flex; align-items: center; gap: 10px;
    padding: 14px; background: var(--c-raised);
    border: 1px solid var(--c-rim); border-radius: var(--r-lg);
    cursor: pointer; margin-bottom: 10px;
    transition: border-color 0.15s;
  }
  .agr-check:hover { border-color: var(--signal); }
  .agr-check input[type="checkbox"] { accent-color: var(--signal); width: 16px; height: 16px; }
  .agr-check-text { font-size: 0.875rem; color: var(--t2); }

  /* ── Order summary sidebar ── */
  .order-card {
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); padding: 22px;
    position: sticky; top: 76px;
    border-top: 3px solid var(--signal);
  }
  .order-artist {
    display: flex; align-items: center; gap: 10px;
    padding-bottom: 14px; border-bottom: 1px solid var(--c-wire); margin-bottom: 14px;
  }
  .order-artist img {
    width: 44px; height: 44px; border-radius: 50%;
    object-fit: cover; border: 2px solid var(--c-rim);
  }
  .order-artist-name { font-size: 0.875rem; font-weight: 700; color: var(--t1); }
  .order-artist-type { font-size: 0.75rem; color: var(--t3); }
  .order-line {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; border-bottom: 1px solid var(--c-wire);
    font-size: 0.875rem;
  }
  .order-line:last-of-type { border-bottom: none; }
  .order-line-label { color: var(--t2); }
  .order-line-val { color: var(--t1); font-weight: 600; font-family: var(--font-mono); }
  .order-total {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 0 12px;
    border-top: 1px solid var(--c-rim); margin-top: 4px;
  }
  .order-total-label { font-size: 0.875rem; font-weight: 700; color: var(--t1); }
  .order-total-val {
    font-family: var(--font-display); font-size: 1.5rem;
    font-weight: 800; color: var(--signal);
  }
  .order-escrow {
    display: flex; align-items: center; gap: 7px;
    background: rgba(45,202,114,0.08); border: 1px solid rgba(45,202,114,0.18);
    border-radius: var(--r-md); padding: 10px 12px;
    font-size: 0.75rem; color: var(--s-ok); font-weight: 600; margin-bottom: 14px;
  }
  .bk-submit-btn {
    width: 100%; padding: 14px;
    background: var(--signal); color: var(--c-void);
    border: none; border-radius: var(--r-lg);
    font-size: 0.9375rem; font-weight: 800; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.15s;
    text-decoration: none;
    font-family: var(--font-body);
  }
  .bk-submit-btn:hover { opacity: 0.88; }

  /* ── Nav buttons ── */
  .bk-nav { display: flex; justify-content: space-between; gap: 10px; margin-top: 20px; }
  .bk-back { color: var(--t2); background: none; border: 1px solid var(--c-rim); border-radius: var(--r-lg); padding: 10px 20px; cursor: pointer; font-family: var(--font-body); font-size: 0.875rem; transition: border-color 0.15s; }
  .bk-back:hover { border-color: var(--t2); }
  .bk-next { background: var(--signal); color: var(--c-void); border: none; border-radius: var(--r-lg); padding: 10px 24px; font-size: 0.875rem; font-weight: 700; cursor: pointer; font-family: var(--font-body); transition: opacity 0.15s; display: flex; align-items: center; gap: 7px; }
  .bk-next:hover { opacity: 0.88; }

  @media (max-width: 900px) {
    .bk-layout { grid-template-columns: 1fr; }
    .order-card { position: static; }
    .bk-steps { gap: 4px; }
    .bk-step-label { display: none; }
    .bk-step.active .bk-step-label { display: block; }
  }
  @media (max-width: 600px) {
    .bk-page { padding: 16px 14px 60px; }
    .pkg-grid { grid-template-columns: 1fr; }
    .bk-progress { padding: 16px; }
  }

  `, authedNav() + `

  <div class="bk-page">

    <!-- Progress -->
    <div class="bk-progress">
      <div class="bk-steps" id="bk-steps">
        ${steps.map((s, i) => `
        <div class="bk-step${i === 0 ? ' active' : ''}" data-step="${i}">
          <div class="bk-step-line"></div>
          <div class="bk-step-circle">${s.n}</div>
          <div class="bk-step-label">${s.label}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="bk-layout">

      <!-- Left: step panels -->
      <div>

        <!-- Step 1: Select Package -->
        <div class="bk-panel active" data-panel="0">
          <div class="bk-panel-title">Choose a Package</div>
          <div class="bk-panel-sub">Select the service that fits your project. You can discuss details in the project room.</div>
          <div class="pkg-grid">
            ${pkgs.map((pkg, i) => `
            <div class="pkg-card${i === 0 ? ' selected' : ''}" data-pkg-idx="${i}" data-price="${pkg.price}"
                 onclick="selectPkg(${i}, ${pkg.price}, '${pkg.name}')">
              <div class="pkg-name">${pkg.name}</div>
              <div class="pkg-price">${formatPrice(pkg.price)}</div>
              <div class="pkg-features">
                ${(pkg.features || []).map(f => `<div class="pkg-feat"><i class="fas fa-check"></i>${f}</div>`).join('')}
              </div>
              <div class="pkg-detail">
                <span class="pkg-d-item"><i class="fas fa-clock"></i>${pkg.deliveryDays}d</span>
                <span class="pkg-d-item"><i class="fas fa-redo"></i>${pkg.revisions} rev</span>
              </div>
            </div>`).join('')}
          </div>
          <div class="bk-nav">
            <div></div>
            <button class="bk-next" onclick="goStep(1)">Next: Upload Track <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>

        <!-- Step 2: Upload Track -->
        <div class="bk-panel" data-panel="1">
          <div class="bk-panel-title">Upload Your Reference</div>
          <div class="bk-panel-sub">Share your beat, demo, or reference track. Accepted: MP3, WAV, ZIP (max 100 MB).</div>
          <div class="upload-zone" onclick="document.getElementById('file-input').click()">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Click to upload or drag & drop</p>
            <span>MP3, WAV, ZIP · Max 100 MB</span>
          </div>
          <input type="file" id="file-input" accept=".mp3,.wav,.zip" style="display:none;" onchange="handleFileSelect(this)">
          <div id="file-preview" style="display:none;margin-top:14px;background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-lg);padding:14px;display:none;align-items:center;gap:12px;">
            <i class="fas fa-file-audio" style="color:var(--signal);font-size:1.25rem;flex-shrink:0;"></i>
            <div style="flex:1;min-width:0;">
              <div id="file-name" style="font-size:0.875rem;font-weight:600;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></div>
              <div id="file-size" style="font-size:0.75rem;color:var(--t3);"></div>
            </div>
            <button onclick="clearFile()" style="background:none;border:none;color:var(--t3);cursor:pointer;"><i class="fas fa-times"></i></button>
          </div>
          <p style="font-size:0.75rem;color:var(--t3);margin-top:12px;"><i class="fas fa-lock" style="margin-right:4px;"></i>Your files are private and only visible to ${artist.artistName}.</p>
          <div class="bk-nav">
            <button class="bk-back" onclick="goStep(0)"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="bk-next" onclick="goStep(2)">Next: Project Notes <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>

        <!-- Step 3: Project Notes -->
        <div class="bk-panel" data-panel="2">
          <div class="bk-panel-title">Describe Your Project</div>
          <div class="bk-panel-sub">Help ${artist.artistName} understand your vision. Be as specific as you like.</div>
          <div class="bk-field">
            <label class="bk-label" for="project-title">Project Title</label>
            <input id="project-title" type="text" class="auth-input" placeholder="e.g. 'Midnight Bounce — Feature Verse'" style="margin-bottom:0;">
          </div>
          <div class="bk-field">
            <label class="bk-label" for="notes">Project Notes</label>
            <textarea id="notes" class="bk-textarea" placeholder="Genre, mood, references, what you want from this collaboration, any specific instructions…"></textarea>
          </div>
          <div class="bk-field">
            <label class="bk-label" for="deadline">Preferred Deadline (optional)</label>
            <input id="deadline" type="date" class="auth-input" style="margin-bottom:0;">
          </div>
          <div class="bk-nav">
            <button class="bk-back" onclick="goStep(1)"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="bk-next" onclick="goStep(3)">Next: Sign Agreement <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>

        <!-- Step 4: Sign Agreement -->
        <div class="bk-panel" data-panel="3">
          <div class="bk-panel-title">Review & Sign</div>
          <div class="bk-panel-sub">Read the terms before signing. This is a legally binding digital agreement.</div>

          <div class="agr-box">
            <strong>Collaboration Agreement — ArtistCollab</strong><br><br>
            This agreement governs the collaboration between the Buyer and ${artist.artistName} ("Seller") for the selected service package.<br><br>
            <strong>1. Delivery.</strong> The Seller agrees to deliver the work within the package's stated delivery window. A 5-day grace period applies before late fees ($25/day) are assessed.<br><br>
            <strong>2. Revisions.</strong> The Buyer is entitled to the number of revisions stated in the selected package. Additional revisions may be purchased separately.<br><br>
            <strong>3. Payment & Escrow.</strong> The full amount is held in escrow by ArtistCollab until the Buyer approves delivery. Funds are released to the Seller within 1–3 business days of approval.<br><br>
            <strong>4. Ownership.</strong> For Pay-for-Hire: Buyer receives full master rights upon payment. For Revenue Split: Rights are governed by the Split Sheet signed inside the Project Room.<br><br>
            <strong>5. Confidentiality.</strong> Both parties agree to keep project details, files, and correspondence confidential for 12 months following project completion.<br><br>
            <strong>6. Platform Terms.</strong> Both parties agree to ArtistCollab's Terms of Service and Community Guidelines.
          </div>

          <div class="agr-check" onclick="toggleCheck('check-terms')">
            <input type="checkbox" id="check-terms">
            <span class="agr-check-text">I have read and agree to the Collaboration Agreement above.</span>
          </div>
          <div class="agr-check" onclick="toggleCheck('check-nda')">
            <input type="checkbox" id="check-nda">
            <span class="agr-check-text">I agree to keep all shared files and project details confidential (NDA).</span>
          </div>
          <div class="agr-check" onclick="toggleCheck('check-payment')">
            <input type="checkbox" id="check-payment">
            <span class="agr-check-text">I understand my payment will be held in escrow and released only on my approval.</span>
          </div>

          <div class="bk-nav">
            <button class="bk-back" onclick="goStep(2)"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="bk-next" id="next-4" onclick="checkAgreement()">Next: Escrow Payment <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>

        <!-- Step 5: Escrow Payment -->
        <div class="bk-panel" data-panel="4">
          <div class="bk-panel-title">Secure Your Payment</div>
          <div class="bk-panel-sub">Your payment is held safely in escrow. ${artist.artistName} only gets paid when you approve the work.</div>

          <div style="background:rgba(45,202,114,0.07);border:1px solid rgba(45,202,114,0.2);border-radius:var(--r-lg);padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
            <i class="fas fa-shield-alt" style="color:var(--s-ok);font-size:1.5rem;flex-shrink:0;"></i>
            <div>
              <div style="font-size:0.9375rem;font-weight:700;color:var(--t1);">Your payment is protected</div>
              <div style="font-size:0.8125rem;color:var(--t2);margin-top:2px;">Funds are held securely. You control the release.</div>
            </div>
          </div>

          <div class="bk-field">
            <label class="bk-label">Card Number</label>
            <input type="text" class="auth-input" placeholder="4242 4242 4242 4242" maxlength="19" style="font-family:var(--font-mono);">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="bk-field">
              <label class="bk-label">Expiry</label>
              <input type="text" class="auth-input" placeholder="MM / YY" maxlength="7">
            </div>
            <div class="bk-field">
              <label class="bk-label">CVC</label>
              <input type="text" class="auth-input" placeholder="•••" maxlength="4">
            </div>
          </div>
          <div class="bk-field">
            <label class="bk-label">Name on Card</label>
            <input type="text" class="auth-input" placeholder="Full name">
          </div>

          <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
            <i class="fas fa-lock" style="color:var(--t3);font-size:11px;"></i>
            <span style="font-size:0.75rem;color:var(--t3);">256-bit SSL encrypted · Powered by Stripe</span>
          </div>

          <div class="bk-nav">
            <button class="bk-back" onclick="goStep(3)"><i class="fas fa-arrow-left"></i> Back</button>
            <a href="/order-confirmation" class="bk-next">
              <i class="fas fa-lock"></i> Pay <span id="pay-amount">${formatPrice(pkgs[0].price + Math.round(pkgs[0].price * 0.1))}</span> & Book
            </a>
          </div>
        </div>

        <!-- Step 6: Done (redirect) -->
        <div class="bk-panel" data-panel="5">
          <div style="text-align:center;padding:48px 24px;">
            <div style="font-size:3rem;margin-bottom:16px;">🎉</div>
            <div class="bk-panel-title">You're all set!</div>
            <p style="color:var(--t2);margin-bottom:24px;">Your project room is being created. You'll be redirected shortly.</p>
            <a href="/order-confirmation" class="btn btn-primary">Open Project Room</a>
          </div>
        </div>

      </div><!-- /left -->

      <!-- Right: order summary -->
      <div>
        <div class="order-card">
          <div class="order-artist">
            <img src="${artist.profileImage}" alt="${artist.artistName}">
            <div>
              <div class="order-artist-name">${artist.artistName}</div>
              <div class="order-artist-type">${(artist.genre || ['Artist'])[0]}</div>
            </div>
          </div>

          <div id="order-summary">
            <div class="order-line">
              <span class="order-line-label">Package</span>
              <span class="order-line-val" id="order-pkg">${pkgs[0].name}</span>
            </div>
            <div class="order-line">
              <span class="order-line-label">Price</span>
              <span class="order-line-val" id="order-price">${formatPrice(pkgs[0].price)}</span>
            </div>
            <div class="order-line">
              <span class="order-line-label">Platform fee (10%)</span>
              <span class="order-line-val" id="order-fee">${formatPrice(Math.round(pkgs[0].price * 0.1))}</span>
            </div>
            <div class="order-line">
              <span class="order-line-label">Delivery</span>
              <span class="order-line-val">${pkgs[0].deliveryDays} days</span>
            </div>
            <div class="order-line">
              <span class="order-line-label">Revisions</span>
              <span class="order-line-val">${pkgs[0].revisions}</span>
            </div>
          </div>

          <div class="order-total">
            <span class="order-total-label">Total</span>
            <span class="order-total-val" id="order-total">${formatPrice(pkgs[0].price + Math.round(pkgs[0].price * 0.1))}</span>
          </div>

          <div class="order-escrow">
            <i class="fas fa-shield-alt"></i>
            <span>Held in escrow until you approve</span>
          </div>

          <div style="font-size:0.75rem;color:var(--t3);text-align:center;line-height:1.5;">
            <i class="fas fa-undo" style="margin-right:4px;"></i>
            Full refund if not delivered on time
          </div>
        </div>
      </div>

    </div><!-- /layout -->
  </div><!-- /bk-page -->

  ${siteFooter()}

  <script>
  var pkgData = ${JSON.stringify(pkgs)};
  var currentStep = 0;

  function goStep(n) {
    currentStep = n;
    document.querySelectorAll('.bk-panel').forEach((p, i) => p.classList.toggle('active', i === n));
    document.querySelectorAll('.bk-step').forEach((s, i) => {
      s.classList.toggle('active', i === n);
      s.classList.toggle('done', i < n);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectPkg(idx, price, name) {
    document.querySelectorAll('.pkg-card').forEach((c, i) => c.classList.toggle('selected', i === idx));
    const fee = Math.round(price * 0.1);
    const total = price + fee;
    document.getElementById('order-pkg').textContent  = name;
    document.getElementById('order-price').textContent = '$' + price.toLocaleString();
    document.getElementById('order-fee').textContent   = '$' + fee.toLocaleString();
    document.getElementById('order-total').textContent = '$' + total.toLocaleString();
    document.getElementById('pay-amount').textContent  = '$' + total.toLocaleString();
  }

  function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    const preview = document.getElementById('file-preview');
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-size').textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    preview.style.display = 'flex';
  }
  function clearFile() {
    document.getElementById('file-input').value = '';
    document.getElementById('file-preview').style.display = 'none';
  }

  function toggleCheck(id) {
    const cb = document.getElementById(id);
    cb.checked = !cb.checked;
  }

  function checkAgreement() {
    const allChecked = ['check-terms','check-nda','check-payment'].every(id => document.getElementById(id)?.checked);
    if (!allChecked) {
      alert('Please agree to all terms before continuing.');
      return;
    }
    goStep(4);
  }
  </script>
  ${closeShell()}`);
}

export function orderConfirmationPage(): string {
  return shell('Order Confirmed — ArtistCollab', `
  .conf-page {
    min-height: 80vh; display: flex; align-items: center; justify-content: center;
    padding: 60px 24px;
  }
  .conf-card {
    max-width: 540px; width: 100%;
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-2xl); padding: 48px 36px; text-align: center;
    border-top: 3px solid var(--s-ok);
  }
  .conf-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--s-ok-d); border: 2px solid rgba(45,202,114,0.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px; font-size: 2rem;
  }
  .conf-title {
    font-family: var(--font-display); font-size: 1.75rem; font-weight: 800;
    color: var(--t1); margin-bottom: 10px;
  }
  .conf-sub { font-size: 0.9375rem; color: var(--t2); line-height: 1.6; margin-bottom: 32px; }
  .conf-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; text-align: left; }
  .conf-step {
    display: flex; align-items: center; gap: 12px;
    background: var(--c-raised); border: 1px solid var(--c-wire);
    border-radius: var(--r-lg); padding: 14px 16px;
  }
  .conf-step-num {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--signal-dim); border: 1px solid rgba(200,255,0,0.25);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 0.6875rem; font-weight: 700; color: var(--signal);
    flex-shrink: 0;
  }
  .conf-step-text { font-size: 0.875rem; color: var(--t2); }
  .conf-step-text strong { color: var(--t1); }
  .conf-escrow {
    display: flex; align-items: center; gap: 8px;
    background: rgba(45,202,114,0.08); border: 1px solid rgba(45,202,114,0.2);
    border-radius: var(--r-md); padding: 10px 14px;
    font-size: 0.8125rem; color: var(--s-ok); font-weight: 600; margin-bottom: 24px;
  }
  `, authedNav() + `
  <div class="conf-page">
    <div class="conf-card">
      <div class="conf-icon">✓</div>
      <div class="conf-title">Booking Confirmed!</div>
      <p class="conf-sub">Your project is live and your payment is safely held in escrow. Here's what happens next:</p>
      <div class="conf-steps">
        <div class="conf-step">
          <div class="conf-step-num">1</div>
          <div class="conf-step-text"><strong>Check your inbox</strong> — confirmation email sent with all details.</div>
        </div>
        <div class="conf-step">
          <div class="conf-step-num">2</div>
          <div class="conf-step-text"><strong>Open your Project Room</strong> — chat, share files, and collaborate.</div>
        </div>
        <div class="conf-step">
          <div class="conf-step-num">3</div>
          <div class="conf-step-text"><strong>Approve the delivery</strong> — your payment releases to the artist automatically.</div>
        </div>
      </div>
      <div class="conf-escrow">
        <i class="fas fa-shield-alt"></i>
        <span>Your payment is held in escrow and protected</span>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="/workspace/p1" class="btn btn-primary">
          <i class="fas fa-door-open"></i> Open Project Room
        </a>
        <a href="/dashboard" class="btn btn-secondary">
          <i class="fas fa-home"></i> Dashboard
        </a>
      </div>
    </div>
  </div>
  ${siteFooter()}
  ${closeShell()}`);
}
