import { head, nav, footer, closeHTML } from '../layout';

export function howItWorksPage(): string {
  return head('How It Works') + nav() + `
<section style="padding:80px 24px;background:radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%);">
  <div class="container text-center">
    <div class="badge badge-purple mb-4">How It Works</div>
    <h1 style="font-size:3rem;margin-bottom:20px;">Music Collaboration,<br>Finally Organized</h1>
    <p style="font-size:18px;color:var(--text2);max-width:580px;margin:0 auto;">
      Artist Collab handles everything from discovery to payment — so you can focus on making the music.
    </p>
  </div>
</section>

<section class="section" style="background:var(--bg2);">
  <div class="container">
    ${[
      {
        step: '01', icon: '🔍', title: 'Discover the Right Collaborator',
        desc: 'Browse our curated marketplace of independent artists, rappers, singers, songwriters, and producers. Filter by genre, location, price, verified status, and more. Every profile shows real work history, ratings, and sample tracks.',
        features: ['Advanced search filters', 'Verified artist badges', 'Rating & review system', 'Portfolio samples'],
        img: 'right',
        extra: 'Thousands of verified artists across every genre — Hip-Hop, R&B, Trap, Afrobeats, Pop, Drill, and more.'
      },
      {
        step: '02', icon: '📦', title: 'Book a Feature Package',
        desc: 'Select from clearly priced packages — Basic, Standard, or Premium. See exactly what\'s included: delivery time, number of revisions, file formats, and add-ons. No negotiating, no confusion. Book in under 5 minutes.',
        features: ['Transparent package pricing', 'Clear delivery timelines', 'Multiple revision options', 'Add-on customization'],
        img: 'left',
        extra: 'Submit your project notes, upload a reference track, and pay securely through Stripe-powered checkout.'
      },
      {
        step: '03', icon: '🏠', title: 'Work Inside Your Private Workspace',
        desc: 'The moment you book, a private collaboration workspace is automatically created. This is your secure home base for the entire project — messaging, file uploads, status tracking, and delivery.',
        features: ['Private in-platform messaging', 'Secure stem locker', 'Real-time status tracking', 'Activity & version history'],
        img: 'right',
        extra: 'Never lose a stem or lose track of a conversation again. Everything lives in one organized space.'
      },
      {
        step: '04', icon: '🔒', title: 'Pay Securely, Receive Confidently',
        desc: 'Your payment is held in platform escrow from the moment you book. It only releases to the artist when you accept the delivery. If something\'s not right, request a revision. If there\'s a dispute, our team steps in.',
        features: ['Platform-held escrow payment', 'Revision requests protected', 'Dispute resolution support', 'Transparent platform fee'],
        img: 'left',
        extra: 'Artists receive fast payouts once delivery is accepted. Buyers are always protected.'
      },
    ].map((section, i) => `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-bottom:80px;${section.img === 'left' ? 'direction:rtl;' : ''}">
      <div style="direction:ltr;">
        <div style="font-size:12px;font-weight:700;color:var(--accent3);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px;">Step ${section.step}</div>
        <h2 style="font-size:2rem;margin-bottom:16px;">${section.icon} ${section.title}</h2>
        <p style="font-size:16px;color:var(--text2);line-height:1.8;margin-bottom:24px;">${section.desc}</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
          ${section.features.map(f => `
          <div style="display:flex;align-items:center;gap:10px;">
            <i class="fas fa-check-circle" style="color:var(--green);flex-shrink:0;"></i>
            <span style="font-size:15px;">${f}</span>
          </div>`).join('')}
        </div>
        <p style="font-size:14px;color:var(--text2);background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);padding:14px 18px;border-radius:10px;line-height:1.7;font-style:italic;">"${section.extra}"</p>
      </div>
      <div style="direction:ltr;">
        <div class="card" style="padding:32px;background:linear-gradient(135deg,rgba(124,58,237,0.1),rgba(30,30,40,0.8));border-color:rgba(124,58,237,0.2);">
          <div style="font-size:64px;text-align:center;margin-bottom:20px;">${section.icon}</div>
          <div style="font-size:40px;font-weight:900;font-family:'Space Grotesk',sans-serif;color:var(--accent3);text-align:center;">${section.step}</div>
          <div style="font-size:18px;font-weight:700;text-align:center;margin-top:8px;">${section.title}</div>
        </div>
      </div>
    </div>`).join('')}
  </div>
</section>

<section style="padding:80px 24px;background:linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(192,132,252,0.08) 100%);border-top:1px solid rgba(124,58,237,0.2);">
  <div class="container text-center">
    <h2 style="font-size:2.4rem;margin-bottom:20px;">Ready to Start Collaborating?</h2>
    <p style="font-size:18px;color:var(--text2);margin-bottom:40px;max-width:500px;margin-left:auto;margin-right:auto;">Join thousands of artists building their catalog remotely on Artist Collab.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/signup" class="btn btn-primary btn-xl"><i class="fas fa-rocket"></i> Join as Artist — Free</a>
      <a href="/explore" class="btn btn-outline btn-xl"><i class="fas fa-search"></i> Browse Artists</a>
    </div>
  </div>
</section>
` + footer() + closeHTML();
}

