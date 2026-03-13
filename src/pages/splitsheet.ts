import { shell, closeShell, authedNav, appSidebar } from '../layout';
import {
  users, splitSheets, agreements, ndaRecords,
  getUserById, getSplitSheetById, getSplitSheetByProject, getAgreementByProject,
  formatPrice, isSplitSheetFullyApproved, splitSheetTotal,
  type SplitSheet, type CollaborationAgreement, type User,
} from '../data';

// ─── Shared styles ────────────────────────────────────────────────────────────
const SS_STYLES = `
  .ss-page { padding: 24px 28px; max-width: 1100px; overflow-x: hidden; }
  .ss-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .ss-card-head {
    padding: 14px 20px;
    border-bottom: 1px solid var(--c-wire);
    background: var(--c-raised);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .ss-head-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--signal);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ss-head-label::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 1px;
    background: var(--signal);
    box-shadow: 0 0 4px var(--signal-glow);
  }
  .collab-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--c-wire);
    flex-wrap: wrap;
  }
  .collab-row:last-child { border-bottom: none; }
  .split-bar-track {
    height: 8px;
    border-radius: 4px;
    background: var(--c-rim);
    overflow: hidden;
    margin: 6px 0 2px;
    position: relative;
  }
  .approval-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: var(--r-full);
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
  }
  .pill-approved { background: rgba(34,197,94,0.12); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); }
  .pill-pending  { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
  .pill-rejected { background: rgba(239,68,68,0.12);  color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
  .pill-locked   { background: var(--signal-dim);      color: var(--signal); border: 1px solid rgba(200,255,0,0.25); }
  .ownership-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 18px 20px;
  }
  .ownership-section h4 {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--t4);
    margin: 0 0 12px;
  }
  .split-entry {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--c-wire);
    font-size: 0.8125rem;
  }
  .split-entry:last-child { border-bottom: none; }
  .split-pct {
    font-family: var(--font-mono);
    font-size: 1rem;
    font-weight: 700;
    color: var(--signal);
  }
  .nda-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: var(--r-full);
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .nda-signed   { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
  .nda-unsigned { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
  .release-gate {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    flex-wrap: wrap;
  }
  .gate-open   { border-top: 3px solid #22c55e; }
  .gate-closed { border-top: 3px solid #f59e0b; }
  .gate-icon {
    width: 44px; height: 44px;
    border-radius: var(--r-md);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .gate-icon-open   { background: rgba(34,197,94,0.12);  color: #22c55e; }
  .gate-icon-closed { background: rgba(245,158,11,0.12); color: #f59e0b; }
  @media (max-width: 768px) {
    .ss-page { padding: 14px 16px; }
    .ownership-grid { grid-template-columns: 1fr; gap: 8px; }
    .collab-row { gap: 10px; }
    .ss-card-head { padding: 12px 14px; }
  }
  @media (max-width: 480px) {
    .split-pct { font-size: 0.875rem; }
  }
`;

// ─── Colour palette for ownership bars ───────────────────────────────────────
const BAR_COLORS = ['var(--signal)', 'var(--patch)', 'var(--warm)', 'var(--channel)', '#a78bfa', '#34d399'];

function ownershipBar(splits: { userId: string; percentage: number; role: string }[]): string {
  if (!Array.isArray(splits) || splits.length === 0) return '';
  const total = splitSheetTotal(splits);
  if (total === 0) return '';
  return `
    <div style="display:flex;height:10px;border-radius:5px;overflow:hidden;gap:2px;margin:8px 0;">
      ${splits.map((s, i) => {
        const pct = (s.percentage / total) * 100;
        const user = getUserById(s.userId);
        const color = BAR_COLORS[i % BAR_COLORS.length];
        return `<div title="${user?.artistName ?? 'Unknown'} — ${s.percentage}%" style="flex:0 0 ${pct.toFixed(1)}%;background:${color};transition:flex 0.4s ease;"></div>`;
      }).join('')}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px;">
      ${splits.map((s, i) => {
        const user = getUserById(s.userId);
        const color = BAR_COLORS[i % BAR_COLORS.length];
        return `<span style="display:flex;align-items:center;gap:5px;font-size:0.75rem;color:var(--t3);">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>
          ${user?.artistName ?? 'Unknown'} <span style="color:var(--t4);">${s.percentage}%</span>
        </span>`;
      }).join('')}
    </div>`;
}

