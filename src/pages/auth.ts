import { shell, closeShell, publicNav } from '../layout';

const AUTH_STYLES = `
  .auth-shell {
    min-height: calc(100vh - 64px);
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }
  /* Left editorial panel */
  .auth-editorial {
    background: var(--ink);
    border-right: 1px solid var(--hairline);
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  .auth-editorial-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.15) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 80%, rgba(245,158,11,0.06) 0%, transparent 50%);
    pointer-events: none;
  }
  .auth-editorial-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
    pointer-events: none;
  }
  /* Right form panel */
  .auth-form-panel {
    background: var(--void);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    overflow-y: auto;
  }
  .auth-form-inner { width: 100%; max-width: 420px; }
  .auth-wordmark {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9375rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  /* Account type selector */
  .type-tile {
    border-radius: var(--r-md);
    border: 1px solid var(--hairline);
    background: var(--surface);
    padding: 16px;
    cursor: pointer;
    transition: all 0.18s;
    user-select: none;
  }
  .type-tile:hover { border-color: rgba(255,255,255,0.15); }
  .type-tile.selected {
    border-color: rgba(139,92,246,0.5);
    background: rgba(139,92,246,0.08);
    box-shadow: inset 0 0 0 1px rgba(139,92,246,0.25);
  }
  /* Social sign-in */
  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 11px 16px;
    background: var(--raised);
    border: 1px solid var(--hairline);
    border-radius: var(--r);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--t1);
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }
  .social-btn:hover { background: var(--elevated); border-color: rgba(255,255,255,0.15); }
  /* Divider with label */
  .or-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 18px 0;
  }
  .or-divider::before, .or-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--hairline);
  }
  .or-label { font-size: 0.75rem; color: var(--t4); white-space: nowrap; }
  @media (max-width: 768px) {
    .auth-shell { grid-template-columns: 1fr; }
    .auth-editorial { display: none; }
    .auth-form-panel { padding: 32px 24px; }
  }
`;

