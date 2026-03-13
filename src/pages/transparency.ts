import { shell, closeShell, authedNav, appSidebar } from '../layout';
import {
  users, projects, splitSheets, agreements,
  getUserById, getSplitSheetByProject, getAgreementByProject,
  statusColor, statusLabel, formatPrice, isSplitSheetFullyApproved, isReleaseGateOpen,
  splitSheetTotal, type Project, type SplitSheet,
} from '../data';

// ─── Styles ───────────────────────────────────────────────────────────────────
const TD_STYLES = `
  .td-page { padding: 24px 28px; max-width: 1200px; overflow-x: hidden; }
  .td-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .td-card-head {
    padding: 13px 18px;
    border-bottom: 1px solid var(--c-wire);
    background: var(--c-raised);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  .td-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .td-label::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 1px;
    background: currentColor;
  }
  /* Summary tiles */
  .td-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .td-tile {
    background: var(--c-panel); border: 1px solid var(--c-wire);
    border-radius: var(--r-lg); padding: 20px; position: relative; overflow: hidden;
    transition: border-color var(--t-base), transform var(--t-base);
  }
  .td-tile:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
  .td-tile-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .td-tile-val { font-family: var(--font-display); font-size: 1.75rem; font-weight: 800; letter-spacing: -0.04em; }
  .td-tile-lbl { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--t4); margin-top: 6px; }
  /* Project transparency row */
  .pt-row { border-bottom: 1px solid var(--c-wire); }
  .pt-row:last-child { border-bottom: none; }
  .pt-row-head {
    display: flex; align-items: center; gap: 14px; padding: 16px 18px;
    cursor: pointer; transition: background var(--t-fast); flex-wrap: wrap;
  }
  .pt-row-head:hover { background: var(--c-ghost); }
  .pt-body { padding: 0 18px 18px; display: none; }
  .pt-body.open { display: block; }
  /* Ownership mini-bar */
  .mini-split-bar { height: 6px; border-radius: 3px; overflow: hidden; display: flex; gap: 2px; }
  /* Status pill */
  .sp-approved { background: rgba(34,197,94,0.1);  color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
  .sp-pending  { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
  .sp-locked   { background: var(--signal-dim);    color: var(--signal); border: 1px solid rgba(200,255,0,0.2); }
  .sp-base { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: var(--r-full); font-family: var(--font-mono); font-size: 0.6rem; font-weight: 600; letter-spacing: 0.08em; }
  @media (max-width: 1024px) { .td-tiles { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px)  {
    .td-page { padding: 14px 16px; }
    .td-tiles { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .pt-row-head { padding: 12px 14px; }
    .td-card-head { padding: 10px 14px; }
  }
  @media (max-width: 480px)  { .td-tiles { grid-template-columns: 1fr 1fr; } }
`;

const BAR_COLORS = ['var(--signal)', 'var(--patch)', 'var(--warm)', 'var(--channel)', '#a78bfa'];

function miniSplitBar(splits: { percentage: number }[]): string {
  const total = splits.reduce((a, s) => a + (s.percentage || 0), 0);
  if (!total) return '';
  return splits.map((s, i) =>
    `<div style="flex:0 0 ${((s.percentage / total) * 100).toFixed(1)}%;background:${BAR_COLORS[i % BAR_COLORS.length]};"></div>`
  ).join('');
}