export function termsPage(): string {
  return head('Terms of Service') + nav() + `
<section style="padding:60px 24px;">
  <div class="container-xs">
    <h1 style="font-size:2rem;margin-bottom:8px;">Terms of Service</h1>
    <p style="color:var(--text2);margin-bottom:40px;">Last updated: March 2026 · artistcollab.studio</p>
    ${[
      { title: 'Acceptance of Terms', body: 'By accessing or using Artist Collab ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.' },
      { title: 'Platform Purpose', body: 'Artist Collab provides a marketplace and collaboration platform for independent music artists, producers, and creators to discover, book, communicate, and exchange creative services and files.' },
      { title: 'Payment & Escrow', body: 'All payments are processed through Stripe and held in platform escrow until a project is marked as delivered and accepted by the buyer. Artist Collab charges a 10% platform fee on all transactions. Payouts are released within 3-5 business days after delivery acceptance.' },
      { title: 'Content & Files', body: 'All files, stems, and deliverables shared on the platform remain the intellectual property of their respective creators unless otherwise agreed in writing. Artist Collab does not claim ownership of any creative works shared through the platform.' },
      { title: 'User Conduct', body: 'Users agree not to misrepresent their identity or credentials, use the platform for fraudulent transactions, share copyrighted material without authorization, or engage in harassment of other platform users.' },
      { title: 'Dispute Resolution', body: 'In the event of a dispute between buyer and seller, Artist Collab will review the project history, communications, and deliverables. Our team will make a fair determination based on the available evidence.' },
      { title: 'Account Termination', body: 'Artist Collab reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or repeatedly receive unresolved complaints.' },
    ].map(section => `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:18px;margin-bottom:12px;color:var(--accent3);">${section.title}</h2>
      <p style="font-size:15px;color:var(--text2);line-height:1.8;">${section.body}</p>
    </div>`).join('')}
    <div style="margin-top:40px;padding-top:32px;border-top:1px solid var(--border);">
      <p style="font-size:14px;color:var(--text2);">Questions? Contact us at <a href="mailto:legal@artistcollab.studio" style="color:var(--accent3);">legal@artistcollab.studio</a></p>
    </div>
  </div>
</section>
` + footer() + closeHTML();
}

export function privacyPage(): string {
  return head('Privacy Policy') + nav() + `
<section style="padding:60px 24px;">
  <div class="container-xs">
    <h1 style="font-size:2rem;margin-bottom:8px;">Privacy Policy</h1>
    <p style="color:var(--text2);margin-bottom:40px;">Last updated: March 2026 · artistcollab.studio</p>
    ${[
      { title: 'Information We Collect', body: 'We collect information you provide when creating a profile (name, email, genre, location, social links), payment information processed through Stripe (we never store raw card data), and usage data about how you interact with the platform.' },
      { title: 'How We Use Your Information', body: 'Your information is used to operate the platform, process payments, enable communication between users, display your public artist profile, and send platform notifications related to your projects and bookings.' },
      { title: 'Data Sharing', body: 'We do not sell your personal data to third parties. We share data only with Stripe for payment processing, and may share information with law enforcement if required by law.' },
      { title: 'File Security', body: 'All files uploaded to the platform are stored securely and are only accessible to the participants of the relevant project. We use industry-standard encryption for all file storage and transmission.' },
      { title: 'Your Rights', body: 'You have the right to access, update, or delete your personal data at any time. Contact privacy@artistcollab.studio to exercise these rights. European users have additional rights under GDPR.' },
      { title: 'Cookies', body: 'We use essential cookies for authentication and session management. We do not use tracking cookies for advertising purposes. You can control cookie settings through your browser.' },
    ].map(section => `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:18px;margin-bottom:12px;color:var(--accent3);">${section.title}</h2>
      <p style="font-size:15px;color:var(--text2);line-height:1.8;">${section.body}</p>
    </div>`).join('')}
    <div style="margin-top:40px;padding-top:32px;border-top:1px solid var(--border);">
      <p style="font-size:14px;color:var(--text2);">Privacy questions? Contact us at <a href="mailto:privacy@artistcollab.studio" style="color:var(--accent3);">privacy@artistcollab.studio</a></p>
    </div>
  </div>
</section>
` + footer() + closeHTML();
}

