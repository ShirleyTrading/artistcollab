import { head, nav, footer, closeHTML } from '../layout';
import { users, listings, getUserById, getListingById, formatPrice } from '../data';

export function bookingPage(artistId: string, listingId?: string): string {
  const artist = getUserById(artistId);
  if (!artist) return '<h1>Artist not found</h1>';
  const listing = listingId ? getListingById(listingId) : listings.find(l => l.userId === artistId);
  const basePrice = listing?.packages[0].price ?? artist.startingPrice;
  const platformFee = Math.round(basePrice * 0.1);
  const total = basePrice + platformFee;

  return head(`Book ${artist.artistName}`) + nav() + `
<section style="padding:40px 24px;">
  <div class="container-sm">
    <!-- Breadcrumb -->
    <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);margin-bottom:32px;">
      <a href="/explore" style="color:var(--text2);">Explore</a>
      <i class="fas fa-chevron-right" style="font-size:10px;"></i>
      <a href="/artist/${artist.id}" style="color:var(--text2);">${artist.artistName}</a>
      <i class="fas fa-chevron-right" style="font-size:10px;"></i>
      <span>Book Feature</span>
    </div>
    
    <!-- Header -->
    <div class="card p-6 mb-6" style="border-color:rgba(124,58,237,0.25);">
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <img src="${artist.profileImage}" class="avatar" style="width:64px;height:64px;" alt="${artist.artistName}">
        <div>
          <h1 style="font-size:1.6rem;margin-bottom:4px;">Book a Feature with ${artist.artistName}</h1>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span style="color:var(--text2);font-size:14px;">${artist.genre.slice(0,2).join(' · ')}</span>
            ${artist.verified ? '<span class="badge badge-purple" style="font-size:11px;"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
            <span class="stars" style="font-size:13px;">★★★★★ ${artist.rating} (${artist.reviewCount})</span>
          </div>
        </div>
        <div style="margin-left:auto;text-align:right;">
          <div style="font-size:12px;color:var(--text2);">Responds</div>
          <div style="font-weight:700;color:var(--green);">${artist.responseTime}</div>
        </div>
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start;">
      <!-- Booking Form -->
      <div>
        <!-- Step 1: Package -->
        <div class="card p-6 mb-4">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <div style="width:28px;height:28px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;flex-shrink:0;">1</div>
            <h2 style="font-size:18px;">Select Package</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${(listing?.packages ?? [{ name: 'Standard', price: artist.startingPrice, deliveryDays: 5, revisions: 2, features: ['Feature verse', 'Mixed vocal', 'WAV delivery'] }]).map((pkg, i) => `
            <label style="cursor:pointer;">
              <input type="radio" name="package" value="${pkg.name}" ${i === 0 ? 'checked' : ''} style="display:none;" onchange="updateOrder('${pkg.price}', '${pkg.name}', '${pkg.deliveryDays}')">
              <div class="pkg-option card" style="padding:16px;cursor:pointer;border-color:${i === 0 ? 'rgba(124,58,237,0.5)' : 'var(--border)'};background:${i === 0 ? 'rgba(124,58,237,0.08)' : ''};" id="pkg-opt-${i}" onclick="selectPkg(${i}, ${pkg.price}, '${pkg.name}', ${pkg.deliveryDays})">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                  <div>
                    <span style="font-weight:700;font-size:16px;">${pkg.name}</span>
                    ${i === 1 ? ' <span class="badge badge-purple" style="font-size:10px;margin-left:6px;">Most Popular</span>' : ''}
                  </div>
                  <span style="font-size:20px;font-weight:800;font-family:\'Space Grotesk\',sans-serif;color:var(--accent3);">${formatPrice(pkg.price)}</span>
                </div>
                <div style="font-size:13px;color:var(--text2);margin-bottom:8px;"><i class="fas fa-clock" style="margin-right:5px;"></i>${pkg.deliveryDays} day delivery · ${pkg.revisions === 999 ? 'Unlimited' : pkg.revisions} revision${pkg.revisions !== 1 ? 's' : ''}</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  ${pkg.features.map(f => `<span style="font-size:12px;color:var(--text2);"><i class="fas fa-check" style="color:var(--green);margin-right:4px;"></i>${f}</span>`).join('')}
                </div>
              </div>
            </label>`).join('')}
          </div>
        </div>
        
        <!-- Step 2: Project Notes -->
        <div class="card p-6 mb-4">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <div style="width:28px;height:28px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;flex-shrink:0;">2</div>
            <h2 style="font-size:18px;">Project Notes & Instructions</h2>
          </div>
          <div class="form-group mb-4">
            <label class="form-label">Tell ${artist.artistName} about your record</label>
            <textarea class="form-input" placeholder="Describe your vision — genre, vibe, reference artists, specific delivery requirements, key, BPM, etc." rows="5" id="project-notes"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Upload Reference Track (Optional)</label>
            <div style="border:2px dashed var(--border);border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:all 0.2s;" id="ref-drop" onclick="document.getElementById('ref-file').click()" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
              <i class="fas fa-music" style="font-size:28px;color:var(--text2);margin-bottom:8px;display:block;"></i>
              <div style="font-size:14px;color:var(--text2);">Upload MP3, WAV, or link your SoundCloud</div>
              <div style="font-size:12px;color:var(--text2);margin-top:4px;">Max 50MB</div>
              <input type="file" id="ref-file" style="display:none;" accept=".mp3,.wav,.aiff" onchange="showRefFile(event)">
            </div>
            <div id="ref-file-display" style="display:none;margin-top:10px;padding:12px;background:var(--bg3);border-radius:8px;display:none;align-items:center;gap:10px;">
              <i class="fas fa-file-audio" style="color:var(--accent3);"></i>
              <span id="ref-file-name" style="font-size:14px;flex:1;"></span>
              <button onclick="document.getElementById('ref-file-display').style.display='none'" style="background:none;border:none;color:var(--text2);cursor:pointer;"><i class="fas fa-times"></i></button>
            </div>
          </div>
        </div>
        
        <!-- Step 3: Payment -->
        <div class="card p-6 mb-6">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <div style="width:28px;height:28px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;flex-shrink:0;">3</div>
            <h2 style="font-size:18px;">Payment</h2>
          </div>
          <div class="alert alert-info mb-4">
            <i class="fas fa-shield-alt"></i>
            <span>Your payment is held securely until you approve the delivery. You're protected by Artist Collab's payment guarantee.</span>
          </div>
          <div class="form-group mb-4">
            <label class="form-label">Card Number</label>
            <div style="position:relative;">
              <input class="form-input" placeholder="4242 4242 4242 4242" maxlength="19" oninput="this.value=this.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim()">
              <div style="position:absolute;right:14px;top:50%;transform:translateY(-50%);display:flex;gap:4px;">
                <i class="fab fa-cc-visa" style="font-size:18px;color:var(--text2);"></i>
                <i class="fab fa-cc-mastercard" style="font-size:18px;color:var(--text2);"></i>
              </div>
            </div>
          </div>
          <div class="grid-2 mb-4">
            <div class="form-group">
              <label class="form-label">Expiry</label>
              <input class="form-input" placeholder="MM / YY" maxlength="7">
            </div>
            <div class="form-group">
              <label class="form-label">CVC</label>
              <input class="form-input" placeholder="•••" maxlength="4" type="password">
            </div>
          </div>
          <div style="font-size:12px;color:var(--text2);display:flex;align-items:center;gap:6px;">
            <i class="fas fa-lock" style="color:var(--green);"></i>
            Powered by Stripe. 256-bit SSL encryption. We never store your card details.
          </div>
        </div>
        
        <button class="btn btn-primary w-full btn-xl" style="justify-content:center;" onclick="submitBooking()">
          <i class="fas fa-lock"></i> Confirm & Pay — <span id="total-display">${formatPrice(basePrice)}</span>
        </button>
        <p style="font-size:13px;color:var(--text2);text-align:center;margin-top:12px;">
          By booking, you agree to our <a href="/terms" style="color:var(--accent3);">Terms</a> and the Artist Collab collaboration guidelines.
        </p>
      </div>
      
      <!-- Order Summary -->
      <div style="position:sticky;top:100px;">
        <div class="card p-6">
          <h3 style="font-size:16px;margin-bottom:20px;">Order Summary</h3>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border);">
            <img src="${artist.profileImage}" class="avatar" style="width:52px;height:52px;" alt="${artist.artistName}">
            <div>
              <div style="font-weight:700;">${artist.artistName}</div>
              <div id="pkg-name-display" style="font-size:13px;color:var(--text2);">${listing?.title ?? 'Feature Package'}</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;font-size:14px;">
              <span style="color:var(--text2);" id="pkg-label">Package price</span>
              <span id="pkg-price">${formatPrice(basePrice)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:14px;">
              <span style="color:var(--text2);">Platform fee (10%)</span>
              <span id="fee-display">${formatPrice(platformFee)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:14px;">
              <span style="color:var(--text2);">Delivery</span>
              <span id="delivery-display">${listing?.packages[0].deliveryDays ?? 5} days</span>
            </div>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:700;font-size:16px;">Total</span>
            <span style="font-size:22px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--accent3);" id="summary-total">${formatPrice(total)}</span>
          </div>
        </div>
        <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);">
            <i class="fas fa-shield-alt" style="color:var(--green);width:16px;text-align:center;"></i> Secure escrow payment protection
          </div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);">
            <i class="fas fa-redo" style="color:var(--blue);width:16px;text-align:center;"></i> Revision protection included
          </div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);">
            <i class="fas fa-headset" style="color:var(--accent3);width:16px;text-align:center;"></i> Platform support if issues arise
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
function selectPkg(i, price, name, days) {
  document.querySelectorAll('.pkg-option').forEach((el, idx) => {
    el.style.borderColor = 'var(--border)';
    el.style.background = '';
  });
  document.getElementById('pkg-opt-' + i).style.borderColor = 'rgba(124,58,237,0.5)';
  document.getElementById('pkg-opt-' + i).style.background = 'rgba(124,58,237,0.08)';
  updateOrder(price, name, days);
}

function updateOrder(price, name, days) {
  price = parseInt(price);
  const fee = Math.round(price * 0.1);
  const total = price + fee;
  document.getElementById('pkg-price').textContent = '$' + price.toLocaleString();
  document.getElementById('fee-display').textContent = '$' + fee.toLocaleString();
  document.getElementById('summary-total').textContent = '$' + total.toLocaleString();
  document.getElementById('total-display').textContent = '$' + total.toLocaleString();
  document.getElementById('pkg-label').textContent = name + ' package';
  document.getElementById('delivery-display').textContent = days + ' days';
}

function showRefFile(event) {
  const file = event.target.files[0];
  if(file) {
    document.getElementById('ref-file-name').textContent = file.name;
    document.getElementById('ref-file-display').style.display = 'flex';
  }
}

function submitBooking() {
  const notes = document.getElementById('project-notes').value;
  if(!notes.trim()) {
    alert('Please add project notes for the artist before booking.');
    return;
  }
  const btn = document.querySelector('.btn-primary.btn-xl');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing payment...';
  btn.disabled = true;
  setTimeout(() => {
    window.location.href = '/order-confirmation';
  }, 2000);
}
</script>
` + footer() + closeHTML();
}