// ─── Single Split Sheet Page ──────────────────────────────────────────────────
export function splitSheetPage(splitSheetId: string): string {
  // PGES: Defensive lookup
  const ss = getSplitSheetById(splitSheetId);
  if (!ss) {
    return shell('Split Sheet Not Found', SS_STYLES)
      + authedNav('projects')
      + `<div class="app-shell">${appSidebar('projects')}<main class="app-main">
          <div style="padding:60px 24px;text-align:center;">
            <i class="fas fa-file-contract" style="font-size:3rem;color:var(--t4);margin-bottom:16px;display:block;"></i>
            <h2 style="font-family:var(--font-display);font-size:1.5rem;color:var(--t2);margin-bottom:8px;">Split Sheet Not Found</h2>
            <p style="color:var(--t4);margin-bottom:24px;">This split sheet may have been removed or the link is invalid.</p>
            <a href="/dashboard/projects" class="btn btn-secondary btn-sm">← Back to Projects</a>
          </div>
        </main></div>`
      + closeShell();
  }

  const fully = isSplitSheetFullyApproved(ss);
  const masterTotal = splitSheetTotal(ss.masterOwnership);
  const pubTotal    = splitSheetTotal(ss.publishingOwnership);

  const statusCfg: Record<string, { label: string; cls: string; icon: string }> = {
    draft:            { label: 'Draft',            cls: 'pill-pending',  icon: 'fa-pencil' },
    pending_approval: { label: 'Pending Approval', cls: 'pill-pending',  icon: 'fa-clock' },
    approved:         { label: 'All Approved',     cls: 'pill-approved', icon: 'fa-check-circle' },
    locked:           { label: 'Locked',           cls: 'pill-locked',   icon: 'fa-lock' },
  };
  const sc = statusCfg[ss.status] ?? { label: ss.status, cls: 'pill-pending', icon: 'fa-circle' };

  return shell(`Split Sheet — ${ss.songTitle}`, SS_STYLES)
    + authedNav('projects')
    + `<div class="app-shell">${appSidebar('projects')}<main class="app-main">
    <div class="ss-page">

      <!-- Back + title -->
      <div style="margin-bottom:20px;">
        <a href="/dashboard/projects" style="font-size:0.8125rem;color:var(--t3);display:inline-flex;align-items:center;gap:6px;margin-bottom:14px;">
          <i class="fas fa-arrow-left" style="font-size:10px;"></i> Back to Projects
        </a>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <h1 style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;letter-spacing:-0.03em;margin:0 0 6px;">${ss.songTitle}</h1>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <span class="approval-pill ${sc.cls}"><i class="fas ${sc.icon}" style="font-size:9px;"></i> ${sc.label}</span>
              <span class="mono-sm" style="color:var(--t4);">ID: ${ss.id.toUpperCase()} · Created ${ss.createdAt}</span>
              ${ss.lockedAt ? `<span class="mono-sm" style="color:var(--t4);">Locked ${ss.lockedAt}</span>` : ''}
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="window.print()">
              <i class="fas fa-print" style="font-size:11px;"></i> Print PDF
            </button>
            <button class="btn btn-primary btn-sm" onclick="alert('Split sheet export initiated. PDF will download momentarily.')">
              <i class="fas fa-download" style="font-size:11px;"></i> Export
            </button>
          </div>
        </div>
      </div>

      <!-- Release gate banner -->
      <div class="ss-card ${ss.releasable ? 'gate-open' : 'gate-closed'}">
        <div class="release-gate">
          <div class="gate-icon ${ss.releasable ? 'gate-icon-open' : 'gate-icon-closed'}">
            <i class="fas ${ss.releasable ? 'fa-unlock' : 'fa-lock'}"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:0.9375rem;margin-bottom:3px;">
              ${ss.releasable ? 'Release Gate — OPEN' : 'Release Gate — LOCKED'}
            </div>
            <div style="font-size:0.8125rem;color:var(--t3);">
              ${ss.releasable
                ? 'All collaborators have approved this split sheet. This song may now be exported and released.'
                : 'Waiting for all collaborators to approve. Song export and release is blocked until every party signs off.'}
            </div>
          </div>
          ${ss.releasable
            ? `<button class="btn btn-primary btn-sm" onclick="alert('Song approved for release. ISRC and distribution channels unlocked.')">
                 <i class="fas fa-paper-plane" style="font-size:11px;"></i> Proceed to Release
               </button>`
            : `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.5;cursor:not-allowed;">
                 <i class="fas fa-lock" style="font-size:11px;"></i> Awaiting Approvals
               </button>`}
        </div>
      </div>

      <!-- Collaborators & Approvals -->
      <div class="ss-card">
        <div class="ss-card-head">
          <span class="ss-head-label">Collaborators & Approvals</span>
          <span class="mono-sm" style="color:var(--t4);">
            ${ss.collaborators.filter(c => c.approvalStatus === 'approved').length} / ${ss.collaborators.length} approved
          </span>
        </div>
        ${ss.collaborators.map((c, i) => {
          const user = getUserById(c.userId);
          const name = user?.artistName ?? `User ${c.userId}`;
          const img  = user?.profileImage ?? 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop';
          const pillCls = c.approvalStatus === 'approved' ? 'pill-approved' : c.approvalStatus === 'rejected' ? 'pill-rejected' : 'pill-pending';
          const pillIcon = c.approvalStatus === 'approved' ? 'fa-check' : c.approvalStatus === 'rejected' ? 'fa-times' : 'fa-clock';
          const pillLabel = c.approvalStatus === 'approved' ? 'Approved' : c.approvalStatus === 'rejected' ? 'Rejected' : 'Pending';
          return `
          <div class="collab-row">
            <img src="${img}" class="av av-sm" style="border:1.5px solid var(--c-rim);flex-shrink:0;" alt="${name}">
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:0.875rem;">${name}</div>
              <div style="display:flex;align-items:center;gap:8px;margin-top:3px;flex-wrap:wrap;">
                <span class="mono-sm" style="color:var(--t4);">${c.role}</span>
                <span style="color:var(--c-rim);">·</span>
                <span class="mono-sm" style="color:var(--patch);">${c.proAffiliation}</span>
                ${c.ipiNumber ? `<span style="color:var(--c-rim);">·</span><span class="mono-sm" style="color:var(--t4);">IPI: ${c.ipiNumber}</span>` : ''}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
              <span class="approval-pill ${pillCls}">
                <i class="fas ${pillIcon}" style="font-size:8px;"></i> ${pillLabel}
              </span>
              ${c.approvedAt ? `<span class="mono-sm" style="color:var(--t4);">${c.approvedAt}</span>` : ''}
              ${c.approvalStatus === 'pending' && i === 0
                ? `<button class="btn btn-primary btn-xs" style="margin-top:4px;" onclick="alert('Approval recorded. All parties will be notified.')">
                     <i class="fas fa-check" style="font-size:9px;"></i> Approve Now
                   </button>`
                : ''}
            </div>
          </div>`;
        }).join('')}
      </div>

      <!-- Ownership splits -->
      <div class="ss-card">
        <div class="ss-card-head">
          <span class="ss-head-label">Ownership Splits</span>
          <div style="display:flex;gap:8px;align-items:center;">
            ${masterTotal === 100
              ? `<span class="approval-pill pill-approved"><i class="fas fa-check" style="font-size:8px;"></i> Balanced</span>`
              : `<span class="approval-pill pill-pending"><i class="fas fa-exclamation" style="font-size:8px;"></i> Master ${masterTotal}% / Pub ${pubTotal}%</span>`}
          </div>
        </div>
        <div class="ownership-grid">
          <!-- Master ownership -->
          <div class="ownership-section">
            <h4>Master Recording Ownership</h4>
            ${ownershipBar(ss.masterOwnership)}
            ${ss.masterOwnership.map(s => {
              const user = getUserById(s.userId);
              return `
              <div class="split-entry">
                <div style="display:flex;align-items:center;gap:8px;">
                  <img src="${user?.profileImage ?? 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=32&h=32&fit=crop'}"
                    class="av av-xs" style="border:1px solid var(--c-rim);" alt="${user?.artistName ?? 'Unknown'}">
                  <div>
                    <div style="font-weight:600;font-size:0.8125rem;">${user?.artistName ?? `User ${s.userId}`}</div>
                    <div class="mono-sm" style="color:var(--t4);">${s.role}</div>
                  </div>
                </div>
                <span class="split-pct">${s.percentage}%</span>
              </div>`;
            }).join('')}
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:0.75rem;color:var(--t4);">
              <span>Total</span>
              <span style="font-weight:700;color:${masterTotal === 100 ? '#22c55e' : '#f59e0b'};">${masterTotal}%</span>
            </div>
          </div>

          <!-- Publishing ownership -->
          <div class="ownership-section">
            <h4>Publishing / Songwriting Ownership</h4>
            ${ownershipBar(ss.publishingOwnership)}
            ${ss.publishingOwnership.map(s => {
              const user = getUserById(s.userId);
              return `
              <div class="split-entry">
                <div style="display:flex;align-items:center;gap:8px;">
                  <img src="${user?.profileImage ?? 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=32&h=32&fit=crop'}"
                    class="av av-xs" style="border:1px solid var(--c-rim);" alt="${user?.artistName ?? 'Unknown'}">
                  <div>
                    <div style="font-weight:600;font-size:0.8125rem;">${user?.artistName ?? `User ${s.userId}`}</div>
                    <div class="mono-sm" style="color:var(--t4);">${s.role}</div>
                  </div>
                </div>
                <span class="split-pct">${s.percentage}%</span>
              </div>`;
            }).join('')}
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:0.75rem;color:var(--t4);">
              <span>Total</span>
              <span style="font-weight:700;color:${pubTotal === 100 ? '#22c55e' : '#f59e0b'};">${pubTotal}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes & metadata -->
      ${ss.notes ? `
      <div class="ss-card">
        <div class="ss-card-head"><span class="ss-head-label">Notes</span></div>
        <div style="padding:16px 20px;font-size:0.875rem;color:var(--t3);line-height:1.6;">${ss.notes}</div>
      </div>` : ''}

    </div>
  </main></div>`
    + closeShell();
}