export function contactPage(): string {
  return head('Contact') + nav() + `
<section style="padding:80px 24px;">
  <div class="container-xs">
    <div class="text-center mb-8">
      <div class="badge badge-purple mb-4">Contact Us</div>
      <h1 style="font-size:2.4rem;margin-bottom:16px;">Get In Touch</h1>
      <p style="font-size:16px;color:var(--text2);">Have a question, issue, or partnership inquiry? We're here to help.</p>
    </div>
    <div class="grid-2 mb-8">
      ${[
        { icon: 'fas fa-headset', title: 'Artist Support', desc: 'Need help with a project or booking?', contact: 'support@artistcollab.studio', color: 'var(--accent3)' },
        { icon: 'fas fa-handshake', title: 'Partnerships', desc: 'Labels, distributors, or brand deals', contact: 'partners@artistcollab.studio', color: 'var(--gold)' },
      ].map(c => `
      <div class="card p-6 text-center">
        <div style="width:52px;height:52px;border-radius:16px;background:${c.color}22;border:1px solid ${c.color}44;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:22px;color:${c.color};">
          <i class="${c.icon}"></i>
        </div>
        <h3 style="margin-bottom:8px;">${c.title}</h3>
        <p style="font-size:14px;color:var(--text2);margin-bottom:12px;">${c.desc}</p>
        <a href="mailto:${c.contact}" style="color:var(--accent3);font-size:14px;">${c.contact}</a>
      </div>`).join('')}
    </div>
    <div class="card p-8">
      <h2 style="font-size:1.4rem;margin-bottom:24px;">Send a Message</h2>
      <div class="grid-2 mb-4">
        <div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" placeholder="Your name"></div>
        <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" placeholder="you@example.com"></div>
      </div>
      <div class="form-group mb-4"><label class="form-label">Subject</label><input type="text" class="form-input" placeholder="What's this about?"></div>
      <div class="form-group mb-6"><label class="form-label">Message</label><textarea class="form-input" placeholder="Tell us what's on your mind..." rows="5"></textarea></div>
      <button class="btn btn-primary btn-lg" onclick="this.innerHTML='<i class=\"fas fa-check\"></i> Message Sent!';this.disabled=true;"><i class="fas fa-paper-plane"></i> Send Message</button>
    </div>
  </div>
</section>
` + footer() + closeHTML();
}

export function settingsPage(): string {
  return head('Settings') + nav() + `
<section style="padding:60px 24px;">
  <div class="container-sm">
    <h1 style="font-size:1.8rem;margin-bottom:32px;">Account Settings</h1>
    <div style="display:grid;grid-template-columns:200px 1fr;gap:32px;align-items:start;">
      <div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:4px;">
          ${['Profile', 'Account', 'Notifications', 'Privacy', 'Payments', 'Security'].map((s, i) => `
          <li><a href="#${s.toLowerCase()}" style="display:block;padding:10px 14px;border-radius:8px;font-size:14px;font-weight:${i===0?'600':'500'};color:${i===0?'var(--text)':'var(--text2)'};background:${i===0?'var(--bg3)':'transparent'};transition:all 0.2s;">${s}</a></li>`).join('')}
        </ul>
      </div>
      <div style="display:flex;flex-direction:column;gap:24px;">
        <div class="card p-6">
          <h2 style="font-size:18px;margin-bottom:24px;">Public Profile</h2>
          <div class="form-group mb-4"><label class="form-label">Artist Name</label><input type="text" class="form-input" value="XAVI"></div>
          <div class="form-group mb-4"><label class="form-label">Username</label><div style="position:relative;"><span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text2);">@</span><input type="text" class="form-input" value="xavi_official" style="padding-left:30px;"></div></div>
          <div class="form-group mb-4"><label class="form-label">Bio</label><textarea class="form-input" rows="4">Multi-platinum songwriter and recording artist with features on 40+ projects.</textarea></div>
          <div class="grid-2 mb-4">
            <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" value="Atlanta, GA"></div>
            <div class="form-group"><label class="form-label">Primary Genre</label><select class="form-select"><option selected>Hip-Hop</option><option>Trap</option><option>R&B</option></select></div>
          </div>
          <button class="btn btn-primary" onclick="this.innerHTML='<i class=\"fas fa-check\"></i> Saved!';setTimeout(()=>this.innerHTML='Save Changes',2000)"><i class="fas fa-save"></i> Save Changes</button>
        </div>
        <div class="card p-6">
          <h2 style="font-size:18px;margin-bottom:24px;">Collaboration Settings</h2>
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${[
              { label: 'Availability Status', desc: 'Let buyers know if you\'re open for new work', type: 'select', options: ['Available', 'Busy', 'Unavailable'] },
              { label: 'Live Sessions Available', desc: 'Offer real-time remote recording sessions', type: 'toggle', val: true },
              { label: 'Public Profile', desc: 'Allow your profile to appear in search results', type: 'toggle', val: true },
              { label: 'Direct Booking', desc: 'Allow artists to book without messaging first', type: 'toggle', val: true },
            ].map(s => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border);">
              <div>
                <div style="font-weight:600;font-size:14px;">${s.label}</div>
                <div style="font-size:12px;color:var(--text2);margin-top:2px;">${s.desc}</div>
              </div>
              ${s.type === 'toggle' ? `
              <label style="cursor:pointer;display:flex;align-items:center;gap:8px;">
                <div onclick="this.classList.toggle('on')" style="width:44px;height:24px;border-radius:12px;background:${s.val ? 'var(--accent)' : 'var(--bg4)'};position:relative;cursor:pointer;transition:background 0.2s;">
                  <div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:3px;left:${s.val ? '23px' : '3px'};transition:left 0.2s;"></div>
                </div>
              </label>` : `
              <select class="form-select" style="width:auto;">
                ${s.options?.map(o => `<option>${o}</option>`).join('')}
              </select>`}
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
` + footer() + closeHTML();
}
