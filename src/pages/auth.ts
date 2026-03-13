import { shell, closeShell, publicNav } from '../layout';

// Shared auth page styles using only AC/1 tokens
const AUTH_STYLES = `
  .auth-shell {
    min-height: calc(100vh - 56px);
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  /* ─ Left panel: editorial / brand statement ─ */
  .auth-left {
    background: var(--c-base);
    border-right: 1px solid var(--c-wire);
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  /* DAW grid texture */
  .auth-left-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 70% 70% at 40% 50%, black 0%, transparent 100%);
    pointer-events: none;
  }
  /* Signal glow accent */
  .auth-left-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 60% at 20% 70%, rgba(200,255,0,0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ─ Right panel: form ─ */
  .auth-right {
    background: var(--c-void);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    overflow-y: auto;
  }
  .auth-form-wrap { width: 100%; max-width: 420px; }

  /* Form elements */
  .auth-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .auth-label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--t4);
    font-family: var(--font-body);
  }
  .auth-input {
    background: var(--c-raised);
    border: 1px solid var(--c-rim);
    border-radius: var(--r);
    padding: 12px 14px;
    color: var(--t1);
    font-size: 0.9375rem;
    font-family: var(--font-body);
    width: 100%;
    outline: none;
    transition: border-color var(--t-fast), box-shadow var(--t-fast);
    -webkit-appearance: none;
  }
  .auth-input:focus {
    border-color: var(--signal);
    box-shadow: 0 0 0 3px var(--signal-dim);
  }
  .auth-input::placeholder { color: var(--t4); }

  /* Role toggle (artist / producer) */
  .role-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 20px;
  }
  .role-option {
    border: 1px solid var(--c-rim);
    border-radius: var(--r);
    padding: 14px;
    cursor: pointer;
    transition: all var(--t-base) var(--ease);
    text-align: center;
    background: var(--c-raised);
  }
  .role-option:hover { border-color: rgba(255,255,255,0.1); }
  .role-option.on {
    border-color: var(--signal);
    background: var(--signal-dim);
  }
  .role-option.on .role-icon { color: var(--signal); }

  /* Social auth */
  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px;
    border-radius: var(--r);
    border: 1px solid var(--c-rim);
    background: var(--c-raised);
    color: var(--t1);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    font-family: var(--font-body);
    transition: border-color var(--t-fast), background var(--t-fast);
    text-decoration: none;
  }
  .social-btn:hover { border-color: rgba(255,255,255,0.12); background: var(--c-lift); }

  /* Divider */
  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    color: var(--t4);
    font-size: 0.75rem;
  }
  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--c-wire);
  }

  @media (max-width: 900px) {
    .auth-shell { grid-template-columns: 1fr; }
    .auth-left { display: none; }
  }
  @media (max-width: 480px) {
    .auth-right { padding: 32px 20px; }
    .auth-form-wrap { max-width: 100%; }
    /* Bigger touch targets for auth links */
    .auth-switch-link { display: inline-block; padding: 8px 0; }
    .auth-input { padding: 14px 14px; font-size: 1rem; }
    .role-option { padding: 16px; }
    .social-btn { padding: 14px; min-height: 52px; font-size: 1rem; }
    /* Stack name/username fields vertically */
    .auth-name-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SHARED: Left editorial panel
// ─────────────────────────────────────────────────────────────────────────────
function authLeft(headline: string, sub: string, quote?: {text:string;name:string;handle:string;img:string}) {
  return `
<div class="auth-left">
  <div class="auth-left-grid"></div>
  <div class="auth-left-glow"></div>

  <!-- Logo -->
  <div style="position:relative;z-index:1;">
    <a href="/" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:var(--t1);">
      <div style="width:32px;height:32px;background:var(--c-panel);border:1px solid var(--c-rim);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;position:relative;">
        <span style="font-family:var(--font-display);font-size:0.8125rem;font-weight:800;letter-spacing:-0.02em;">AC</span>
        <div style="position:absolute;top:-3px;right:-3px;width:8px;height:8px;background:var(--signal);border-radius:50%;box-shadow:0 0 8px var(--signal);"></div>
      </div>
      <span style="font-family:var(--font-display);font-size:1rem;font-weight:700;letter-spacing:-0.01em;">Artist Collab</span>
    </a>
  </div>

  <!-- Headline -->
  <div style="position:relative;z-index:1;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
      <div style="height:1px;width:24px;background:var(--signal);box-shadow:0 0 6px var(--signal-glow);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">The Session</span>
    </div>
    <h2 class="d2" style="margin-bottom:14px;">${headline}</h2>
    <p class="body-base">${sub}</p>
  </div>

  <!-- Testimonial / social proof -->
  <div style="position:relative;z-index:1;">
    ${quote ? `
    <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:20px;margin-bottom:24px;">
      <p style="font-size:0.9375rem;line-height:1.7;color:var(--t2);margin-bottom:14px;font-style:italic;">"${quote.text}"</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${quote.img}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid var(--c-rim);" alt="${quote.name}">
        <div>
          <div style="font-size:0.8125rem;font-weight:700;">${quote.name}</div>
          <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);">@${quote.handle}</div>
        </div>
        <div style="margin-left:auto;color:var(--signal);font-size:0.875rem;letter-spacing:2px;">★★★★★</div>
      </div>
    </div>` : ''}

    <!-- Mini stats -->
    <div style="display:flex;gap:24px;">
      ${[
        { val:'12K+', lbl:'Artists' },
        { val:'$2.1M', lbl:'Paid Out' },
        { val:'4.9★', lbl:'Rating' },
      ].map(s => `
      <div>
        <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:var(--signal);">${s.val}</div>
        <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);letter-spacing:0.1em;text-transform:uppercase;">${s.lbl}</div>
      </div>`).join('')}
    </div>
  </div>
