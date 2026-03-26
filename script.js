/* =========================================================
   script.js — Portfolio Interactive Logic v2
   ========================================================= */

/* ── MATRIX RAIN ── */
(function () {
  const canvas = document.getElementById('matrix-rain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // NEW: The full character set from the new React portfolio
  const CHARS = '> { < [ ] } ( ) > + = - * / % & | ^ ! ~ ? : ; , . " \' \\ / @#$&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const FONT_SIZE = 14; 
  let cols, drops, speeds;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols   = Math.floor(canvas.width / FONT_SIZE) + 1;
    
    // Reset drops
    // Randomise start positions across full height so screen looks pre-filled
    drops = Array.from({ length: cols }, () => Math.random() * (canvas.height / FONT_SIZE));
  }
  
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function draw() {
    // NEW: Dark, semi-transparent fade (leaves the long trailing effect)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // NEW: Solid matrix green for the text
    ctx.fillStyle = 'rgba(0, 255, 65, 0.9)';
    ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;
    ctx.textAlign = 'left';

    for (let i = 0; i < drops.length; i++) {
      const text = CHARS[Math.floor(Math.random() * CHARS.length)];
      
      const x = i * FONT_SIZE;
      const yPx = drops[i] * FONT_SIZE;
      ctx.fillText(text, x, yPx);

      // Reset when column reaches bottom, otherwise keep falling at slight random speeds
      if (yPx > canvas.height) {
        drops[i] = 0;
      } else {
        // NEW: specific randomized continuous speed from the React version
        drops[i] += Math.random() * 0.5 + 0.3; 
      }
    }
    
    // NEW: Switched it to requestAnimationFrame for smoother running
    requestAnimationFrame(draw);
  }
  
  // Start the animation
  draw();
})();

/* ── TYPED TEXT ── */
(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const strings = ['Full-Stack Developer', 'Cybersecurity Learner', 'Competitive Programmer', 'Problem Solver'];
  let si = 0, ci = 0, deleting = false;
  function type() {
    const cur = strings[si];
    if (!deleting && ci <= cur.length) { el.textContent = cur.slice(0, ci++); setTimeout(type, 80); }
    else if (!deleting) { setTimeout(() => { deleting = true; type(); }, 1800); }
    else if (deleting && ci >= 0) { el.textContent = cur.slice(0, ci--); setTimeout(type, 40); }
    else { deleting = false; si = (si + 1) % strings.length; setTimeout(type, 300); }
  }
  type();
})();

/* ── NAVBAR SCROLL + ACTIVE LINK ── */
(function () {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const btt = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);

    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }, { passive: true });
})();

/* ── HAMBURGER ── */
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('nav-links');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => { btn.classList.toggle('open'); menu.classList.toggle('open'); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.classList.remove('open'); menu.classList.remove('open');
  }));
})();

/* ── AOS (Animate On Scroll) ── */
(function () {
  const items = document.querySelectorAll('[data-aos]');
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80); });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function () {
  const els = document.querySelectorAll('.stat-num[data-target]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = +e.target.getAttribute('data-target');
      const duration = 1400;
      const step = target / (duration / 16);
      let cur = 0;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        e.target.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(t);
      }, 16);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();

/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  const fields = [
    { id: 'name', errId: 'name-error', msg: 'Please enter your name.', test: v => v.trim().length > 1 },
    { id: 'email', errId: 'email-error', msg: 'Please enter a valid email.', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'subject', errId: 'subject-error', msg: 'Please enter a subject.', test: v => v.trim().length > 2 },
    { id: 'message', errId: 'message-error', msg: 'Message must be at least 10 chars.', test: v => v.trim().length >= 10 },
  ];

  function validate() {
    let ok = true;
    fields.forEach(({ id, errId, msg, test }) => {
      const input = document.getElementById(id);
      const err = document.getElementById(errId);
      const valid = test(input.value);
      input.classList.toggle('error', !valid);
      if (err) err.textContent = valid ? '' : msg;
      if (!valid) ok = false;
    });
    return ok;
  }

  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const e = document.getElementById(el.id + '-error');
      if (e) e.textContent = '';
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1800);
  });
})();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── RESUME BUTTON ── */
const resumeBtn = document.getElementById('resume-btn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', e => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = './Premangshu_CV.pdf';
    link.download = 'Premangshu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/* ── CERTIFICATE LIGHTBOX ── */
function openCert(src, title) {
  if (src.toLowerCase().endsWith('.pdf')) {
    window.open(src, '_blank');
    return;
  }
  const lb = document.getElementById('certLightbox');
  document.getElementById('certLightboxImg').src = src;
  document.getElementById('certLightboxTitle').textContent = title;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCert() {
  document.getElementById('certLightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCert(); });