// ─── All Split Sheets (dashboard section) ────────────────────────────────────
export function splitSheetsListPage(): string {
  const demoUser = users[0];

  // PGES: Defensive — always handle empty array
  const userSheets = splitSheets.filter(ss =>
    ss.collaborators.some(c => c.userId === demoUser?.id)
  );

  return shell('Split Sheets', SS_STYLES)
    + authedNav('projects')
    + `<div class="app-shell">${appSidebar('projects')}<main class="app-main">
    <div class="ss-page">

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <div>
          <div class="sec-label" style="margin-bottom:6px;">
            <span class="sec-label-bar"></span>
            <span class="sec-label-text">Split Sheets</span>
          </div>
          <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.03em;margin:0;">
            My Split Sheets
          </h1>
        </div>
        <button class="btn btn-primary btn-sm" onclick="alert('New Split Sheet wizard — coming in full release.')">
          <i class="fas fa-plus" style="font-size:11px;"></i> New Split Sheet
        </button>
      </div>

      ${userSheets.length === 0
        ? `<div style="padding:48px;text-align:center;background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);">
             <i class="fas fa-file-contract" style="font-size:2.5rem;color:var(--t4);margin-bottom:16px;display:block;"></i>
             <p style="color:var(--t3);margin:0;">No split sheets yet. They're created automatically when you start an ownership split project.</p>
           </div>`
        : userSheets.map(ss => {
            const fully  = isSplitSheetFullyApproved(ss);
            const appCnt = ss.collaborators.filter(c => c.approvalStatus === 'approved').length;
            const total  = ss.collaborators.length;
            const statusCfg: Record<string, { label: string; cls: string }> = {
              draft:            { label: 'Draft',            cls: 'pill-pending'  },
              pending_approval: { label: 'Pending Approval', cls: 'pill-pending'  },
              approved:         { label: 'All Approved',     cls: 'pill-approved' },
              locked:           { label: 'Locked',           cls: 'pill-locked'   },
            };
            const sc = statusCfg[ss.status] ?? { label: ss.status, cls: 'pill-pending' };
            return `
            <div class="ss-card" style="cursor:pointer;" onclick="window.location='/split-sheet/${ss.id}'">
              <div style="padding:18px 20px;">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap;">
                  <div>
                    <div style="font-weight:700;font-size:0.9375rem;margin-bottom:4px;">${ss.songTitle}</div>
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                      <span class="approval-pill ${sc.cls}" style="font-size:0.6rem;">${sc.label}</span>
                      <span class="mono-sm" style="color:var(--t4);">${ss.createdAt}</span>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div style="text-align:right;">
                      <div style="font-family:var(--font-mono);font-size:1.1rem;font-weight:700;color:${appCnt === total ? '#22c55e' : 'var(--t1)'};">${appCnt}/${total}</div>
                      <div class="mono-sm" style="color:var(--t4);">approved</div>
                    </div>
                    <div style="width:36px;height:36px;border-radius:50%;background:${ss.releasable ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)'};
                                display:flex;align-items:center;justify-content:center;">
                      <i class="fas ${ss.releasable ? 'fa-unlock' : 'fa-lock'}" style="color:${ss.releasable ? '#22c55e' : '#f59e0b'};font-size:13px;"></i>
                    </div>
                  </div>
                </div>

                <!-- Collaborator avatars -->
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
                  <span class="mono-sm" style="color:var(--t4);">Collaborators:</span>
                  <div style="display:flex;align-items:center;">
                    ${ss.collaborators.map((c, i) => {
                      const u = getUserById(c.userId);
                      return `<img src="${u?.profileImage ?? ''}" class="av av-xs"
                        style="border:2px solid var(--c-panel);margin-left:${i > 0 ? '-6px' : '0'};position:relative;z-index:${10 - i};"
                        alt="${u?.artistName ?? 'Collaborator'}" title="${u?.artistName ?? 'Unknown'} — ${c.approvalStatus}">`;
                    }).join('')}
                  </div>
                </div>

                <!-- Mini ownership bars -->
                <div style="display:flex;gap:16px;flex-wrap:wrap;">
                  <div style="flex:1;min-width:120px;">
                    <div class="mono-sm" style="color:var(--t4);margin-bottom:4px;">Master</div>
                    ${ownershipBar(ss.masterOwnership)}
                  </div>
                  <div style="flex:1;min-width:120px;">
                    <div class="mono-sm" style="color:var(--t4);margin-bottom:4px;">Publishing</div>
                    ${ownershipBar(ss.publishingOwnership)}
                  </div>
                </div>
              </div>
            </div>`;
          }).join('')
      }

    </div>
  </main></div>`
    + closeShell();
}