export function orderConfirmationPage(): string {
  return head('Order Confirmed') + nav() + `
<section style="min-height:calc(100vh - 68px);display:flex;align-items:center;justify-content:center;padding:60px 24px;background:radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.1) 0%, transparent 60%);">
  <div style="max-width:560px;width:100%;text-align:center;">
    <div style="width:80px;height:80px;background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.1));border:1px solid rgba(16,185,129,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;">
      ✅
    </div>
    <h1 style="font-size:2.2rem;margin-bottom:12px;">Booking Confirmed! 🎵</h1>
    <p style="font-size:16px;color:var(--text2);line-height:1.7;margin-bottom:32px;">
      Your collaboration has been booked and payment is securely held. Your private project workspace has been created. Let's make a hit.
    </p>
    
    <div class="card p-6 mb-8 text-left" style="border-color:rgba(16,185,129,0.25);">
      <h3 style="font-size:16px;margin-bottom:16px;">What happens next?</h3>
      <div style="display:flex;flex-direction:column;gap:14px;">
        ${[
          { icon: 'fas fa-bell', color: 'var(--accent3)', step: 'Artist is notified immediately', desc: 'They\'ll typically respond within their listed response time.' },
          { icon: 'fas fa-layer-group', color: 'var(--blue)', step: 'Your project workspace is live', desc: 'Add more notes, upload files, and track project status.' },
          { icon: 'fas fa-file-audio', color: 'var(--gold)', step: 'Artist delivers your files', desc: 'All stems, WAVs, and deliverables go directly to your stem locker.' },
          { icon: 'fas fa-check-circle', color: 'var(--green)', step: 'You approve → payment releases', desc: 'Funds are released to the artist only when you accept the delivery.' },
        ].map(s => `
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="width:36px;height:36px;border-radius:10px;background:${s.color}22;border:1px solid ${s.color}44;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${s.color};">
            <i class="${s.icon}" style="font-size:14px;"></i>
          </div>
          <div>
            <div style="font-weight:600;font-size:14px;">${s.step}</div>
            <div style="font-size:13px;color:var(--text2);">${s.desc}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/workspace/p1" class="btn btn-primary btn-lg">
        <i class="fas fa-layer-group"></i> Open Project Workspace
      </a>
      <a href="/dashboard" class="btn btn-secondary btn-lg">
        <i class="fas fa-th-large"></i> Go to Dashboard
      </a>
    </div>
    <p style="font-size:13px;color:var(--text2);margin-top:20px;">Order reference: <strong>#AC-2026-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}</strong></p>
  </div>
</section>
` + closeHTML();
}
