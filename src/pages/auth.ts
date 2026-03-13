import { head, nav, footer, closeHTML } from '../layout';

export function loginPage(): string {
  return head('Login') + nav() + `
<section style="min-height:calc(100vh - 68px);display:flex;align-items:center;justify-content:center;padding:40px 24px;background:radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%);">
  <div style="width:100%;max-width:460px;">
    <div style="text-align:center;margin-bottom:40px;">
      <div class="nav-logo" style="justify-content:center;font-size:22px;margin-bottom:24px;">
        <div class="nav-logo-icon">🎵</div>
        Artist Collab
      </div>
      <h1 style="font-size:2rem;margin-bottom:10px;">Welcome back</h1>
      <p style="color:var(--text2);">Sign in to your artist account</p>
    </div>
    
    <div class="card p-8">
      <form action="/dashboard" onsubmit="handleLogin(event)">
        <div class="form-group mb-4">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" placeholder="you@example.com" required id="login-email" value="xavi@demo.com">
        </div>
        <div class="form-group mb-6">
          <label class="form-label" style="display:flex;justify-content:space-between;">
            Password
            <a href="/forgot-password" style="font-size:12px;color:var(--accent3);font-weight:500;">Forgot password?</a>
          </label>
          <div style="position:relative;">
            <input type="password" class="form-input" placeholder="••••••••" required id="login-pass" value="demo123" style="padding-right:44px;">
            <button type="button" onclick="togglePass()" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text2);cursor:pointer;font-size:15px;">
              <i class="fas fa-eye" id="eye-icon"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-full btn-lg" style="justify-content:center;margin-bottom:16px;">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </button>
        <div style="text-align:center;font-size:13px;color:var(--text2);">
          Don't have an account? <a href="/signup" style="color:var(--accent3);font-weight:600;">Join Artist Collab</a>
        </div>
      </form>
      
      <div style="margin:24px 0;display:flex;align-items:center;gap:12px;">
        <div style="flex:1;height:1px;background:var(--border);"></div>
        <span style="font-size:12px;color:var(--text2);">or continue with</span>
        <div style="flex:1;height:1px;background:var(--border);"></div>
      </div>
      
      <div style="display:flex;gap:12px;">
        <button class="btn btn-secondary w-full" style="justify-content:center;" onclick="alert('Demo: Google login would redirect to OAuth')">
          <i class="fab fa-google" style="color:#4285F4;"></i> Google
        </button>
        <button class="btn btn-secondary w-full" style="justify-content:center;" onclick="alert('Demo: Apple login would redirect to OAuth')">
          <i class="fab fa-apple"></i> Apple
        </button>
      </div>
    </div>
    
    <div class="alert alert-info" style="margin-top:16px;">
      <i class="fas fa-info-circle"></i>
      <span><strong>Demo credentials:</strong> xavi@demo.com / demo123</span>
    </div>
  </div>
</section>
<script>
function togglePass() {
  const p = document.getElementById('login-pass');
  const i = document.getElementById('eye-icon');
  if(p.type === 'password') { p.type = 'text'; i.className = 'fas fa-eye-slash'; }
  else { p.type = 'password'; i.className = 'fas fa-eye'; }
}
function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  btn.disabled = true;
  setTimeout(() => { window.location.href = '/dashboard'; }, 1200);
}
</script>
` + closeHTML();
}