</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────
export function loginPage(): string {
  return shell('Sign In', AUTH_STYLES) + `
<div class="auth-shell">

  ${authLeft(
    'Back in<br>the session',
    'Sign in to access your projects, messages, and earnings.',
    {
      text: 'I got paid same-day. The escrow system just works.',
      name: 'Nova Lee',
      handle: 'novalee',
      img: 'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=80&h=80&fit=crop&crop=face'
    }
  )}

  <!-- Right: form -->
  <div class="auth-right">
    <div class="auth-form-wrap">

      <!-- Header -->
      <div style="margin-bottom:32px;">
        <h1 style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:8px;">Welcome back</h1>
        <p class="body-sm">Don't have an account? <a href="/signup" style="color:var(--signal);font-weight:600;" class="auth-switch-link">Join Artist Collab</a></p>
      </div>

      <!-- Social auth -->
      <a href="#" class="social-btn" style="margin-bottom:8px;" onclick="alert('Google auth coming soon')">
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
        Continue with Google
      </a>
      <a href="#" class="social-btn" onclick="alert('Apple auth coming soon')">
        <i class="fab fa-apple" style="font-size:1.0625rem;"></i>
        Continue with Apple
      </a>

      <div class="auth-divider">or sign in with email</div>

      <!-- Form -->
      <form onsubmit="event.preventDefault();window.location.href='/dashboard';">
        <div class="auth-field">
          <label class="auth-label">Email Address</label>
          <input type="email" class="auth-input" placeholder="you@example.com" value="xavi@example.com" required>
        </div>
        <div class="auth-field">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <label class="auth-label">Password</label>
            <a href="/forgot-password" style="font-size:0.8125rem;color:var(--t3);transition:color 0.15s;padding:4px 0;" onmouseover="this.style.color='var(--t1)'" onmouseout="this.style.color='var(--t3)'">Forgot password?</a>
          </div>
          <input type="password" class="auth-input" placeholder="••••••••" value="demo1234" required>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
          <input type="checkbox" id="remember" style="accent-color:var(--signal);width:15px;height:15px;">
          <label for="remember" style="font-size:0.8125rem;color:var(--t3);cursor:pointer;">Remember me for 30 days</label>
        </div>

        <button type="submit" class="btn btn-primary btn-lg btn-w">
          <i class="fas fa-arrow-right-to-bracket" style="font-size:13px;"></i>
          Sign In
        </button>
      </form>

      <div style="margin-top:24px;padding:12px 14px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.18);border-radius:var(--r);display:flex;gap:8px;">
        <i class="fas fa-bolt" style="color:var(--signal);font-size:0.875rem;flex-shrink:0;margin-top:1px;"></i>
        <div style="font-size:0.75rem;color:var(--t2);">Demo account: <strong style="color:var(--signal);">xavi@example.com</strong> / <strong style="color:var(--signal);">demo1234</strong></div>
      </div>

    </div>
  </div>
</div>
${closeShell()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNUP
// ─────────────────────────────────────────────────────────────────────────────
export function signupPage(): string {
  return shell('Join Artist Collab', AUTH_STYLES) + `
<div class="auth-shell">

  ${authLeft(
    'Start your<br>first session',
    'Join 12,000+ artists and producers already building their music on Artist Collab.',
    {
      text: 'The stem vault alone saved me from three near-disasters. Every collab on here has been clean.',
      name: 'Marcus X',
      handle: 'marcusx',
      img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=80&h=80&fit=crop&crop=face'
    }
  )}

  <!-- Right: form -->
  <div class="auth-right">
    <div class="auth-form-wrap">

      <div style="margin-bottom:28px;">
        <h1 style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:8px;">Create your account</h1>
        <p class="body-sm">Already have an account? <a href="/login" style="color:var(--signal);font-weight:600;" class="auth-switch-link">Sign in</a></p>
      </div>

      <!-- Social auth -->
      <a href="#" class="social-btn" style="margin-bottom:8px;" onclick="alert('Google auth coming soon')">
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
        Continue with Google
      </a>

      <div class="auth-divider">or create with email</div>

      <!-- Role selection (artist-identity) -->
      <div style="margin-bottom:20px;">
        <div class="auth-label" style="margin-bottom:10px;">I am a…</div>
        <div class="role-toggle">
          <div class="role-option on" onclick="selectRole(this,'artist')">
            <div class="role-icon" style="font-size:1.5rem;margin-bottom:6px;transition:color 0.15s;">🎤</div>
            <div style="font-size:0.875rem;font-weight:700;">Artist</div>
            <div class="mono-sm" style="color:var(--t4);margin-top:2px;">Rapper · Singer · Songwriter</div>
          </div>
          <div class="role-option" onclick="selectRole(this,'producer')">
            <div class="role-icon" style="font-size:1.5rem;margin-bottom:6px;transition:color 0.15s;">🎧</div>
            <div style="font-size:0.875rem;font-weight:700;">Producer</div>
            <div class="mono-sm" style="color:var(--t4);margin-top:2px;">Beat Maker · Mixer · Engineer</div>
          </div>
        </div>
      </div>

      <form onsubmit="event.preventDefault();window.location.href='/dashboard';">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;" class="auth-name-grid">
          <div class="auth-field">
            <label class="auth-label">Artist Name</label>
            <input type="text" class="auth-input" placeholder="Stage name" required>
          </div>
          <div class="auth-field">
            <label class="auth-label">Username</label>
            <input type="text" class="auth-input" placeholder="@handle" required>
          </div>
        </div>
        <div class="auth-field">
          <label class="auth-label">Email Address</label>
          <input type="email" class="auth-input" placeholder="you@example.com" required>
        </div>
        <div class="auth-field">
          <label class="auth-label">Password</label>
          <input type="password" class="auth-input" placeholder="Min. 8 characters" required>
        </div>

        <div style="margin-bottom:20px;">
          <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;">
            <input type="checkbox" required style="margin-top:3px;accent-color:var(--signal);width:18px;height:18px;flex-shrink:0;">
            <span style="font-size:0.875rem;color:var(--t3);line-height:1.6;">I agree to the <a href="/terms" style="color:var(--signal);padding:2px 0;display:inline-block;">Terms of Service</a> and <a href="/privacy" style="color:var(--signal);padding:2px 0;display:inline-block;">Privacy Policy</a></span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-lg btn-w">
          <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
          Create Account — It's Free
        </button>
      </form>
    </div>
  </div>
</div>

<script>
function selectRole(el, role) {
  document.querySelectorAll('.role-option').forEach(r => r.classList.remove('on'));
  el.classList.add('on');
}
</script>
${closeShell()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────────────────────────────────────────
export function forgotPasswordPage(): string {
  return shell('Reset Password', AUTH_STYLES) + `
<div class="auth-shell">

  ${authLeft(
    'Reset your<br>access',
    'Enter your email and we\'ll send you a secure reset link.',
  )}

  <div class="auth-right">
    <div class="auth-form-wrap">

      <div style="margin-bottom:32px;">
        <div style="width:48px;height:48px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.2);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
          <i class="fas fa-lock" style="color:var(--signal);font-size:1.25rem;"></i>
        </div>
        <h1 style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:8px;">Forgot password?</h1>
        <p class="body-sm" style="color:var(--t3);">No worries — enter your email below and we'll send a reset link.</p>
      </div>

      <form onsubmit="event.preventDefault();document.getElementById('forgot-success').style.display='block';this.style.display='none';">
        <div class="auth-field">
          <label class="auth-label">Email Address</label>
          <input type="email" class="auth-input" placeholder="you@example.com" required>
        </div>
        <button type="submit" class="btn btn-primary btn-lg btn-w">
          Send Reset Link
          <i class="fas fa-arrow-right" style="font-size:12px;"></i>
        </button>
      </form>

      <div id="forgot-success" style="display:none;padding:20px;background:rgba(45,202,114,0.08);border:1px solid rgba(45,202,114,0.2);border-radius:var(--r);text-align:center;margin-top:8px;">
        <i class="fas fa-check-circle" style="color:var(--s-ok);font-size:1.5rem;margin-bottom:8px;display:block;"></i>
        <div style="font-weight:700;margin-bottom:4px;">Check your inbox</div>
        <p class="body-sm">We've sent a reset link to your email.</p>
      </div>

      <div style="margin-top:24px;text-align:center;">
        <a href="/login" style="font-size:0.875rem;color:var(--t3);">
          <i class="fas fa-arrow-left" style="font-size:11px;margin-right:6px;"></i>
          Back to Sign In
        </a>
      </div>

    </div>
  </div>
</div>
${closeShell()}`;
}