// ─── NDA & Platform Agreement Page ───────────────────────────────────────────
export function ndaPage(): string {
  const demoUser = users[0];
  const isSigned = demoUser?.ndaStatus === 'signed';
  const isPlatformSigned = demoUser?.platformAgreementSigned === true;

  const NDA_TEXT = `
    <strong>ARTIST COLLAB MUTUAL NON-DISCLOSURE AGREEMENT</strong>
    <br>Version 2.1 — Effective upon electronic signature<br><br>

    This Mutual Non-Disclosure Agreement ("Agreement") is entered into between each party who accesses
    unreleased creative material on the Artist Collab platform ("Platform"), including but not limited to
    musical compositions, sound recordings, lyrics, stems, demos, and session recordings
    (collectively, "Confidential Information").<br><br>

    <strong>1. DEFINITION OF CONFIDENTIAL INFORMATION</strong><br>
    Confidential Information includes all unreleased audio files, stems, lyrics, song titles, project
    concepts, beat structures, melodic ideas, and any other creative material shared within a project
    workspace on this Platform, regardless of whether it is marked "confidential."<br><br>

    <strong>2. OBLIGATIONS</strong><br>
    Each party agrees to: (a) hold all Confidential Information in strict confidence; (b) not disclose,
    reproduce, distribute, or exploit any Confidential Information without prior written consent;
    (c) not sample, interpolate, or otherwise use any Confidential Information in their own work without
    an executed collaboration agreement; (d) notify the other party immediately upon discovery of any
    unauthorized disclosure.<br><br>

    <strong>3. TERM</strong><br>
    This Agreement remains in force for the duration of each collaboration project plus five (5) years
    after project completion or termination.<br><br>

    <strong>4. IP OWNERSHIP</strong><br>
    Nothing in this Agreement transfers or grants any intellectual property rights. Ownership is
    exclusively governed by each project's Collaboration Agreement and Split Sheet.<br><br>

    <strong>5. PLATFORM AGREEMENT</strong><br>
    By signing, you also confirm acceptance of the Artist Collab Platform Agreement, including the 10%
    platform fee on escrow transactions, dispute resolution procedures, and community standards.<br><br>

    <strong>6. REMEDIES</strong><br>
    Breach of this Agreement may result in account suspension, removal from the Platform, and civil
    liability for damages including lost royalties, licensing revenue, and legal fees.<br><br>

    <strong>7. GOVERNING LAW</strong><br>
    This Agreement shall be governed by the laws of the State of California, USA. Disputes shall be
    resolved through binding arbitration administered by JAMS.<br><br>

    <em>By clicking "I Agree & Sign," you confirm that you have read, understood, and agree to be bound
    by this Agreement. Your electronic signature is legally binding under the Electronic Signatures in
    Global and National Commerce Act (E-SIGN Act).</em>
  `;

  return shell('NDA & Platform Agreement', `
    .nda-page { max-width: 780px; margin: 0 auto; padding: 32px 24px; }
    .nda-doc {
      background: var(--c-panel);
      border: 1px solid var(--c-wire);
      border-radius: var(--r-lg);
      padding: 28px 32px;
      font-size: 0.875rem;
      line-height: 1.7;
      color: var(--t3);
      max-height: 360px;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    .nda-doc strong { color: var(--t1); }
    .sign-block {
      background: var(--c-raised);
      border: 1px solid var(--c-wire);
      border-radius: var(--r-lg);
      padding: 24px;
      margin-bottom: 16px;
    }
    @media (max-width: 768px) {
      .nda-page { padding: 16px; }
      .nda-doc { padding: 16px; }
      .sign-block { padding: 16px; }
    }
  `)
    + authedNav('settings')
    + `<div class="app-shell">${appSidebar('settings')}<main class="app-main">
    <div class="nda-page">

      <div style="margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <div style="width:14px;height:1px;background:var(--signal);box-shadow:0 0 4px var(--signal-glow);"></div>
          <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--signal);letter-spacing:0.14em;text-transform:uppercase;">Legal</span>
        </div>
        <h1 style="font-family:var(--font-display);font-size:1.8rem;font-weight:800;letter-spacing:-0.03em;margin:0 0 8px;">
          NDA & Platform Agreement
        </h1>
        <p style="color:var(--t3);font-size:0.9375rem;margin:0;">
          Required before accessing project workspaces and sharing unreleased material.
        </p>
      </div>

      <!-- Status banners -->
      ${isSigned && isPlatformSigned
        ? `<div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:var(--r-lg);margin-bottom:20px;">
             <i class="fas fa-shield-halved" style="color:#22c55e;font-size:1.1rem;flex-shrink:0;"></i>
             <div>
               <div style="font-weight:700;color:#22c55e;margin-bottom:2px;">All Agreements Signed</div>
               <div style="font-size:0.8125rem;color:var(--t3);">NDA signed ${demoUser?.ndaSignedAt ?? 'on file'} · Platform Agreement active · Your IP is protected.</div>
             </div>
           </div>`
        : `<div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:var(--r-lg);margin-bottom:20px;">
             <i class="fas fa-triangle-exclamation" style="color:#f59e0b;font-size:1.1rem;flex-shrink:0;"></i>
             <div>
               <div style="font-weight:700;color:#f59e0b;margin-bottom:2px;">Signature Required</div>
               <div style="font-size:0.8125rem;color:var(--t3);">Sign the NDA and Platform Agreement to unlock project workspaces and collab features.</div>
             </div>
           </div>`
      }

      <!-- NDA Document -->
      <div style="margin-bottom:6px;display:flex;align-items:center;gap:8px;">
        <i class="fas fa-file-contract" style="color:var(--patch);font-size:0.875rem;"></i>
        <span style="font-weight:600;font-size:0.875rem;">Artist Collab NDA v2.1</span>
      </div>
      <div class="nda-doc">${NDA_TEXT}</div>

      <!-- Signing block -->
      <div class="sign-block">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
          <div>
            <div style="font-weight:700;font-size:0.9375rem;margin-bottom:4px;">Electronic Signature</div>
            <div style="font-size:0.8125rem;color:var(--t3);">Signing as: <strong style="color:var(--t1);">${demoUser?.artistName ?? 'Unknown'}</strong> (${demoUser?.email ?? ''})</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="nda-badge ${isSigned ? 'nda-signed' : 'nda-unsigned'}">
              <i class="fas ${isSigned ? 'fa-check-circle' : 'fa-clock'}" style="font-size:9px;"></i>
              NDA ${isSigned ? 'Signed' : 'Pending'}
            </span>
            <span class="nda-badge ${isPlatformSigned ? 'nda-signed' : 'nda-unsigned'}">
              <i class="fas ${isPlatformSigned ? 'fa-check-circle' : 'fa-clock'}" style="font-size:9px;"></i>
              Platform ${isPlatformSigned ? 'Signed' : 'Pending'}
            </span>
          </div>
        </div>

        ${isSigned && isPlatformSigned
          ? `<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:var(--r-md);">
               <i class="fas fa-check-circle" style="color:#22c55e;"></i>
               <div>
                 <div style="font-size:0.875rem;font-weight:600;color:#22c55e;">Signed on ${demoUser?.ndaSignedAt ?? 'file'}</div>
                 <div class="mono-sm" style="color:var(--t4);">Electronic signature recorded · IP: 203.0.113.42 · Version 2.1</div>
               </div>
             </div>`
          : `<div>
               <label style="display:flex;align-items:flex-start;gap:10px;margin-bottom:16px;cursor:pointer;">
                 <input type="checkbox" id="nda-agree" style="width:18px;height:18px;margin-top:1px;accent-color:var(--signal);flex-shrink:0;">
                 <span style="font-size:0.875rem;color:var(--t3);line-height:1.5;">
                   I have read and agree to the Artist Collab NDA v2.1 and Platform Agreement. I understand
                   that my electronic signature is legally binding under the E-SIGN Act.
                 </span>
               </label>
               <button class="btn btn-primary" onclick="
                 if(document.getElementById('nda-agree').checked){
                   alert('NDA and Platform Agreement signed successfully. Your account is now fully verified and project workspaces are unlocked.');
                 } else {
                   alert('Please check the agreement box to confirm you have read and understood the NDA.');
                 }
               ">
                 <i class="fas fa-signature" style="font-size:12px;"></i>
                 I Agree &amp; Sign
               </button>
             </div>`
        }
      </div>

      <!-- PRO Affiliation block -->
      <div class="sign-block">
        <div style="font-weight:700;font-size:0.9375rem;margin-bottom:4px;">PRO Affiliation</div>
        <div style="font-size:0.8125rem;color:var(--t3);margin-bottom:14px;">
          Your Performing Rights Organization registration is used on split sheets and licensing agreements.
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:500px;">
          <div>
            <label style="font-size:0.75rem;color:var(--t4);display:block;margin-bottom:6px;">PRO Organization</label>
            <select style="width:100%;background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-md);padding:10px 12px;color:var(--t1);font-family:var(--font-body);font-size:0.875rem;">
              ${['ASCAP','BMI','SESAC','GMR','SOCAN','PRS','GEMA','SACEM','APRA','None'].map(p =>
                `<option value="${p}" ${demoUser?.proAffiliation === p ? 'selected' : ''}>${p}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:0.75rem;color:var(--t4);display:block;margin-bottom:6px;">IPI / CAE Number</label>
            <input type="text" value="${demoUser?.proIpiNumber ?? ''}" placeholder="00000000000"
              style="width:100%;background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-md);padding:10px 12px;color:var(--t1);font-family:var(--font-mono);font-size:0.875rem;box-sizing:border-box;">
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" style="margin-top:14px;" onclick="alert('PRO information saved.')">
          Save PRO Info
        </button>
      </div>

    </div>
  </main></div>`
    + closeShell();
}

// ─── Collaboration Agreement Page ─────────────────────────────────────────────
export function agreementPage(projectId: string): string {
  const ag = getAgreementByProject(projectId);
  if (!ag) {
    return shell('Agreement Not Found', SS_STYLES)
      + authedNav('projects')
      + `<div class="app-shell">${appSidebar('projects')}<main class="app-main">
          <div style="padding:60px 24px;text-align:center;">
            <h2 style="font-family:var(--font-display);color:var(--t2);">Agreement Not Found</h2>
            <a href="/dashboard/projects" class="btn btn-secondary btn-sm" style="margin-top:16px;">← Back to Projects</a>
          </div>
        </main></div>`
      + closeShell();
  }

  const ss = ag.splitSheetId ? splitSheets.find(s => s.id === ag.splitSheetId) : null;
  const typeLabel = ag.collabType === 'pay_for_hire' ? 'Pay-for-Hire' : 'Ownership / Royalty Split';
  const typeColor = ag.collabType === 'pay_for_hire' ? 'var(--warm)' : 'var(--signal)';

  return shell('Collaboration Agreement', SS_STYLES)
    + authedNav('projects')
    + `<div class="app-shell">${appSidebar('projects')}<main class="app-main">
    <div class="ss-page">

      <div style="margin-bottom:20px;">
        <a href="/dashboard/projects" style="font-size:0.8125rem;color:var(--t3);display:inline-flex;align-items:center;gap:6px;margin-bottom:14px;">
          <i class="fas fa-arrow-left" style="font-size:10px;"></i> Back to Projects
        </a>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <h1 style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;letter-spacing:-0.03em;margin:0 0 8px;">Collaboration Agreement</h1>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:var(--r-full);border:1px solid;font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.08em;color:${typeColor};border-color:${typeColor}33;background:${typeColor}12;">
                <i class="fas ${ag.collabType === 'pay_for_hire' ? 'fa-dollar-sign' : 'fa-chart-pie'}" style="font-size:9px;"></i>
                ${typeLabel}
              </span>
              <span class="approval-pill ${ag.status === 'completed' ? 'pill-approved' : ag.status === 'active' ? 'pill-approved' : 'pill-pending'}">${ag.status}</span>
              <span class="mono-sm" style="color:var(--t4);">ID: ${ag.id.toUpperCase()} · ${ag.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Signatories -->
      <div class="ss-card">
        <div class="ss-card-head">
          <span class="ss-head-label">Signatories</span>
          <span class="mono-sm" style="color:var(--t4);">
            ${ag.signatories.filter(s => s.signed).length}/${ag.signatories.length} signed
          </span>
        </div>
        ${ag.signatories.map(sig => {
          const user = getUserById(sig.userId);
          return `
          <div class="collab-row">
            <img src="${user?.profileImage ?? ''}" class="av av-sm" style="border:1.5px solid var(--c-rim);" alt="${user?.artistName ?? 'User'}">
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:0.875rem;">${user?.artistName ?? `User ${sig.userId}`}</div>
              <div class="mono-sm" style="color:var(--t4);">@${user?.username ?? sig.userId}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
              <span class="approval-pill ${sig.signed ? 'pill-approved' : 'pill-pending'}">
                <i class="fas ${sig.signed ? 'fa-signature' : 'fa-clock'}" style="font-size:8px;"></i>
                ${sig.signed ? 'Signed' : 'Pending'}
              </span>
              ${sig.signedAt ? `<span class="mono-sm" style="color:var(--t4);">${sig.signedAt}</span>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>

      <!-- NDA status -->
      <div class="ss-card">
        <div class="ss-card-head"><span class="ss-head-label">Non-Disclosure Agreement</span></div>
        <div style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <i class="fas fa-shield-halved" style="color:${ag.ndaSignedByAll ? '#22c55e' : '#f59e0b'};font-size:1.1rem;"></i>
            <div>
              <div style="font-weight:600;font-size:0.875rem;">${ag.ndaSignedByAll ? 'NDA Signed by All Parties' : 'NDA Pending'}</div>
              <div class="mono-sm" style="color:var(--t4);">${ag.ndaSignedByAll ? 'All parties have executed the NDA. IP is protected.' : 'All parties must sign the NDA before files can be shared.'}</div>
            </div>
          </div>
          <a href="/nda" class="btn btn-secondary btn-sm">View NDA →</a>
        </div>
      </div>

      <!-- Agreement terms -->
      <div class="ss-card">
        <div class="ss-card-head"><span class="ss-head-label">Agreement Terms</span></div>
        <div style="padding:18px 20px;">
          <p style="font-size:0.875rem;color:var(--t3);line-height:1.7;margin:0 0 16px;">${ag.terms}</p>
          ${ag.agreedAmount
            ? `<div style="display:flex;align-items:center;gap:8px;padding:12px 16px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);">
                 <i class="fas fa-dollar-sign" style="color:var(--warm);"></i>
                 <span style="font-weight:600;">Agreed Amount: <span style="color:var(--warm);">${formatPrice(ag.agreedAmount)}</span></span>
               </div>`
            : ''}
          ${ss
            ? `<div style="margin-top:12px;padding:12px 16px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.2);border-radius:var(--r-md);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                 <div style="display:flex;align-items:center;gap:8px;">
                   <i class="fas fa-file-contract" style="color:var(--signal);"></i>
                   <span style="font-weight:600;font-size:0.875rem;">Linked Split Sheet: ${ss.id.toUpperCase()}</span>
                 </div>
                 <a href="/split-sheet/${ss.id}" class="btn btn-primary btn-xs">View Split Sheet →</a>
               </div>`
            : ''}
        </div>
      </div>

    </div>
  </main></div>`
    + closeShell();
}