// ─── Sample stat card for editorial panel ────────────────────────────────────
const editorialPanel = (quote: string, tagline: string) => `
<div class="auth-editorial-bg"></div>
<div class="auth-editorial-grid"></div>

<div style="position:relative;z-index:1;">
  <div class="auth-wordmark">
    <div style="width:30px;height:30px;background:linear-gradient(135deg,var(--uv),var(--uv-bright));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 0 20px var(--uv-glow);">🎵</div>
    Artist Collab
  </div>
</div>

<div style="position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;padding:16px 0;">
  <div style="margin-bottom:24px;">
    <div style="font-size:0.71rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--uv-bright);margin-bottom:14px;">The Remote Studio</div>
    <h2 style="font-size:clamp(2rem,3vw,2.75rem);font-weight:800;letter-spacing:-0.03em;line-height:1.1;margin-bottom:16px;">${quote}</h2>
    <p style="font-size:0.9375rem;color:var(--t3);line-height:1.7;">${tagline}</p>
  </div>

  <!-- Floating project card preview -->
  <div style="border:1px solid var(--hairline);border-radius:var(--r-lg);background:var(--surface);overflow:hidden;margin-bottom:24px;">
    <div style="padding:14px 16px;border-bottom:1px solid var(--hairline);display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:0.78rem;font-weight:600;color:var(--t2);">Current Collab</span>
      <span class="badge badge-uv" style="font-size:0.65rem;"><i class="fas fa-circle" style="font-size:6px;"></i> Live</span>
    </div>
    <div style="padding:14px 16px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=face" class="av av-sm" style="border:1.5px solid rgba(139,92,246,0.4);" alt="Artist">
        <span style="font-size:0.8125rem;color:var(--t2);font-style:italic;">"Stems are ready — check the chorus drop."</span>
      </div>
      <div style="display:flex;gap:6px;">
        ${['WAV', 'STEMS', 'MIX'].map(t => `<span class="badge badge-muted" style="font-size:0.65rem;">${t}</span>`).join('')}
        <span style="margin-left:auto;font-size:0.75rem;font-weight:700;color:var(--ok);">$900 held</span>
      </div>
    </div>
  </div>

  <!-- Platform stats row -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
    ${[
      {v:'12K+', l:'Artists'},
      {v:'$2.8M', l:'Paid Out'},
      {v:'4.9★', l:'Avg Rating'},
    ].map(s => `
    <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r);padding:12px;text-align:center;">
      <div style="font-size:1rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:2px;">${s.v}</div>
      <div style="font-size:0.69rem;color:var(--t4);">${s.l}</div>
    </div>`).join('')}
  </div>
</div>

<div style="position:relative;z-index:1;">
  <div style="display:flex;align-items:center;gap:-8px;">
    ${['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=face',
       'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=60&h=60&fit=crop&crop=face',
       'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=60&h=60&fit=crop&crop=face',
       'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&crop=face'].map((src, i) =>
    `<img src="${src}" class="av av-xs" style="border:2px solid var(--ink);margin-left:${i > 0 ? '-8px' : '0'};" alt="Artist">`
    ).join('')}
  </div>
  <p style="font-size:0.78rem;color:var(--t3);margin-top:8px;">Join 12,000+ artists already collaborating.</p>
</div>`;

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export function loginPage(): string {
  return shell('Sign In', AUTH_STYLES) + publicNav() + `
<div class="auth-shell">
  <div class="auth-editorial">
    ${editorialPanel('Make records.<br>Not headaches.', 'Professional remote music collaboration — booking, messaging, stems, and payments — all in one place.')}
  </div>

  <div class="auth-form-panel">
    <div class="auth-form-inner">
      <div style="margin-bottom:32px;">
        <h1 style="font-size:1.625rem;letter-spacing:-0.02em;margin-bottom:6px;">Welcome back</h1>
        <p class="body-sm">Sign in to your Artist Collab account</p>
      </div>

      <!-- Social sign-in -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:0;">
        <button class="social-btn" onclick="alert('Google auth — available at launch')">
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <button class="social-btn" onclick="alert('Apple auth — available at launch')">
          <i class="fab fa-apple" style="font-size:1rem;"></i>
          Continue with Apple
        </button>
      </div>

      <div class="or-divider"><span class="or-label">or sign in with email</span></div>

      <form onsubmit="handleLogin(event)">
        <div class="field mb-4">
          <label class="field-label">Email</label>
          <input type="email" class="field-input" placeholder="you@example.com" id="login-email" value="xavi@demo.com" required>
        </div>
        <div class="field mb-5">
          <label class="field-label" style="display:flex;justify-content:space-between;align-items:center;">
            Password
            <a href="/forgot-password" style="font-size:0.75rem;color:var(--uv-bright);font-weight:600;text-transform:none;letter-spacing:0;text-decoration:none;" onmouseover="this.style.color='var(--uv-bright)'" onmouseout="">Forgot?</a>
          </label>
          <div style="position:relative;">
            <input type="password" class="field-input" placeholder="••••••••" id="login-pass" value="demo123" required style="padding-right:44px;">
            <button type="button" onclick="togglePwd('login-pass','eye1')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--t3);cursor:pointer;font-size:0.875rem;padding:4px;">
              <i class="fas fa-eye" id="eye1"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-lg w-full" style="justify-content:center;margin-bottom:14px;" id="login-btn">
          Sign In
        </button>
        <p style="text-align:center;font-size:0.8125rem;color:var(--t3);">
          New to Artist Collab? <a href="/signup" style="color:var(--uv-bright);font-weight:600;text-decoration:none;">Create account</a>
        </p>
      </form>

      <div class="alert alert-info" style="margin-top:20px;">
        <i class="fas fa-circle-info"></i>
        <span><strong>Demo:</strong> xavi@demo.com / demo123</span>
      </div>
    </div>
  </div>
</div>

<script>
function togglePwd(inputId, iconId) {
  const el = document.getElementById(inputId);
  const ic = document.getElementById(iconId);
  el.type = el.type === 'password' ? 'text' : 'password';
  ic.className = el.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}
function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  btn.disabled = true;
  setTimeout(() => window.location.href = '/dashboard', 1200);
}
</script>
` + closeShell();
}

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
export function signupPage(): string {
  return shell('Join Artist Collab', AUTH_STYLES + `
    .step-dot {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--raised);
      border: 1px solid var(--hairline);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--t3);
      flex-shrink: 0;
    }
    .step-dot.active {
      background: var(--uv);
      border-color: var(--uv);
      color: white;
      box-shadow: 0 0 16px var(--uv-glow);
    }
    .step-dot.done {
      background: var(--ok);
      border-color: var(--ok);
      color: white;
    }
  `) + publicNav() + `
<div class="auth-shell">
  <div class="auth-editorial">
    ${editorialPanel('Your collab life,<br>organized.', 'Join thousands of rappers, singers, songwriters, and producers building records remotely on Artist Collab.')}
  </div>

  <div class="auth-form-panel">
    <div class="auth-form-inner">
      <div style="margin-bottom:28px;">
        <h1 style="font-size:1.625rem;letter-spacing:-0.02em;margin-bottom:6px;">Create your profile</h1>
        <p class="body-sm">It's free. No credit card needed.</p>
      </div>

      <!-- Account type selector -->
      <div class="field mb-5">
        <label class="field-label" style="margin-bottom:10px;">I am a...</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="type-grid">
          <div class="type-tile selected" id="tile-artist" onclick="selectType('artist')">
            <div style="font-size:1.5rem;margin-bottom:8px;">🎤</div>
            <div style="font-size:0.875rem;font-weight:700;margin-bottom:3px;">Artist</div>
            <div style="font-size:0.75rem;color:var(--t3);">Rapper · Singer · Songwriter</div>
          </div>
          <div class="type-tile" id="tile-producer" onclick="selectType('producer')">
            <div style="font-size:1.5rem;margin-bottom:8px;">🎛️</div>
            <div style="font-size:0.875rem;font-weight:700;margin-bottom:3px;">Producer</div>
            <div style="font-size:0.75rem;color:var(--t3);">Beat Maker · Mixer · Engineer</div>
          </div>
        </div>
      </div>

      <!-- Social sign-up -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <button class="social-btn" onclick="alert('Google sign-up — available at launch')">
          <svg width="15" height="15" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>
        <button class="social-btn" onclick="alert('Apple sign-up — available at launch')">
          <i class="fab fa-apple" style="font-size:0.9375rem;"></i>
          Apple
        </button>
      </div>

      <div class="or-divider"><span class="or-label">or create with email</span></div>

      <form onsubmit="handleSignup(event)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div class="field">
            <label class="field-label">First Name</label>
            <input type="text" class="field-input" placeholder="First name" required>
          </div>
          <div class="field">
            <label class="field-label">Stage Name</label>
            <input type="text" class="field-input" placeholder="Artist name" required>
          </div>
        </div>
        <div class="field mb-3">
          <label class="field-label">Email</label>
          <input type="email" class="field-input" placeholder="you@example.com" required>
        </div>
        <div class="field mb-3">
          <label class="field-label">Username</label>
          <div style="position:relative;">
            <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--t3);font-size:0.9375rem;line-height:1;">@</span>
            <input type="text" class="field-input" placeholder="yourhandle" style="padding-left:30px;" required>
          </div>
        </div>
        <div class="field mb-4">
          <label class="field-label">Primary Genre</label>
          <select class="field-select" required>
            <option value="">Your main genre</option>
            <option>Hip-Hop</option><option>Trap</option><option>R&B</option>
            <option>Drill</option><option>Pop</option><option>Afrobeats</option>
            <option>Soul</option><option>Indie Pop</option><option>Boom Bap</option>
            <option>Reggaeton</option><option>Other</option>
          </select>
        </div>
        <div class="field mb-5">
          <label class="field-label">Password</label>
          <div style="position:relative;">
            <input type="password" class="field-input" placeholder="Min. 8 characters" id="signup-pass" required minlength="8" style="padding-right:44px;" oninput="checkPwdStrength(this.value)">
            <button type="button" onclick="togglePwd2()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--t3);cursor:pointer;font-size:0.875rem;padding:4px;">
              <i class="fas fa-eye" id="eye2"></i>
            </button>
          </div>
          <div style="margin-top:6px;display:flex;gap:3px;" id="pwd-strength">
            <div style="flex:1;height:3px;border-radius:2px;background:var(--rim);" class="pwd-seg"></div>
            <div style="flex:1;height:3px;border-radius:2px;background:var(--rim);" class="pwd-seg"></div>
            <div style="flex:1;height:3px;border-radius:2px;background:var(--rim);" class="pwd-seg"></div>
            <div style="flex:1;height:3px;border-radius:2px;background:var(--rim);" class="pwd-seg"></div>
          </div>
        </div>

        <div style="margin-bottom:18px;font-size:0.78rem;color:var(--t4);line-height:1.6;">
          By creating an account you agree to our
          <a href="/terms" style="color:var(--uv-bright);text-decoration:none;">Terms of Service</a> and
          <a href="/privacy" style="color:var(--uv-bright);text-decoration:none;">Privacy Policy</a>.
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-full" style="justify-content:center;margin-bottom:14px;" id="signup-btn">
          <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
          Create My Artist Profile
        </button>
        <p style="text-align:center;font-size:0.8125rem;color:var(--t3);">
          Already have an account? <a href="/login" style="color:var(--uv-bright);font-weight:600;text-decoration:none;">Sign in</a>
        </p>
      </form>
    </div>
  </div>
</div>

<script>
function selectType(type) {
  document.getElementById('tile-artist').classList.toggle('selected', type === 'artist');
  document.getElementById('tile-producer').classList.toggle('selected', type === 'producer');
}
function togglePwd2() {
  const el = document.getElementById('signup-pass');
  const ic = document.getElementById('eye2');
  el.type = el.type === 'password' ? 'text' : 'password';
  ic.className = el.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}
function checkPwdStrength(pwd) {
  const segs = document.querySelectorAll('.pwd-seg');
  const colors = ['var(--err)', 'var(--warn)', 'var(--uv-bright)', 'var(--ok)'];
  const score = [pwd.length > 7, /[A-Z]/.test(pwd), /[0-9]/.test(pwd), /[^A-Za-z0-9]/.test(pwd)].filter(Boolean).length;
  segs.forEach((s, i) => s.style.background = i < score ? colors[score - 1] : 'var(--rim)');
}
function handleSignup(e) {
  e.preventDefault();
  const btn = document.getElementById('signup-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating profile...';
  btn.disabled = true;
  setTimeout(() => window.location.href = '/dashboard', 1600);
}
</script>
` + closeShell();
}

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
export function forgotPasswordPage(): string {
  return shell('Reset Password', AUTH_STYLES) + publicNav() + `
<div class="auth-shell">
  <div class="auth-editorial">
    ${editorialPanel('Back in the<br>studio shortly.', 'We\'ll send a secure reset link to your inbox. Back in 60 seconds.')}
  </div>

  <div class="auth-form-panel">
    <div class="auth-form-inner">
      <div id="reset-form-state">
        <div style="margin-bottom:32px;">
          <div style="width:48px;height:48px;background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.25);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <i class="fas fa-key" style="color:var(--uv-bright);font-size:1.125rem;"></i>
          </div>
          <h1 style="font-size:1.5rem;letter-spacing:-0.02em;margin-bottom:6px;">Reset your password</h1>
          <p class="body-sm">Enter your email and we'll send a reset link instantly.</p>
        </div>
        <div class="field mb-5">
          <label class="field-label">Email Address</label>
          <input type="email" class="field-input" placeholder="you@example.com" id="reset-email">
        </div>
        <button class="btn btn-primary btn-lg w-full" style="justify-content:center;margin-bottom:16px;" onclick="sendReset()">
          Send Reset Link
        </button>
        <p style="text-align:center;font-size:0.8125rem;color:var(--t3);">
          <a href="/login" style="color:var(--uv-bright);font-weight:600;text-decoration:none;">← Back to sign in</a>
        </p>
      </div>
      <div id="reset-success-state" style="display:none;text-align:center;">
        <div style="width:64px;height:64px;background:var(--ok-dim);border:1px solid rgba(16,185,129,0.25);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.5rem;">
          ✅
        </div>
        <h2 style="font-size:1.375rem;letter-spacing:-0.02em;margin-bottom:8px;">Check your inbox</h2>
        <p class="body-sm" style="margin-bottom:28px;">A reset link has been sent to your email address.</p>
        <a href="/login" class="btn btn-secondary btn-lg w-full" style="justify-content:center;">Back to Sign In</a>
      </div>
    </div>
  </div>
</div>

<script>
function sendReset() {
  const e = document.getElementById('reset-email').value;
  if (!e) { alert('Please enter your email.'); return; }
  document.getElementById('reset-form-state').style.display = 'none';
  document.getElementById('reset-success-state').style.display = 'block';
}
</script>
` + closeShell();
}
