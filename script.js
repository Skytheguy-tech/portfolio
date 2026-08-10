'use strict';
/* ════════════════════════════════════════
   ShivKylash   CYBER — script.js v4.2
   Final: sRGB · physicalLights · float
   · smooth pulse · IO 0.2 · particle glow
════════════════════════════════════════ */


/* ── HELPERS ── */
const $ = id => document.getElementById(id);
const isMobile = () => innerWidth < 600;

/* ── DEBOUNCE / RAF-THROTTLE ── */
function rafThrottle(fn) {
  let raf = false;
  return function (...args) { if (raf) return; raf = true; requestAnimationFrame(() => { fn.apply(this, args); raf = false; }); };
}

/* ── LOADER ── */
const LLINES = [
  { t: '<span class="tp">$</span> sudo init ShivKylash --secure', d: 0 },
  { t: '<span style="color:#555">[sudo] password: ••••••••</span>', d: 350 },
  { t: '<span style="color:var(--ng)">✓</span> Authentication passed. Welcome, ShivKylash.', d: 700 },
  { t: '<span class="tp">$</span> loading modules...', d: 1050 },
  { t: '<span style="color:#555">  → encryption engine............OK</span>', d: 1350 },
  { t: '<span style="color:#555">  → steganography detector.......OK</span>', d: 1600 },
  { t: '<span style="color:#555">  → SOC threat monitor...........OK</span>', d: 1850 },
  { t: '<span style="color:#555">  → digital forensics suite......OK</span>', d: 2100 },
  { t: '<span style="color:var(--nb)">→ All systems nominal. Launching portfolio...</span>', d: 2400 },
];
const llEl = $('ll');
LLINES.forEach(({ t, d }) => setTimeout(() => { const el = document.createElement('div'); el.className = 'tl2'; el.innerHTML = t; llEl.appendChild(el); }, d));
let lp = 0;
const lpEl = $('lp'), lbfEl = $('lbf');
const li = setInterval(() => { lp = Math.min(lp + 1, 100); lbfEl.style.width = lp + '%'; lpEl.textContent = lp + '%'; if (lp >= 100) clearInterval(li); }, 30);
setTimeout(() => $('loader').classList.add('out'), 3200);

/* ── CURSOR (desktop only) ── */
const cur = $('cur'), curR = $('cur-ring');
if (!isMobile()) {
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function animCursor() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    cur.style.cssText += `;left:${mx}px;top:${my}px`;
    curR.style.cssText += `;left:${rx}px;top:${ry}px`;
    requestAnimationFrame(animCursor);
  })();
  document.querySelectorAll('a,button,.btn,.pc-card,.sc,.rc,.chip,.tcmd,.skcat,.showcase-chrome').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('big'); curR.classList.add('big'); }, { passive: true });
    el.addEventListener('mouseleave', () => { cur.classList.remove('big'); curR.classList.remove('big'); }, { passive: true });
  });
} else {
  // Hide custom cursor on mobile
  if (cur) cur.style.display = 'none';
  if (curR) curR.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ── UNIFIED SCROLL HANDLER (single listener, rAF-throttled) ── */
const spEl = $('sp');
// Register all scroll-driven effects here — zero duplicate listeners
const _scrollCbs = [];
function registerScroll(fn) { _scrollCbs.push(fn); }
const _masterScroll = rafThrottle(() => _scrollCbs.forEach(fn => fn()));
window.addEventListener('scroll', _masterScroll, { passive: true });

// 1) Scroll progress bar + section reveal
registerScroll(function () {
  const tot = document.body.scrollHeight - innerHeight;
  if (tot > 0) spEl.style.width = (scrollY / tot * 100) + '%';
  document.querySelectorAll('.rv:not(.vis)').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight * .91) {
      el.classList.add('vis');
      el.querySelectorAll('.ski-fill').forEach(b => b.style.width = b.dataset.w + '%');
      el.querySelectorAll('[data-count]').forEach(c => {
        const target = +c.dataset.count, big = target > 100;
        let cv = big ? target - 60 : 0, step = big ? 60 / 40 : target / 40;
        const t = setInterval(() => { cv = Math.min(cv + step, target); c.textContent = Math.floor(cv) + (big ? '' : '+'); if (cv >= target) { c.textContent = target + (big ? '' : '+'); clearInterval(t); } }, 40);
      });
    }
  });
});
setTimeout(_masterScroll, 3400);

