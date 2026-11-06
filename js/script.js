/* ===== EDIT ME: all personal content lives here ===== */
const CONFIG = {
  photos: [
    { src: 'images/photo1.JPG', caption: 'Your beautiful smile.' },
    { src: 'images/photo2.JPG', caption: 'Just being your wonderful self.' },
    { src: 'images/photo3.JPG', caption: 'A little collection of beautiful moments.' }
  ],
  chapters: [
    { icon: '🎒', title: 'The Beginning', text: 'We first met in Class 2. Back then, neither of us probably imagined that our paths would cross again in such an unexpected way.' },
    { icon: '📱', title: 'An Unexpected Reunion', text: 'Years passed, and somehow we found each other again on Instagram. A random connection turned into regular conversations.' },
    { icon: '💬', title: 'A Beautiful Bond', text: "Those little conversations gradually became something I genuinely look forward to. It's amazing how someone can become an important part of your everyday life." },
    { icon: '🌸', title: 'A Meeting Yet To Come', text: "We haven't met in person yet, but I hope someday we get the chance to meet and turn all these online conversations into real-life memories." }
  ],
  letter:
`Hey!

First of all, a very Happy Birthday to you!

It's funny how life works. We first met in Class 2, went our separate ways, and somehow found each other again through a random Instagram connection.

I never expected those random conversations to turn into such a beautiful bond.

Even though we haven't met in person yet, I'm genuinely glad we reconnected.

Thank you for all the conversations, random talks, laughs, and little moments that make our friendship special.

I hope your new year brings you endless happiness, success, beautiful opportunities, and everything your heart wishes for.

Never stop smiling, never stop being yourself, and always remember how special you are.

Once again, Happy Birthday! ❤️`,
  compliments: [
    'Your smile makes ordinary days brighter.',
    'You have a genuinely beautiful personality.',
    'Your conversations can make a normal day better.',
    'You deserve all the happiness in the world.',
    'Never stop being the wonderful person you are.',
    'Your presence makes moments memorable.',
    'You have your own unique way of making people smile.',
    'Keep shining in everything you do.',
    'Talking to you is a highlight of my day.',
    'You make people feel heard and valued.'
  ]
};

const $ = (id) => document.getElementById(id);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Loader */
window.addEventListener('load', () => setTimeout(() => $('loader').classList.add('done'), 700));

/* Floating hearts (capped for mobile performance) */
function spawnHeart() {
  const layer = $('hearts');
  if (document.hidden || layer.children.length > 18) return;
  const h = document.createElement('span');
  h.textContent = ['💗', '💖', '✨', '🌸', '⭐'][Math.floor(Math.random() * 5)];
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = 14 + Math.random() * 18 + 'px';
  h.style.animationDuration = 8 + Math.random() * 8 + 's';
  h.addEventListener('animationend', () => h.remove());
  layer.appendChild(h);
}
if (!reduceMotion) setInterval(spawnHeart, 900);

/* Music: the site works even if the file is missing */
const audio = $('audio');
audio.volume = 0.4;
function setPlaying(on) {
  $('bars').classList.toggle('on', on);
  $('play-btn').textContent = on ? '⏸' : '▶';
  $('play-btn').setAttribute('aria-label', on ? 'Pause music' : 'Play music');
}
function playMusic() { audio.play().then(() => setPlaying(true)).catch(() => $('music-note').classList.remove('hidden')); }
audio.addEventListener('error', () => $('music-note').classList.remove('hidden'));
$('play-btn').addEventListener('click', () => { if (audio.paused) playMusic(); else { audio.pause(); setPlaying(false); } });
$('mute-btn').addEventListener('click', () => {
  audio.muted = !audio.muted;
  $('mute-btn').textContent = audio.muted ? '🔇' : '🔊';
  $('mute-btn').setAttribute('aria-label', audio.muted ? 'Unmute music' : 'Mute music');
});

/* Gift opening */
$('open-btn').addEventListener('click', () => {
  $('open-btn').disabled = true;
  $('gift').classList.add('open');
  for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 80);
  setTimeout(() => {
    $('gift-screen').classList.add('leave');
    $('site').classList.remove('hidden');
    playMusic(); // allowed: triggered by a user click
    observeReveals();
    if (!reduceMotion) confetti(50); // subtle welcome confetti
    window.scrollTo(0, 0);
  }, 1000);
  setTimeout(() => $('gift-screen').remove(), 2000);
});