// ─── Transparency Dashboard Page ──────────────────────────────────────────────
export function transparencyPage(): string {
  const demoUser = users[0];

  // PGES: Defensive — always handle empty/missing data
  const userProjects = demoUser
    ? projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id)
    : [];

  // Aggregate stats
  const totalEscrow      = userProjects.filter(p => p.paymentStatus === 'held').reduce((a,p) => a + (p.orderTotal ?? 0), 0);
  const totalPaid        = userProjects.filter(p => p.paymentStatus === 'released').reduce((a,p) => a + (p.payoutAmount ?? 0), 0);
  const splitProjects    = userProjects.filter(p => p.collabType === 'ownership_split');
  const hireProjects     = userProjects.filter(p => p.collabType === 'pay_for_hire');
  const releasedProjects = userProjects.filter(p => isReleaseGateOpen(p)).length;

  // Collect all split sheets I'm on
  const mySplitSheets = splitSheets.filter(ss =>
    ss.collaborators.some(c => c.userId === demoUser?.id)
  );

  return shell('Transparency Dashboard', TD_STYLES)
    + authedNav('dashboard')
    + `<div class="app-shell">${appSidebar('dashboard')}<main class="app-main">
  <div class="td-page">

    <!-- Header -->
    <div style="margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div style="width:14px;height:1px;background:var(--signal);box-shadow:0 0 4px var(--signal-glow);"></div>
        <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--signal);letter-spacing:0.14em;text-transform:uppercase;">Transparency</span>
      </div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 style="font-family:var(--font-display);font-size:1.8rem;font-weight:800;letter-spacing:-0.03em;margin:0 0 6px;">Transparency Dashboard</h1>
          <p style="color:var(--t3);font-size:0.9375rem;margin:0;">Ownership percentages, collaborator approvals, payment status, and contributor roles — all in one place.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <a href="/split-sheets" class="btn btn-secondary btn-sm"><i class="fas fa-chart-pie" style="font-size:11px;"></i> Split Sheets</a>
          <a href="/nda" class="btn btn-secondary btn-sm"><i class="fas fa-file-contract" style="font-size:11px;"></i> NDA & Agreements</a>
        </div>
      </div>
    </div>

    <!-- Summary tiles -->
    <div class="td-tiles">
      ${[
        { val: formatPrice(totalEscrow), lbl: 'In Escrow',       color: 'var(--s-ok)',   icon: 'fa-vault',        sub: `${userProjects.filter(p=>p.paymentStatus==='held').length} active holds` },
        { val: formatPrice(totalPaid),  lbl: 'Total Paid Out',   color: 'var(--signal)', icon: 'fa-circle-dollar-to-slot', sub: `${userProjects.filter(p=>p.paymentStatus==='released').length} completed` },
        { val: splitProjects.length.toString(), lbl: 'Split Projects', color: 'var(--patch)', icon: 'fa-chart-pie', sub: 'ownership / royalty' },
        { val: releasedProjects.toString(), lbl: 'Release Gate Open', color: '#22c55e', icon: 'fa-unlock', sub: 'cleared for release' },
      ].map(t => `
      <div class="td-tile">
        <div class="td-tile-bar" style="background:${t.color};"></div>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">
          <div style="width:34px;height:34px;border-radius:var(--r-sm);background:${t.color}18;display:flex;align-items:center;justify-content:center;">
            <i class="fas ${t.icon}" style="color:${t.color};font-size:13px;"></i>
          </div>
        </div>
        <div class="td-tile-val" style="color:${t.color};">${t.val}</div>
        <div class="td-tile-lbl">${t.lbl}</div>
        <div style="font-size:0.75rem;color:var(--t4);margin-top:4px;">${t.sub}</div>
      </div>`).join('')}
    </div>

    <!-- Per-project breakdown -->
    <div class="td-card">
      <div class="td-card-head">
        <span class="td-label" style="color:var(--signal);">Project Breakdown</span>
        <span class="mono-sm" style="color:var(--t4);">${userProjects.length} project${userProjects.length !== 1 ? 's' : ''}</span>
      </div>

      ${userProjects.length === 0
        ? `<div style="padding:48px;text-align:center;">
             <i class="fas fa-layer-group" style="font-size:2.5rem;color:var(--t4);margin-bottom:12px;display:block;"></i>
             <p style="color:var(--t3);margin:0;">No projects yet. Start collaborating!</p>
           </div>`
        : userProjects.map((project, idx) => {
            const sc          = statusColor(project.status ?? '');
            const sl          = statusLabel(project.status ?? '');
            const ss          = getSplitSheetByProject(project.id);
            const ag          = getAgreementByProject(project.id);
            const releaseOpen = isReleaseGateOpen(project);
            const ssApproved  = ss ? isSplitSheetFullyApproved(ss) : false;
            const counterpartId = project.buyerId === demoUser?.id ? project.sellerId : project.buyerId;
            const counterpart   = getUserById(counterpartId);
            const isMyEscrow    = project.paymentStatus === 'held';
            const collabLabel   = project.collabType === 'ownership_split' ? 'Split' : 'For Hire';
            const collabColor   = project.collabType === 'ownership_split' ? 'var(--signal)' : 'var(--warm)';
            const releaseApprovals = project.releaseApprovals ?? [];
            const doneApprovals    = releaseApprovals.filter(a => a.approved).length;

            return `
          <div class="pt-row">
            <!-- Collapsed row header -->
            <div class="pt-row-head" onclick="togglePT('pt-${idx}')">
              <div style="width:38px;height:38px;border-radius:50%;overflow:hidden;border:1.5px solid var(--c-rim);flex-shrink:0;">
                <img src="${counterpart?.profileImage ?? 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40&h=40&fit=crop'}" style="width:100%;height:100%;object-fit:cover;" alt="${counterpart?.artistName ?? 'User'}">
              </div>

              <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:0.9375rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${project.title}</div>
                <div style="display:flex;align-items:center;gap:8px;margin-top:3px;flex-wrap:wrap;">
                  <span class="mono-sm" style="color:var(--t4);">with ${counterpart?.artistName ?? 'Unknown'}</span>
                  <span style="display:inline-flex;align-items:center;gap:4px;font-family:var(--font-mono);font-size:0.6rem;font-weight:600;padding:2px 7px;border-radius:var(--r-full);background:${collabColor}12;color:${collabColor};border:1px solid ${collabColor}22;">
                    <i class="fas ${project.collabType === 'ownership_split' ? 'fa-chart-pie' : 'fa-dollar-sign'}" style="font-size:8px;"></i>
                    ${collabLabel}
                  </span>
                </div>
              </div>

              <!-- Status + escrow -->
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;flex-shrink:0;">
                <span class="badge" style="background:${sc}18;color:${sc};border:1px solid ${sc}33;font-family:var(--font-mono);font-size:0.6rem;">${sl}</span>
                <div style="text-align:right;">
                  <div style="font-family:var(--font-display);font-size:1rem;font-weight:800;color:${isMyEscrow ? 'var(--s-ok)' : 'var(--t3)'};">${formatPrice(project.orderTotal)}</div>
                  <div class="mono-sm" style="color:var(--t4);">${project.paymentStatus}</div>
                </div>
              </div>

              <!-- Mini split bar if applicable -->
              ${ss ? `
              <div style="display:flex;flex-direction:column;gap:2px;flex-shrink:0;min-width:80px;">
                <div class="mini-split-bar">${miniSplitBar(ss.masterOwnership)}</div>
                <div class="mono-sm" style="color:var(--t4);">Master split</div>
              </div>` : ''}

              <!-- Release gate icon -->
              <div style="width:32px;height:32px;border-radius:50%;background:${releaseOpen ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;" title="${releaseOpen ? 'Release gate open' : 'Release gate locked'}">
                <i class="fas ${releaseOpen ? 'fa-unlock' : 'fa-lock'}" style="color:${releaseOpen ? '#22c55e' : '#f59e0b'};font-size:12px;"></i>
              </div>

              <i class="fas fa-chevron-down" id="chevron-pt-${idx}" style="color:var(--t4);font-size:11px;flex-shrink:0;transition:transform 0.2s;"></i>
            </div>

            <!-- Expanded body -->
            <div id="pt-${idx}" class="pt-body">

              <!-- Four columns: Ownership · Approvals · Escrow · NDA/Agreement -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:16px;">

                <!-- Ownership -->
                <div style="padding:14px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);">
                  <div class="mono-sm" style="color:var(--t4);margin-bottom:10px;">MASTER OWNERSHIP</div>
                  ${ss ? ss.masterOwnership.map((s, i) => {
                    const u = getUserById(s.userId);
                    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;font-size:0.8125rem;">
                      <div style="display:flex;align-items:center;gap:6px;">
                        <div style="width:8px;height:8px;border-radius:50%;background:${BAR_COLORS[i % BAR_COLORS.length]};flex-shrink:0;"></div>
                        <span style="color:var(--t3);">${u?.artistName ?? 'Unknown'}</span>
                      </div>
                      <span style="font-family:var(--font-mono);font-weight:700;color:var(--signal);">${s.percentage}%</span>
                    </div>`;
                  }).join('') : `<p style="font-size:0.8125rem;color:var(--t4);margin:0;">${project.collabType === 'pay_for_hire' ? 'Pay-for-hire — buyer retains full ownership.' : 'No split sheet yet.'}</p>`}
                </div>

                <!-- Publishing -->
                <div style="padding:14px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);">
                  <div class="mono-sm" style="color:var(--t4);margin-bottom:10px;">PUBLISHING</div>
                  ${ss ? ss.publishingOwnership.map((s, i) => {
                    const u = getUserById(s.userId);
                    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;font-size:0.8125rem;">
                      <div style="display:flex;align-items:center;gap:6px;">
                        <div style="width:8px;height:8px;border-radius:50%;background:${BAR_COLORS[i % BAR_COLORS.length]};flex-shrink:0;"></div>
                        <span style="color:var(--t3);">${u?.artistName ?? 'Unknown'}</span>
                      </div>
                      <span style="font-family:var(--font-mono);font-weight:700;color:var(--patch);">${s.percentage}%</span>
                    </div>`;
                  }).join('') : `<p style="font-size:0.8125rem;color:var(--t4);margin:0;">${project.collabType === 'pay_for_hire' ? 'N/A — work-for-hire.' : 'No split sheet yet.'}</p>`}
                </div>

                <!-- Collaborator Approvals -->
                <div style="padding:14px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);">
                  <div class="mono-sm" style="color:var(--t4);margin-bottom:10px;">APPROVALS</div>
                  ${(ss?.collaborators ?? []).map(c => {
                    const u = getUserById(c.userId);
                    const pillCls = c.approvalStatus === 'approved' ? 'sp-approved' : c.approvalStatus === 'rejected' ? 'sp-base' : 'sp-pending';
                    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;font-size:0.8125rem;">
                      <span style="color:var(--t3);">${u?.artistName ?? 'Unknown'}</span>
                      <span class="sp-base ${pillCls}">${c.approvalStatus}</span>
                    </div>`;
                  }).join('') || `<p style="font-size:0.8125rem;color:var(--t4);margin:0;">No split sheet.</p>`}
                  <!-- Release approvals -->
                  <div class="mono-sm" style="color:var(--t4);margin-top:10px;margin-bottom:5px;">RELEASE APPROVALS (${doneApprovals}/${releaseApprovals.length})</div>
                  ${releaseApprovals.map(ra => {
                    const u = getUserById(ra.userId);
                    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;font-size:0.8125rem;">
                      <span style="color:var(--t3);">${u?.artistName ?? 'Unknown'}</span>
                      <span class="sp-base ${ra.approved ? 'sp-approved' : 'sp-pending'}">${ra.approved ? 'Approved' : 'Pending'}</span>
                    </div>`;
                  }).join('')}
                </div>

                <!-- Payment & NDA -->
                <div style="padding:14px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);">
                  <div class="mono-sm" style="color:var(--t4);margin-bottom:10px;">PAYMENT & LEGAL</div>
                  ${[
                    {label:'Escrow',     val:formatPrice(project.orderTotal), color: isMyEscrow ? 'var(--s-ok)' : 'var(--t3)'},
                    {label:'Platform fee', val:formatPrice(project.platformFee ?? 0), color:'var(--t3)'},
                    {label:'Payout',     val:formatPrice(project.payoutAmount ?? 0), color:'var(--signal)'},
                    {label:'Status',     val:project.paymentStatus, color:'var(--t3)'},
                    {label:'NDA',        val:ag?.ndaSignedByAll ? 'Signed' : 'Pending', color:ag?.ndaSignedByAll ? '#22c55e' : '#f59e0b'},
                    {label:'Agreement',  val:ag?.status ?? 'None', color:'var(--t3)'},
                  ].map(d => `
                  <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.8125rem;">
                    <span style="color:var(--t4);">${d.label}</span>
                    <span style="font-weight:600;color:${d.color};">${d.val}</span>
                  </div>`).join('')}
                </div>

              </div>

              <!-- Action row -->
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <a href="/workspace/${project.id}" class="btn btn-primary btn-sm">
                  <i class="fas fa-layer-group" style="font-size:11px;"></i> Open Workspace
                </a>
                ${ss ? `<a href="/split-sheet/${ss.id}" class="btn btn-secondary btn-sm">
                  <i class="fas fa-chart-pie" style="font-size:11px;"></i> Split Sheet
                </a>` : ''}
                ${ag ? `<a href="/agreement/${project.id}" class="btn btn-secondary btn-sm">
                  <i class="fas fa-file-contract" style="font-size:11px;"></i> Agreement
                </a>` : ''}
                ${releaseOpen ? `<button class="btn btn-primary btn-sm" onclick="alert('Proceeding to distribution channel.')">
                  <i class="fas fa-paper-plane" style="font-size:11px;"></i> Proceed to Release
                </button>` : ''}
              </div>
            </div>
          </div>`;
        }).join('')
      }
    </div>

    <!-- Split Sheet Summary -->
    ${mySplitSheets.length > 0 ? `
    <div class="td-card">
      <div class="td-card-head">
        <span class="td-label" style="color:var(--patch);">My Split Sheets Summary</span>
        <a href="/split-sheets" class="btn btn-ghost btn-xs" style="color:var(--t3);">View All →</a>
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.8125rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--c-wire);">
              <th style="padding:10px 16px;text-align:left;font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;">Song</th>
              <th style="padding:10px 16px;text-align:left;font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;">Status</th>
              <th style="padding:10px 16px;text-align:left;font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;">My Master %</th>
              <th style="padding:10px 16px;text-align:left;font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;">My Publishing %</th>
              <th style="padding:10px 16px;text-align:left;font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;">Release</th>
              <th style="padding:10px 16px;text-align:right;font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;"></th>
            </tr>
          </thead>
          <tbody>
            ${mySplitSheets.map(ss => {
              const myMaster    = ss.masterOwnership.find(s => s.userId === demoUser?.id);
              const myPublish   = ss.publishingOwnership.find(s => s.userId === demoUser?.id);
              const ssApproved  = isSplitSheetFullyApproved(ss);
              const statusCfg: Record<string,{cls:string;label:string}> = {
                draft:            { cls:'sp-pending',  label:'Draft' },
                pending_approval: { cls:'sp-pending',  label:'Pending' },
                approved:         { cls:'sp-approved', label:'Approved' },
                locked:           { cls:'sp-locked',   label:'Locked' },
              };
              const sc2 = statusCfg[ss.status] ?? { cls:'sp-pending', label:ss.status };
              return `
              <tr style="border-bottom:1px solid var(--c-wire);">
                <td style="padding:12px 16px;">
                  <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px;">${ss.songTitle}</div>
                  <div class="mono-sm" style="color:var(--t4);">${ss.createdAt}</div>
                </td>
                <td style="padding:12px 16px;">
                  <span class="sp-base ${sc2.cls}">${sc2.label}</span>
                </td>
                <td style="padding:12px 16px;">
                  <span style="font-family:var(--font-mono);font-size:1rem;font-weight:800;color:var(--signal);">${myMaster ? myMaster.percentage + '%' : '—'}</span>
                </td>
                <td style="padding:12px 16px;">
                  <span style="font-family:var(--font-mono);font-size:1rem;font-weight:800;color:var(--patch);">${myPublish ? myPublish.percentage + '%' : '—'}</span>
                </td>
                <td style="padding:12px 16px;">
                  <span class="sp-base ${ss.releasable ? 'sp-approved' : 'sp-pending'}">
                    <i class="fas ${ss.releasable ? 'fa-unlock' : 'fa-lock'}" style="font-size:8px;"></i>
                    ${ss.releasable ? 'Open' : 'Locked'}
                  </span>
                </td>
                <td style="padding:12px 16px;text-align:right;">
                  <a href="/split-sheet/${ss.id}" class="btn btn-ghost btn-xs" style="color:var(--t3);">View →</a>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    <!-- Platform-wide NDA & Agreement Status -->
    <div class="td-card">
      <div class="td-card-head">
        <span class="td-label" style="color:var(--warm);">Legal & IP Protection Status</span>
      </div>
      <div style="padding:18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;">

        ${[
          {
            icon: 'fa-shield-halved',
            title: 'Platform NDA',
            status: demoUser?.ndaStatus === 'signed' ? 'Signed' : 'Required',
            detail: demoUser?.ndaStatus === 'signed' ? `Signed ${demoUser.ndaSignedAt ?? 'on file'}` : 'Click to sign',
            color: demoUser?.ndaStatus === 'signed' ? '#22c55e' : '#f59e0b',
            link: '/nda',
          },
          {
            icon: 'fa-file-contract',
            title: 'Platform Agreement',
            status: demoUser?.platformAgreementSigned ? 'Active' : 'Pending',
            detail: demoUser?.platformAgreementSigned ? `Signed ${demoUser.platformAgreementSignedAt ?? 'on file'}` : 'Review & sign',
            color: demoUser?.platformAgreementSigned ? '#22c55e' : '#f59e0b',
            link: '/nda',
          },
          {
            icon: 'fa-music',
            title: 'PRO Affiliation',
            status: demoUser?.proAffiliation && demoUser.proAffiliation !== 'None' ? demoUser.proAffiliation : 'Not set',
            detail: demoUser?.proIpiNumber ? `IPI: ${demoUser.proIpiNumber}` : 'Set in settings',
            color: demoUser?.proAffiliation && demoUser.proAffiliation !== 'None' ? 'var(--patch)' : '#f59e0b',
            link: '/nda',
          },
        ].map(item => `
        <a href="${item.link}" style="display:flex;gap:12px;padding:14px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);text-decoration:none;transition:all var(--t-fast);" onmouseover="this.style.borderColor='rgba(255,255,255,0.1)'" onmouseout="this.style.borderColor='var(--c-wire)'">
          <div style="width:38px;height:38px;border-radius:var(--r-sm);background:${item.color}12;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas ${item.icon}" style="color:${item.color};font-size:1rem;"></i>
          </div>
          <div>
            <div style="font-weight:700;font-size:0.875rem;color:var(--t1);margin-bottom:2px;">${item.title}</div>
            <div style="font-size:0.8125rem;font-weight:600;color:${item.color};">${item.status}</div>
            <div class="mono-sm" style="color:var(--t4);">${item.detail}</div>
          </div>
        </a>`).join('')}

      </div>
    </div>

  </div>
</main></div>

<script>
function togglePT(id) {
  var el = document.getElementById(id);
  var idx = id.replace('pt-', '');
  var chevron = document.getElementById('chevron-' + id);
  if (!el) return;
  var isOpen = el.classList.contains('open');
  el.classList.toggle('open', !isOpen);
  if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}
</script>`
    + closeShell();
}
