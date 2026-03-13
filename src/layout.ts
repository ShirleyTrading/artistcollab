// Shared layout helpers
export const head = (title: string, extra = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Artist Collab</title>
  <meta name="description" content="Artist Collab — Remote Music Collaboration, Built for Real Artists. Book features, share stems, and manage projects in one secure platform.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='%237c3aed'/><text y='48' x='8' font-size='42'>🎵</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --bg: #0a0a0f;
      --bg2: #111118;
      --bg3: #18181f;
      --bg4: #1e1e28;
      --border: rgba(255,255,255,0.08);
      --border2: rgba(255,255,255,0.12);
      --text: #f1f1f5;
      --text2: #9999b0;
      --text3: #6666888;
      --accent: #7c3aed;
      --accent2: #9d5bf5;
      --accent3: #c084fc;
      --gold: #f59e0b;
      --green: #10b981;
      --red: #ef4444;
      --blue: #3b82f6;
      --pink: #ec4899;
      --radius: 12px;
      --radius2: 16px;
      --shadow: 0 4px 24px rgba(0,0,0,0.4);
      --shadow2: 0 8px 40px rgba(0,0,0,0.6);
      --glow: 0 0 40px rgba(124,58,237,0.15);
    }
    
    html { scroll-behavior: smooth; }
    
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    
    h1,h2,h3,h4,h5,h6 {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      line-height: 1.2;
    }
    
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; }
    button, input, select, textarea { font-family: inherit; }
    
    /* ─── Scrollbar ─── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 4px; }
    
    /* ─── Nav ─── */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10,10,15,0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      padding: 0 24px;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 700;
    }
    .nav-logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--accent), var(--accent3));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 6px;
      list-style: none;
    }
    .nav-links a {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text2);
      transition: all 0.2s;
    }
    .nav-links a:hover { color: var(--text); background: var(--bg3); }
    .nav-links a.active { color: var(--text); background: var(--bg3); }
    .nav-actions { display: flex; align-items: center; gap: 10px; }
    
    /* ─── Buttons ─── */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: white;
      box-shadow: 0 4px 16px rgba(124,58,237,0.35);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(124,58,237,0.5);
    }
    .btn-secondary {
      background: var(--bg3);
      color: var(--text);
      border: 1px solid var(--border2);
    }
    .btn-secondary:hover { background: var(--bg4); border-color: rgba(255,255,255,0.2); }
    .btn-ghost { background: transparent; color: var(--text2); }
    .btn-ghost:hover { color: var(--text); background: var(--bg3); }
    .btn-sm { padding: 7px 14px; font-size: 13px; }
    .btn-lg { padding: 14px 28px; font-size: 16px; border-radius: 12px; }
    .btn-xl { padding: 16px 36px; font-size: 17px; border-radius: 14px; }
    .btn-outline {
      background: transparent;
      color: var(--text);
      border: 1px solid var(--border2);
    }
    .btn-outline:hover { background: var(--bg3); border-color: rgba(255,255,255,0.25); }
    .btn-gold {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      color: #0a0a0f;
    }
    .btn-green {
      background: linear-gradient(135deg, #059669, #10b981);
      color: white;
    }
    
    /* ─── Cards ─── */
    .card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: var(--radius2);
      overflow: hidden;
    }
    .card:hover { border-color: var(--border2); }
    .card-glass {
      background: rgba(24,24,31,0.6);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: var(--radius2);
    }
    
    /* ─── Badge ─── */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-purple { background: rgba(124,58,237,0.2); color: var(--accent3); border: 1px solid rgba(124,58,237,0.3); }
    .badge-green { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
    .badge-gold { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
    .badge-blue { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }
    .badge-red { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
    .badge-gray { background: rgba(107,114,128,0.15); color: #9ca3af; border: 1px solid rgba(107,114,128,0.25); }
    
    /* ─── Stars ─── */
    .stars { color: var(--gold); display: inline-flex; gap: 1px; font-size: 13px; }
    
    /* ─── Form elements ─── */
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-label { font-size: 13px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: 0.05em; }
    .form-input {
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      color: var(--text);
      font-size: 15px;
      transition: all 0.2s;
      outline: none;
      width: 100%;
    }
    .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
    .form-input::placeholder { color: var(--text2); opacity: 0.6; }
    .form-select {
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      color: var(--text);
      font-size: 15px;
      outline: none;
      width: 100%;
      cursor: pointer;
    }
    .form-select:focus { border-color: var(--accent); }
    textarea.form-input { resize: vertical; min-height: 120px; }
    
    /* ─── Section helpers ─── */
    .section { padding: 80px 24px; }
    .section-sm { padding: 48px 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .container-sm { max-width: 900px; margin: 0 auto; }
    .container-xs { max-width: 600px; margin: 0 auto; }
    
    /* ─── Grid ─── */
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    
    /* ─── Utility ─── */
    .flex { display: flex; }
    .flex-col { display: flex; flex-direction: column; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    .gap-4 { gap: 16px; }
    .gap-6 { gap: 24px; }
    .gap-8 { gap: 32px; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .text-sm { font-size: 14px; }
    .text-xs { font-size: 12px; }
    .text-lg { font-size: 18px; }
    .text-xl { font-size: 22px; }
    .text-2xl { font-size: 28px; }
    .text-3xl { font-size: 36px; }
    .text-muted { color: var(--text2); }
    .text-accent { color: var(--accent3); }
    .text-green { color: var(--green); }
    .text-gold { color: var(--gold); }
    .text-red { color: var(--red); }
    .mb-1 { margin-bottom: 4px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-8 { margin-bottom: 32px; }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }
    .mt-8 { margin-top: 32px; }
    .p-4 { padding: 16px; }
    .p-6 { padding: 24px; }
    .p-8 { padding: 32px; }
    .rounded { border-radius: var(--radius); }
    .rounded-full { border-radius: 999px; }
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    .relative { position: relative; }
    .absolute { position: absolute; }
    .overflow-hidden { overflow: hidden; }
    
    /* ─── Divider ─── */
    .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
    
    /* ─── Tag pill ─── */
    .tag {
      display: inline-block;
      padding: 4px 12px;
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text2);
    }
    .tag:hover { border-color: var(--accent); color: var(--accent3); cursor: pointer; }
    
    /* ─── Avatar ─── */
    .avatar {
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }
    .avatar-sm { width: 32px; height: 32px; }
    .avatar-md { width: 48px; height: 48px; }
    .avatar-lg { width: 72px; height: 72px; }
    .avatar-xl { width: 100px; height: 100px; }
    .avatar-2xl { width: 140px; height: 140px; }
    
    /* ─── Sidebar Layout ─── */
    .app-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: calc(100vh - 68px);
    }
    .sidebar {
      background: var(--bg2);
      border-right: 1px solid var(--border);
      padding: 24px 0;
      position: sticky;
      top: 68px;
      height: calc(100vh - 68px);
      overflow-y: auto;
    }
    .sidebar-nav { list-style: none; padding: 0 12px; }
    .sidebar-nav li a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text2);
      transition: all 0.2s;
    }
    .sidebar-nav li a:hover { color: var(--text); background: var(--bg3); }
    .sidebar-nav li a.active { color: var(--text); background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(157,91,245,0.15)); border: 1px solid rgba(124,58,237,0.25); }
    .sidebar-nav li a .nav-icon { width: 18px; text-align: center; }
    .sidebar-section { padding: 8px 24px 4px; font-size: 11px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 16px; }
    .main-content { padding: 32px; overflow-y: auto; }
    
    /* ─── Stats box ─── */
    .stat-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: var(--radius2);
      padding: 24px;
    }
    .stat-card:hover { border-color: var(--border2); }
    .stat-number { font-size: 32px; font-weight: 800; font-family: 'Space Grotesk', sans-serif; }
    .stat-label { font-size: 13px; color: var(--text2); font-weight: 500; }
    .stat-change { font-size: 12px; font-weight: 600; margin-top: 4px; }
    .stat-up { color: var(--green); }
    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    
    /* ─── Table ─── */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { border-bottom: 1px solid var(--border); }
    tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
    tbody tr:hover { background: rgba(255,255,255,0.02); }
    th { padding: 12px 16px; font-size: 12px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.06em; text-align: left; }
    td { padding: 14px 16px; font-size: 14px; }
    
    /* ─── Progress bar ─── */
    .progress-bar {
      height: 6px;
      background: var(--bg4);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent3));
      border-radius: 3px;
      transition: width 0.4s ease;
    }
    
    /* ─── Alert ─── */
    .alert {
      padding: 14px 18px;
      border-radius: 10px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .alert-info { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #93c5fd; }
    .alert-success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; }
    .alert-warning { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); color: #fcd34d; }
    
    /* ─── Notification dot ─── */
    .notif-dot {
      width: 8px; height: 8px;
      background: var(--accent2);
      border-radius: 50%;
      display: inline-block;
    }
    .notif-badge {
      background: var(--accent);
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 700;
      min-width: 18px;
      text-align: center;
    }
    
    /* ─── Hero gradient ─── */
    .hero-gradient {
      background: radial-gradient(ellipse at 50% -20%, rgba(124,58,237,0.25) 0%, transparent 70%),
                  radial-gradient(ellipse at 100% 50%, rgba(192,132,252,0.08) 0%, transparent 60%),
                  var(--bg);
    }
    
    /* ─── Glow effect ─── */
    .glow-purple { box-shadow: 0 0 60px rgba(124,58,237,0.2); }
    .glow-text { 
      background: linear-gradient(135deg, #fff 0%, #c4b5fd 50%, var(--accent3) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* ─── Verified badge ─── */
    .verified-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: var(--accent);
      border-radius: 50%;
      font-size: 10px;
      color: white;
      flex-shrink: 0;
    }
    
    /* ─── Mobile ─── */
    .mobile-only { display: none; }
    .hamburger-btn {
      display: none;
      background: none;
      border: none;
      color: var(--text);
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
    }
    
    @media (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
      .app-layout { grid-template-columns: 1fr; }
      .sidebar { display: none; }
      .sidebar.open { display: block; position: fixed; z-index: 200; top: 68px; left: 0; width: 240px; height: calc(100vh - 68px); }
      .hamburger-btn { display: block; }
    }
    @media (max-width: 768px) {
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
      .grid-4 { grid-template-columns: 1fr; }
      .section { padding: 60px 16px; }
      .main-content { padding: 20px 16px; }
      .nav-links { display: none; }
      h1 { font-size: 2rem !important; }
    }
    ${extra}
  </style>
</head>
<body>`;

export const nav = (active = '') => `
<nav class="nav">
  <a href="/" class="nav-logo">
    <div class="nav-logo-icon">🎵</div>
    Artist Collab
  </a>
  <ul class="nav-links">
    <li><a href="/explore" class="${active === 'explore' ? 'active' : ''}">Explore Artists</a></li>
    <li><a href="/marketplace" class="${active === 'marketplace' ? 'active' : ''}">Marketplace</a></li>
    <li><a href="/how-it-works">How It Works</a></li>
  </ul>
  <div class="nav-actions">
    <a href="/login" class="btn btn-ghost btn-sm">Login</a>
    <a href="/signup" class="btn btn-primary btn-sm">Join Free</a>
    <button class="hamburger-btn" onclick="toggleMobileSidebar()">
      <i class="fas fa-bars"></i>
    </button>
  </div>
</nav>`;

export const authedNav = (active = '', user?: { name: string; image: string; notifications?: number }) => `
<nav class="nav">
  <a href="/" class="nav-logo">
    <div class="nav-logo-icon">🎵</div>
    Artist Collab
  </a>
  <ul class="nav-links">
    <li><a href="/explore" class="${active === 'explore' ? 'active' : ''}">Explore Artists</a></li>
    <li><a href="/marketplace" class="${active === 'marketplace' ? 'active' : ''}">Marketplace</a></li>
    <li><a href="/dashboard/projects" class="${active === 'projects' ? 'active' : ''}">Projects</a></li>
    <li><a href="/dashboard/messages" class="${active === 'messages' ? 'active' : ''}">Messages ${user?.notifications ? `<span class="notif-badge">${user.notifications}</span>` : ''}</a></li>
  </ul>
  <div class="nav-actions">
    <a href="/dashboard" class="btn btn-ghost btn-sm"><i class="fas fa-chart-line"></i></a>
    <a href="/profile/me">
      <img src="${user?.image ?? 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=face'}" 
           class="avatar avatar-sm" style="border: 2px solid var(--border2); width:36px;height:36px;" alt="Profile">
    </a>
  </div>
</nav>`;

export const dashboardSidebar = (active = '') => `
<aside class="sidebar" id="sidebar">
  <div style="padding: 0 24px 24px; border-bottom: 1px solid var(--border);">
    <div style="display:flex;align-items:center;gap:12px;">
      <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=face" 
           class="avatar" style="width:44px;height:44px;border:2px solid var(--accent);" alt="User">
      <div>
        <div style="font-weight:700;font-size:14px;">XAVI</div>
        <div style="font-size:12px;color:var(--text2);">@xavi_official</div>
      </div>
    </div>
  </div>
  
  <div class="sidebar-section">Main</div>
  <ul class="sidebar-nav">
    <li><a href="/dashboard" class="${active === 'dashboard' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-th-large"></i></span> Dashboard
    </a></li>
    <li><a href="/dashboard/projects" class="${active === 'projects' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-layer-group"></i></span> Projects
      <span class="notif-badge" style="margin-left:auto;">2</span>
    </a></li>
    <li><a href="/dashboard/messages" class="${active === 'messages' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-comment-dots"></i></span> Messages
      <span class="notif-badge" style="margin-left:auto;">3</span>
    </a></li>
    <li><a href="/dashboard/orders" class="${active === 'orders' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-shopping-bag"></i></span> Orders
    </a></li>
    <li><a href="/dashboard/earnings" class="${active === 'earnings' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-dollar-sign"></i></span> Earnings
    </a></li>
  </ul>
  
  <div class="sidebar-section">My Work</div>
  <ul class="sidebar-nav">
    <li><a href="/profile/me" class="${active === 'profile' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-user"></i></span> My Profile
    </a></li>
    <li><a href="/dashboard/listings" class="${active === 'listings' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-list"></i></span> My Listings
    </a></li>
    <li><a href="/explore" class="${active === 'explore' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-search"></i></span> Explore Artists
    </a></li>
  </ul>
  
  <div class="sidebar-section">Account</div>
  <ul class="sidebar-nav">
    <li><a href="/dashboard/settings" class="${active === 'settings' ? 'active' : ''}">
      <span class="nav-icon"><i class="fas fa-cog"></i></span> Settings
    </a></li>
    <li><a href="/logout">
      <span class="nav-icon"><i class="fas fa-sign-out-alt"></i></span> Logout
    </a></li>
  </ul>
</aside>`;

export const footer = () => `
<footer style="background: var(--bg2); border-top: 1px solid var(--border); padding: 60px 24px 32px;">
  <div class="container">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;">
      <div>
        <div class="nav-logo mb-4" style="font-size:22px;">
          <div class="nav-logo-icon">🎵</div>
          Artist Collab
        </div>
        <p style="font-size:15px;color:var(--text2);line-height:1.7;max-width:300px;">
          The remote studio for independent artists. Collaborate anywhere. Create together.
        </p>
        <div style="display:flex;gap:12px;margin-top:20px;">
          <a href="#" style="width:36px;height:36px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:14px;transition:all 0.2s;" onmouseover="this.style.color='white';this.style.borderColor='rgba(255,255,255,0.2)'" onmouseout="this.style.color='var(--text2)';this.style.borderColor='var(--border)'"><i class="fab fa-instagram"></i></a>
          <a href="#" style="width:36px;height:36px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:14px;transition:all 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'"><i class="fab fa-twitter"></i></a>
          <a href="#" style="width:36px;height:36px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:14px;transition:all 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'"><i class="fab fa-tiktok"></i></a>
          <a href="#" style="width:36px;height:36px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:14px;transition:all 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
      <div>
        <h4 style="font-size:13px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Platform</h4>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <a href="/explore" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Explore Artists</a>
          <a href="/marketplace" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Marketplace</a>
          <a href="/how-it-works" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">How It Works</a>
          <a href="/signup" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Join as Artist</a>
          <a href="/pricing" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Pricing</a>
        </div>
      </div>
      <div>
        <h4 style="font-size:13px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Support</h4>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <a href="/contact" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Contact Us</a>
          <a href="/help" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Help Center</a>
          <a href="#" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">For Producers</a>
          <a href="#" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Trust & Safety</a>
        </div>
      </div>
      <div>
        <h4 style="font-size:13px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Legal</h4>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <a href="/terms" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Terms of Service</a>
          <a href="/privacy" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Privacy Policy</a>
          <a href="#" style="font-size:14px;color:var(--text2);transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text2)'">Cookie Policy</a>
        </div>
      </div>
    </div>
    <div style="border-top: 1px solid var(--border); padding-top: 24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <p style="font-size:13px;color:var(--text2);">© 2026 Artist Collab. All rights reserved. artistcollab.studio</p>
      <p style="font-size:13px;color:var(--text2);">Made for real artists. 🎵</p>
    </div>
  </div>
</footer>
<script>
function toggleMobileSidebar() {
  const s = document.getElementById('sidebar');
  if(s) s.classList.toggle('open');
}
</script>`;

export const closeHTML = () => `</body></html>`;