/* Navigation */
const menu = $('menu'), menuBtn = $('menu-btn');
menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', menu.classList.toggle('open')));
menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); } });
$('top-btn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => $('top-btn').classList.toggle('hidden', window.scrollY < 500), { passive: true });

/* Scroll reveal */
function observeReveals() {
  const els = document.querySelectorAll('.reveal, .chapter');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('show')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  els.forEach(e => io.observe(e));
}

/* Gallery + lightbox */
const lb = $('lightbox');
CONFIG.photos.forEach((p) => {
  const card = document.createElement('button');
  card.className = 'photo';
  card.setAttribute('aria-label', 'Open photo: ' + p.caption);
  const img = new Image();
  img.src = p.src; img.alt = p.caption; img.loading = 'lazy';
  img.onerror = () => { const ph = document.createElement('div'); ph.className = 'ph'; ph.textContent = '📷'; img.replaceWith(ph); card.dataset.missing = '1'; };
  const cap = document.createElement('span'); cap.className = 'cap'; cap.textContent = p.caption;
  card.append(img, cap);
  card.addEventListener('click', () => {
    const missing = !!card.dataset.missing;
    $('lb-img').style.display = missing ? 'none' : 'block';
    if (!missing) $('lb-img').src = p.src;
    $('lb-img').alt = p.caption; $('lb-cap').textContent = p.caption;
    lb.classList.remove('hidden'); $('lb-close').focus();
  });
  $('gallery').appendChild(card);
});
const closeLb = () => lb.classList.add('hidden');
$('lb-close').addEventListener('click', closeLb);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

/* Envelope opens, then the letter types itself */
let typing = false;
$('letter-btn').addEventListener('click', () => {
  if (typing) return;
  typing = true;
  $('envelope').classList.add('open');
  const p = $('letter-text');
  setTimeout(() => {
    $('letter').classList.remove('hidden'); p.textContent = ''; p.classList.add('typing');
    let i = 0;
    (function step() {
      if (i < CONFIG.letter.length) { p.textContent += CONFIG.letter[i++]; setTimeout(step, reduceMotion ? 0 : 24); }
      else { p.classList.remove('typing'); typing = false; }
    })();
  }, reduceMotion ? 0 : 800);
});

/* Story timeline (built from CONFIG.chapters) */
CONFIG.chapters.forEach((c) => {
  const li = document.createElement('li');
  li.className = 'chapter'; li.dataset.icon = c.icon;
  li.innerHTML = '<h3></h3><p></p>';
  li.firstChild.textContent = c.title; li.lastChild.textContent = c.text;
  $('timeline').appendChild(li);
});

/* Volume slider */
$('vol').addEventListener('input', (e) => { audio.volume = +e.target.value; });

/* Random compliments: no repeats until all have been shown */
let bag = [];
$('compliment-btn').addEventListener('click', () => {
  if (!bag.length) bag = CONFIG.compliments.map((_, i) => i).sort(() => Math.random() - 0.5);
  const el = $('compliment');
  el.classList.add('fade');
  setTimeout(() => { el.textContent = CONFIG.compliments[bag.pop()]; el.classList.remove('fade'); }, 300);
});

/* Confetti */
const cv = $('confetti'), ctx = cv.getContext('2d');
let bits = [], raf = null;
function sizeCanvas() { cv.width = innerWidth; cv.height = innerHeight; }
sizeCanvas(); addEventListener('resize', sizeCanvas);
function confetti(n = 140) {
  const colors = ['#f4b6c8', '#cdbbf0', '#e8c27a', '#fff', '#e98fb0'];
  for (let i = 0; i < n; i++) bits.push({
    x: innerWidth / 2, y: innerHeight * 0.6, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 15 - 4,
    s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[i % colors.length]
  });
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  bits = bits.filter(b => b.y < cv.height + 20);
  bits.forEach(b => {
    b.vy += 0.35; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c;
    ctx.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * 0.6); ctx.restore();
  });
  raf = bits.length ? requestAnimationFrame(tick) : null;
}

/* Make a wish */
$('wish-btn').addEventListener('click', () => {
  $('cake').classList.add('out');
  $('wish-msg').classList.remove('hidden');
  if (!reduceMotion) confetti();
  $('wish-btn').textContent = 'Wish Made 💫';
  for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 100);
});

/* Finale */
$('again-btn').addEventListener('click', () => {
  if (!reduceMotion) confetti(90);
  for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 120);
});