export function signupPage(): string {
  return head('Join Artist Collab') + nav() + `
<section style="min-height:calc(100vh - 68px);display:flex;align-items:center;justify-content:center;padding:40px 24px;background:radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%);">
  <div style="width:100%;max-width:520px;">
    <div style="text-align:center;margin-bottom:40px;">
      <div class="nav-logo" style="justify-content:center;font-size:22px;margin-bottom:24px;">
        <div class="nav-logo-icon">🎵</div>
        Artist Collab
      </div>
      <h1 style="font-size:2rem;margin-bottom:10px;">Create your artist profile</h1>
      <p style="color:var(--text2);">Join thousands of independent artists already collaborating on Artist Collab</p>
    </div>
    
    <div class="card p-8">
      <!-- Account type -->
      <div class="form-group mb-6">
        <label class="form-label">I am a...</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <label style="cursor:pointer;">
            <input type="radio" name="accountType" value="artist" checked style="display:none;" onchange="selectType(this)">
            <div class="account-type-card card p-4 text-center selected-type" style="border-color:rgba(124,58,237,0.5);background:rgba(124,58,237,0.1);" id="type-artist">
              <div style="font-size:28px;margin-bottom:8px;">🎤</div>
              <div style="font-weight:700;font-size:15px;">Artist</div>
              <div style="font-size:12px;color:var(--text2);margin-top:4px;">Rapper, Singer, Songwriter</div>
            </div>
          </label>
          <label style="cursor:pointer;">
            <input type="radio" name="accountType" value="producer" style="display:none;" onchange="selectType(this)">
            <div class="account-type-card card p-4 text-center" id="type-producer">
              <div style="font-size:28px;margin-bottom:8px;">🎛️</div>
              <div style="font-weight:700;font-size:15px;">Producer</div>
              <div style="font-size:12px;color:var(--text2);margin-top:4px;">Beat Maker, Mixer, Engineer</div>
            </div>
          </label>
        </div>
      </div>
      
      <form action="/dashboard" onsubmit="handleSignup(event)">
        <div class="grid-2 mb-4">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input type="text" class="form-input" placeholder="Your name" required>
          </div>
          <div class="form-group">
            <label class="form-label">Artist / Stage Name</label>
            <input type="text" class="form-input" placeholder="Stage name" required>
          </div>
        </div>
        <div class="form-group mb-4">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" placeholder="you@example.com" required>
        </div>
        <div class="form-group mb-4">
          <label class="form-label">Username</label>
          <div style="position:relative;">
            <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text2);font-size:15px;">@</span>
            <input type="text" class="form-input" placeholder="yourhandle" style="padding-left:32px;" required>
          </div>
        </div>
        <div class="form-group mb-4">
          <label class="form-label">Primary Genre</label>
          <select class="form-select" required>
            <option value="">Select your genre</option>
            <option>Hip-Hop</option><option>Trap</option><option>R&B</option><option>Drill</option>
            <option>Pop</option><option>Afrobeats</option><option>Soul</option><option>Indie Pop</option>
            <option>Boom Bap</option><option>Conscious</option><option>Reggaeton</option><option>Other</option>
          </select>
        </div>
        <div class="form-group mb-6">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" placeholder="Create a strong password" required minlength="8">
        </div>
        
        <div style="margin-bottom:20px;font-size:13px;color:var(--text2);line-height:1.6;">
          By creating an account, you agree to our 
          <a href="/terms" style="color:var(--accent3);">Terms of Service</a> and 
          <a href="/privacy" style="color:var(--accent3);">Privacy Policy</a>.
        </div>
        
        <button type="submit" class="btn btn-primary w-full btn-lg" style="justify-content:center;margin-bottom:16px;">
          <i class="fas fa-rocket"></i> Create My Artist Profile — Free
        </button>
        <div style="text-align:center;font-size:13px;color:var(--text2);">
          Already have an account? <a href="/login" style="color:var(--accent3);font-weight:600;">Sign In</a>
        </div>
      </form>
    </div>
    
    <div style="text-align:center;margin-top:24px;display:flex;justify-content:center;gap:24px;flex-wrap:wrap;">
      ${[
        { icon: 'fas fa-lock', text: 'Secure payments' },
        { icon: 'fas fa-star', text: 'Verified artists' },
        { icon: 'fas fa-music', text: 'Pro workspaces' },
      ].map(f => `<div style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text2);">
        <i class="${f.icon}" style="color:var(--accent3);font-size:11px;"></i>${f.text}
      </div>`).join('')}
    </div>
  </div>
</section>

<script>
function selectType(input) {
  document.querySelectorAll('.account-type-card').forEach(c => {
    c.style.borderColor = 'var(--border)';
    c.style.background = '';
  });
  const card = document.getElementById('type-' + input.value);
  card.style.borderColor = 'rgba(124,58,237,0.5)';
  card.style.background = 'rgba(124,58,237,0.1)';
}
function handleSignup(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating profile...';
  btn.disabled = true;
  setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
}
</script>
` + closeHTML();
}

export function forgotPasswordPage(): string {
  return head('Reset Password') + nav() + `
<section style="min-height:calc(100vh - 68px);display:flex;align-items:center;justify-content:center;padding:40px 24px;">
  <div style="width:100%;max-width:440px;">
    <div style="text-align:center;margin-bottom:40px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(157,91,245,0.1));border:1px solid rgba(124,58,237,0.3);border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;">
        🔑
      </div>
      <h1 style="font-size:1.8rem;margin-bottom:10px;">Reset Your Password</h1>
      <p style="color:var(--text2);">Enter your email and we'll send you a reset link</p>
    </div>
    <div class="card p-8" id="reset-form">
      <div class="form-group mb-6">
        <label class="form-label">Email Address</label>
        <input type="email" class="form-input" placeholder="you@example.com" id="reset-email">
      </div>
      <button class="btn btn-primary w-full btn-lg" style="justify-content:center;margin-bottom:16px;" onclick="sendReset()">
        <i class="fas fa-paper-plane"></i> Send Reset Link
      </button>
      <div style="text-align:center;font-size:13px;color:var(--text2);">
        Remembered it? <a href="/login" style="color:var(--accent3);font-weight:600;">Back to Login</a>
      </div>
    </div>
    <div class="card p-8 text-center" id="reset-success" style="display:none;">
      <div style="font-size:48px;margin-bottom:16px;">✅</div>
      <h2 style="margin-bottom:8px;">Check Your Email</h2>
      <p style="color:var(--text2);margin-bottom:24px;">We've sent a reset link to your email address.</p>
      <a href="/login" class="btn btn-primary" style="justify-content:center;">Back to Login</a>
    </div>
  </div>
</section>
<script>
function sendReset() {
  const email = document.getElementById('reset-email').value;
  if(!email) { alert('Please enter your email'); return; }
  document.getElementById('reset-form').style.display = 'none';
  document.getElementById('reset-success').style.display = 'block';
}
</script>
` + closeHTML();
}
