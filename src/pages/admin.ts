import { head, closeHTML } from '../layout';

export function adminPage(): string {
  return head('Admin Panel') + `
<style>
.admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
.admin-sidebar { background: #0d0d14; border-right: 1px solid var(--border); padding: 0; }
.admin-header { padding: 20px; border-bottom: 1px solid var(--border); }
.admin-nav { list-style: none; padding: 12px; }
.admin-nav li a { display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;font-size:13px;font-weight:500;color:var(--text2);transition:all 0.2s; }
.admin-nav li a:hover, .admin-nav li a.active { color:white;background:rgba(124,58,237,0.2); }
.admin-nav .nav-section { padding:10px 12px 4px;font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.1em;margin-top:8px; }
.admin-main { padding: 32px; background: var(--bg); }
</style>

<div class="admin-layout">
  <!-- Admin Sidebar -->
  <div class="admin-sidebar">
    <div class="admin-header">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:linear-gradient(135deg,var(--red),#f97316);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;">⚡</div>
        <div>
          <div style="font-weight:700;font-size:13px;">Admin Panel</div>
          <div style="font-size:11px;color:var(--text2);">Artist Collab</div>
        </div>
      </div>
    </div>
    <ul class="admin-nav">
      <li><a href="/admin" class="active"><i class="fas fa-th-large" style="width:14px;"></i> Overview</a></li>
      <li class="nav-section">Management</li>
      <li><a href="/admin/users"><i class="fas fa-users" style="width:14px;"></i> Users</a></li>
      <li><a href="/admin/listings"><i class="fas fa-list" style="width:14px;"></i> Listings</a></li>
      <li><a href="/admin/orders"><i class="fas fa-shopping-bag" style="width:14px;"></i> Orders</a></li>
      <li><a href="/admin/payments"><i class="fas fa-dollar-sign" style="width:14px;"></i> Payments</a></li>
      <li class="nav-section">Moderation</li>
      <li><a href="/admin/disputes"><i class="fas fa-exclamation-triangle" style="width:14px;"></i> Disputes</a></li>
      <li><a href="/admin/verification"><i class="fas fa-check-circle" style="width:14px;"></i> Verification</a></li>
      <li><a href="/admin/reports"><i class="fas fa-flag" style="width:14px;"></i> Reports</a></li>
      <li class="nav-section">Platform</li>
      <li><a href="/admin/featured"><i class="fas fa-star" style="width:14px;"></i> Featured Artists</a></li>
      <li><a href="/admin/settings"><i class="fas fa-cog" style="width:14px;"></i> Settings</a></li>
      <li style="margin-top:16px;padding:12px;"><a href="/" style="color:var(--text2);font-size:13px;"><i class="fas fa-arrow-left" style="margin-right:6px;"></i> Back to Platform</a></li>
    </ul>
  </div>
  
  <!-- Admin Main -->
  <div class="admin-main">
    <div style="margin-bottom:32px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.8rem;margin-bottom:4px;">Platform Overview</h1>
          <p style="color:var(--text2);font-size:14px;">Last updated: March 13, 2026 at 10:32 AM</p>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Export Report</button>
          <button class="btn btn-primary btn-sm"><i class="fas fa-sync"></i> Refresh</button>
        </div>
      </div>
    </div>
    
    <!-- Key Metrics -->
    <div class="grid-4 mb-8">
      ${[
        { label: 'Total Users', value: '12,483', change: '+284 this week', icon: 'fas fa-users', color: 'var(--accent3)', bg: 'rgba(124,58,237,0.15)' },
        { label: 'Active Projects', value: '1,847', change: '+63 today', icon: 'fas fa-layer-group', color: 'var(--blue)', bg: 'rgba(59,130,246,0.15)' },
        { label: 'Total Revenue', value: '$284K', change: '+$12,400 this week', icon: 'fas fa-dollar-sign', color: 'var(--green)', bg: 'rgba(16,185,129,0.15)' },
        { label: 'Pending Review', value: '23', change: '8 flagged, 5 disputes', icon: 'fas fa-flag', color: 'var(--gold)', bg: 'rgba(245,158,11,0.15)' },
      ].map(s => `
      <div class="stat-card" style="cursor:pointer;" onmouseover="this.style.borderColor='rgba(255,255,255,0.15)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <div class="stat-icon" style="background:${s.bg};"><i class="${s.icon}" style="color:${s.color};"></i></div>
        </div>
        <div class="stat-number" style="color:${s.color};">${s.value}</div>
        <div class="stat-label">${s.label}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:4px;">${s.change}</div>
      </div>`).join('')}
    </div>
    
    <div class="grid-2 mb-6">
      <!-- Recent Users -->
      <div class="card">
        <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-size:16px;">Recent Signups</h3>
          <a href="/admin/users" class="btn btn-ghost btn-sm">View All</a>
        </div>
        <div style="padding:8px 0;">
          ${[
            { name: 'TRAP MELODY', type: 'Artist', location: 'Miami, FL', joined: '2 hours ago', status: 'active' },
            { name: 'BASSLINE K', type: 'Producer', location: 'London, UK', joined: '5 hours ago', status: 'active' },
            { name: 'VOCAL MAYA', type: 'Artist', location: 'Atlanta, GA', joined: '1 day ago', status: 'pending_verify' },
            { name: 'SOUNDSCAPE', type: 'Producer', location: 'Toronto, CA', joined: '2 days ago', status: 'active' },
            { name: 'R&B JAYE', type: 'Artist', location: 'LA, CA', joined: '3 days ago', status: 'flagged' },
          ].map(u => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.04);transition:background 0.15s;cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background=''">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent3));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;flex-shrink:0;">${u.name[0]}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:14px;">${u.name}</div>
              <div style="font-size:12px;color:var(--text2);">${u.type} · ${u.location}</div>
            </div>
            <div style="text-align:right;">
              <span class="badge ${u.status === 'active' ? 'badge-green' : u.status === 'flagged' ? 'badge-red' : 'badge-gold'}" style="font-size:10px;">${u.status === 'active' ? 'Active' : u.status === 'flagged' ? 'Flagged' : 'Pending'}</span>
              <div style="font-size:11px;color:var(--text2);margin-top:3px;">${u.joined}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>
      
      <!-- Recent Orders -->
      <div class="card">
        <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-size:16px;">Recent Orders</h3>
          <a href="/admin/orders" class="btn btn-ghost btn-sm">View All</a>
        </div>
        <div style="padding:8px 0;">
          ${[
            { title: 'Hook Feature', buyer: 'DRIP KAYO', seller: 'NOVA LEE', amount: '$900', status: 'in_progress' },
            { title: 'Trap Beat Custom', buyer: 'CIPHER 7', seller: 'BEATSMITH', amount: '$350', status: 'delivered' },
            { title: '16-Bar Verse', buyer: 'R&B JAYE', seller: 'XAVI', amount: '$600', status: 'completed' },
            { title: 'Afrobeats Feature', buyer: 'BASSLINE K', seller: 'KALI ROSE', amount: '$750', status: 'pending' },
            { title: 'Pop Hook Writing', buyer: 'TRAP MELODY', seller: 'MELODICA', amount: '$400', status: 'in_progress' },
          ].map(o => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.04);transition:background 0.15s;cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background=''">
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:14px;">${o.title}</div>
              <div style="font-size:12px;color:var(--text2);">${o.buyer} → ${o.seller}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700;font-size:14px;color:var(--accent3);">${o.amount}</div>
              <span class="badge" style="font-size:10px;background:${o.status === 'completed' ? 'rgba(34,197,94,0.15)' : o.status === 'delivered' ? 'rgba(16,185,129,0.15)' : o.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)'};color:${o.status === 'completed' ? '#86efac' : o.status === 'delivered' ? '#6ee7b7' : o.status === 'pending' ? '#fcd34d' : '#a5b4fc'};">
                ${o.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    
    <!-- Verification Queue -->
    <div class="card mb-6">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
        <h3 style="font-size:16px;">Verification Queue</h3>
        <span class="badge badge-gold">3 pending</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Artist</th><th>Type</th><th>Location</th><th>Monthly Listeners</th><th>Submitted</th><th>Actions</th></tr></thead>
          <tbody>
            ${[
              { name: 'CIPHER 7', type: 'Artist', location: 'Chicago, IL', listeners: '67K', submitted: 'Mar 11' },
              { name: 'DRIP KAYO', type: 'Artist', location: 'Houston, TX', listeners: '89K', submitted: 'Mar 12' },
              { name: 'BASSLINE K', type: 'Producer', location: 'London, UK', listeners: '112K', submitted: 'Mar 13' },
            ].map(a => `
            <tr>
              <td><div style="font-weight:600;">${a.name}</div></td>
              <td><span class="badge badge-gray" style="font-size:11px;">${a.type}</span></td>
              <td><span style="font-size:13px;color:var(--text2);">${a.location}</span></td>
              <td><span style="font-weight:600;">${a.listeners}</span></td>
              <td><span style="font-size:13px;color:var(--text2);">${a.submitted}</span></td>
              <td>
                <div style="display:flex;gap:8px;">
                  <button class="btn btn-green btn-sm" onclick="alert('✅ ${a.name} verified!')"><i class="fas fa-check"></i> Approve</button>
                  <button class="btn btn-secondary btn-sm" onclick="alert('Review more info for ${a.name}')"><i class="fas fa-eye"></i> Review</button>
                  <button class="btn btn-secondary btn-sm" onclick="alert('${a.name} verification denied')"><i class="fas fa-times"></i> Deny</button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Featured Artists Management -->
    <div class="card">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
        <h3 style="font-size:16px;">Featured Artists (Homepage)</h3>
        <button class="btn btn-primary btn-sm" onclick="alert('Select artists to feature on the homepage')"><i class="fas fa-plus"></i> Add Featured</button>
      </div>
      <div style="padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;">
        ${['XAVI', 'NOVA LEE', 'BEATSMITH', 'KALI ROSE'].map(name => `
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center;">
          <div style="font-weight:700;margin-bottom:4px;">${name}</div>
          <span class="badge badge-gold" style="font-size:10px;"><i class="fas fa-star"></i> Featured</span>
          <div style="margin-top:10px;">
            <button class="btn btn-secondary btn-sm" style="width:100%" onclick="alert('Remove ${name} from featured')">Remove</button>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>
` + closeHTML();
}