/* ── GRID CANVAS ── */
const gc = $('gc'), gctx = gc.getContext('2d');
function drawGrid() {
  gc.width = innerWidth; gc.height = innerHeight;
  gctx.clearRect(0, 0, gc.width, gc.height);
  gctx.strokeStyle = '#00d4ff'; gctx.lineWidth = .4;
  for (let x = 0; x < gc.width; x += 60) { gctx.beginPath(); gctx.moveTo(x, 0); gctx.lineTo(x, gc.height); gctx.stroke(); }
  for (let y = 0; y < gc.height; y += 60) { gctx.beginPath(); gctx.moveTo(0, y); gctx.lineTo(gc.width, y); gctx.stroke(); }
}
drawGrid();

/* ── PARTICLES ── */
const pc2 = $('pc'), pctx = pc2.getContext('2d');
pc2.width = innerWidth; pc2.height = innerHeight;
// Fewer particles on mobile for perf
const PART_COUNT = isMobile() ? 0 : 55;
const parts = Array.from({ length: PART_COUNT }, () => ({ x: Math.random() * pc2.width, y: Math.random() * pc2.height, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.5 + .5, a: Math.random() }));
function animP() {
  pctx.clearRect(0, 0, pc2.width, pc2.height);
  parts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = pc2.width; if (p.x > pc2.width) p.x = 0;
    if (p.y < 0) p.y = pc2.height; if (p.y > pc2.height) p.y = 0;
    pctx.beginPath(); pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fillStyle = `rgba(0,212,255,${p.a * .5})`; pctx.fill();
  });
  for (let i = 0; i < parts.length; i++)for (let j = i + 1; j < parts.length; j++) {
    const dx = parts[i].x - parts[j].x, dy = parts[i].y - parts[j].y, d = Math.sqrt(dx * dx + dy * dy);
    if (d < 110) {
      pctx.beginPath(); pctx.moveTo(parts[i].x, parts[i].y); pctx.lineTo(parts[j].x, parts[j].y);
      pctx.strokeStyle = `rgba(0,212,255,${.12 * (1 - d / 110)})`; pctx.lineWidth = .5; pctx.stroke();
    }
  }
  requestAnimationFrame(animP);
}
animP();
window.addEventListener('resize', rafThrottle(() => { drawGrid(); pc2.width = innerWidth; pc2.height = innerHeight; }));

/* ── HAMBURGER / MOBILE MENU ── */
const hbg = $('hbg'), mm = $('mm'), bd = $('bd');
let scrollPos = 0;
function openM() {
  scrollPos = window.scrollY;
  hbg.classList.add('open'); mm.classList.add('open'); bd.classList.add('open');
  // Save scroll position and lock
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPos}px`;
  document.body.style.width = '100%';
}
function closeM() {
  hbg.classList.remove('open'); mm.classList.remove('open'); bd.classList.remove('open');
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollPos);
}
hbg.addEventListener('click', () => hbg.classList.contains('open') ? closeM() : openM());
bd.addEventListener('click', closeM);
document.querySelectorAll('.mlink').forEach(a => a.addEventListener('click', closeM));
// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeM(); });

/* ── MAGNETIC BUTTONS & MICRO INTERACTIONS ── */
document.querySelectorAll('.btn').forEach(b => {
  b.addEventListener('mousemove', function (e) { const r = this.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); this.style.transform = `scale(1.02) translate(${dx * .14}px,${dy * .14}px)`; });
  b.addEventListener('mouseleave', function () { this.style.transform = ''; });
});

/* Card Tilt & Stats Animation */
document.querySelectorAll('.pc-card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    c.style.transform = `perspective(1000px) rotateX(${-(e.clientY - r.top - r.height / 2) / 15}deg) rotateY(${(e.clientX - r.left - r.width / 2) / 15}deg) translateY(-8px)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

document.querySelectorAll('.sc').forEach(s => {
  const n = s.querySelector('.sc-num');
  s.addEventListener('mouseenter', () => { if (n) n.style.transform = 'scale(1.15)'; n.style.transition = 'transform 0.3s ease' });
  s.addEventListener('mouseleave', () => { if (n) n.style.transform = 'scale(1)'; });
});

/* ── HACK MODE ── */
const hackBtn = $('hb');
hackBtn.addEventListener('click', () => {
  const on = document.body.classList.toggle('hm');
  hackBtn.classList.toggle('on', on);
  hackBtn.textContent = on ? '🔴 EXIT HACK' : '⚡ HACK';
  showToast(on ? '🔴 HACK MODE ACTIVATED' : '✓ Normal mode restored');
  drawGrid();
});

/* ── GITHUB API (cached · retry · timeout) ── */
async function loadGH() {
  const grid = $('repo-grid'), loader = $('repo-loader');
  const LANG_COLORS = { Python: '#3572A5', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Java: '#b07219', C: '#555555', 'C++': '#f34b7d', TypeScript: '#2b7489' };
  const CACHE_KEY = 'gh_repos_cache', CACHE_TTL = 10 * 60 * 1000;

  function makeCard(name, desc, lang, stars, forks, url, updated) {
    const dot = LANG_COLORS[lang] || '#7ba7bc';
    const updatedStr = updated ? `Updated ${new Date(updated).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : '';
    const a = document.createElement('a'); a.className = 'rc'; a.href = url; a.target = '_blank';
    a.innerHTML = `
      <div class="rc-name">⌥ ${name}</div>
      <div class="rc-desc">${desc}</div>
      <div class="rc-meta">
        <span style="display:flex;align-items:center;gap:4px">
          <span style="width:10px;height:10px;border-radius:50%;background:${dot};display:inline-block;box-shadow:0 0 4px ${dot}88;flex-shrink:0"></span>${lang || 'N/A'}
        </span>
        ${updatedStr ? `<span style="margin-left:auto;font-size:9px;opacity:.55">${updatedStr}</span>` : ''}
      </div>`;
    return a;
  }

  function renderFallback() {
    loader.innerHTML = '<span style="color:var(--t2);font-family:var(--mono);font-size:12px">// See github.com/Skytheguy-tech</span>';
  }

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) {
        loader.style.display = 'none';
        data.forEach(r => grid.appendChild(makeCard(r.name, r.description, r.language, r.stars, r.forks, r.url, r.updated)));
        return;
      }
    }
  } catch { }

  async function fetchWithRetry(url, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 6000);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        clearTimeout(tid);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
      } catch (e) {
        clearTimeout(tid);
        if (attempt === retries) throw e;
        await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }

  try {
    const repos = await fetchWithRetry('https://api.github.com/users/Skytheguy-tech/repos?sort=updated&per_page=12');
    const filtered = repos.filter(r => !r.fork).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 6);
    if (!filtered.length) throw 0;
    loader.style.display = 'none';
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        ts: Date.now(),
        data: filtered.map(r => ({ name: r.name, description: r.description || 'Security project by Shiv Kylash.', language: r.language || 'Python', stars: r.stargazers_count, forks: r.forks_count, url: r.html_url, updated: r.updated_at }))
      }));
    } catch { }
    filtered.forEach(r => grid.appendChild(makeCard(r.name, r.description || 'Security project by Shiv Kylash.', r.language || 'Python', r.stargazers_count, r.forks_count, r.html_url, r.updated_at)));
  } catch {
    renderFallback();
  }
}
loadGH();

/* ── TERMINAL ── */
const CMDS = {
  help: () => [
    { c: 'res', t: '┌─ SKYCYBER TERMINAL v3.0 ──────────────────┐' },
    { c: 'info', t: '  whoami    → Display analyst profile' },
    { c: 'info', t: '  about     → Detailed background' },
    { c: 'info', t: '  skills    → Technical capabilities' },
    { c: 'info', t: '  projects  → Security projects' },
    { c: 'info', t: '  social    → Contact & social links' },
    { c: 'info', t: '  contact   → Get in touch' },
    { c: 'info', t: '  clear     → Clear terminal' },
    { c: 'res', t: '└─────────────────────────────────────────────┘' },
  ],
  whoami: () => [
    { c: 'res', t: 'shiv@cyber:~$ whoami' },
    { c: 'info', t: 'Name     : Shiv Kylash V' },
    { c: 'info', t: 'Role     : Security Analyst' },
    { c: 'info', t: 'Degree   : B.Tech Electronics & Computer Engg.' },
    { c: 'info', t: 'School   : VIT Chennai · CGPA 8.96 · 2022–2026' },
    { c: 'res', t: 'Status   : 🟢 Open to SOC Analyst roles' },
  ],
  about: () => [
    { c: 'res', t: '[ SHIV KYLASH V — SECURITY PROFILE ]' },
    { c: 'info', t: 'Phone:    +91 7550230026' },
    { c: 'info', t: 'Email:    vshivkylash06@gmail.com' },
    { c: 'info', t: 'GitHub:   github.com/Skytheguy-tech' },
    { c: 'info', t: 'LinkedIn: linkedin.com/in/shiv-kylash-v' },
    { c: 'info', t: 'TryHackMe: tryhackme.com/p/ShivKylashV' },
    { c: 'res', t: 'Focus:    Threat Detection · SIEM · Incident Response' },
  ],
  skills: () => [
    { c: 'res', t: '[ TECHNICAL SKILLS ]' },
    { c: 'info', t: 'Languages : Python C SQL Bash' },
    { c: 'info', t: 'Security  : SIEM (Splunk) · IDS/IPS · MITRE ATT&CK' },
    { c: 'info', t: 'Tools     : Wireshark · Metasploit · Burp Suite · Nmap' },
    { c: 'res', t: ' CompTIA Security+ · Google Cybersecurity Professional' },
  ],
  projects: () => [
    { c: 'res', t: '[ SECURITY PROJECTS ]' },
    { c: 'info', t: '01. Quantum-Assisted Steganography' },
    { c: 'info', t: '02. Blue Machine Pentest & Malware Analysis' },
    { c: 'info', t: '03. Active Directory Attack Simulation' },
    { c: 'info', t: '04. RSA Key Compromise & Cert Forgery' },
    { c: 'res', t: 'github.com/Skytheguy-tech' },
  ],
  social: () => [
    { c: 'res', t: '[ SOCIAL & CONTACT ]' },
    { c: 'info', t: '📞  +91 7550230026' },
    { c: 'info', t: '📧  vshivkylash06@gmail.com' },
    { c: 'info', t: '🐙  github.com/Skytheguy-tech' },
    { c: 'info', t: '💼  linkedin.com/in/shiv-kylash-v-738a32251' },
    { c: 'info', t: '▲  tryhackme.com/p/ShivKylashV' },
    { c: 'res', t: '👉  Open to SOC Analyst roles & internships' },
  ],
  contact: () => [
    { c: 'res', t: '[ CONTACT INFORMATION ]' },
    { c: 'info', t: 'Phone:    +91 7550230026' },
    { c: 'info', t: 'Email:    vshivkylash06@gmail.com' },
    { c: 'info', t: 'GitHub:   github.com/Skytheguy-tech' },
    { c: 'info', t: 'LinkedIn: linkedin.com/in/shiv-kylash-v-738a32251' },
    { c: 'res', t: 'Status:   Open to SOC Analyst roles' },
  ],
};

const tOut = $('term-out'), tIn = $('ti');
function addL(txt, cls = 'info') { const d = document.createElement('div'); d.className = 'to ' + cls; d.textContent = txt; tOut.appendChild(d); tOut.scrollTop = tOut.scrollHeight; }
function typeLines(lines, idx = 0) { if (idx >= lines.length) return; addL(lines[idx].t, lines[idx].c); setTimeout(() => typeLines(lines, idx + 1), idx === 0 ? 0 : 60); }
function runCmd(cmd) {
  cmd = cmd.trim().toLowerCase(); if (!cmd) return;
  addL('ShivKylash@cyber:~$ ' + cmd, 'cmd');
  if (cmd === 'clear') { tOut.innerHTML = ''; return; }
  const fn = CMDS[cmd];
  if (fn) typeLines(fn()); else addL(`bash: ${cmd}: command not found — type 'help'`, 'err');
}
tIn.addEventListener('keydown', e => { if (e.key === 'Enter') { runCmd(tIn.value); tIn.value = ''; } });
window.runCmd = runCmd;

/* ── TOAST (spring animation via CSS) ── */
const toastEl = $('toast');
let toastTimer = null;
function showToast(msg = '✓ Copied!') {
  if (toastTimer) clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.remove('show');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }));
}
function copyEmail() {
  navigator.clipboard.writeText('vshivkylash06@gmail.com')
    .then(() => showToast('✓ Email copied to clipboard!'))
    .catch(() => showToast('vshivkylash06@gmail.com'));
}
window.showToast = showToast;
window.copyEmail = copyEmail;

