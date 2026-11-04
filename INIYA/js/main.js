// ============================================================
// main.js — lock screen, tab routing, transitions, floaters,
//            cursor sparkles, corner decor
// ============================================================

/* ── Helpers ─────────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const rand = (min, max) => Math.random() * (max - min) + min;
const randItem = arr => arr[Math.floor(Math.random() * arr.length)];

/* ── State ───────────────────────────────────────────────── */
let currentTab = 'wish';
let enteredCode = '';
let isUnlocked = sessionStorage.getItem('unlocked') === '1';
let tabHistory = [];

/* ── On DOM ready ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildKeypad();
  setupFloaters();
  setupCursorSparkle();
  setupCornerDecor();

  if (isUnlocked) {
    showApp();
    navigateTo('wish', false);
  } else {
    showLock();
  }

  // Physical keyboard support for keypad
  document.addEventListener('keydown', handleKeydown);
  // Arrow key tab navigation
  document.addEventListener('keydown', handleTabArrow);
});

/* ── Lock Screen ─────────────────────────────────────────── */
function showLock() {
  $('#screen-lock').style.display = '';
  $('#tab-bar').classList.remove('visible');
  $('#music-player').classList.remove('visible');
  $('#mochi-wrap').classList.remove('visible');
  setTimeout(() => {
    puppy.show();
    puppy.setState('idle');
    puppy.say(randItem(CONFIG.puppyLines.lock));
  }, 600);
}

function showApp() {
  $('#screen-lock').style.display = 'none';
  $('#tab-bar').classList.add('visible');
  $('#music-player').classList.add('visible');
  $('#mochi-wrap').classList.add('visible');
  document.getElementById('arrow-prev').style.display = 'flex';
  document.getElementById('arrow-next').style.display = 'flex';
  musicPlayer.init();
}

function buildKeypad() {
  const keypad = $('#keypad');
  const digits = ['1','2','3','4','5','6','7','8','9','←','0','♡ open'];
  digits.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'key-btn';
    if (d === '♡ open') btn.classList.add('key-open');
    if (d === '←') btn.classList.add('key-back');
    btn.textContent = d;
    btn.setAttribute('aria-label', d === '←' ? 'backspace' : d === '♡ open' ? 'open' : d);
    btn.addEventListener('click', () => handleKeyInput(d));
    keypad.appendChild(btn);
  });
  $('#hint-toggle').addEventListener('click', () => {
    const ht = $('#hint-text');
    ht.classList.toggle('visible');
  });
}

function handleKeydown(e) {
  if (!isUnlocked) {
    if (e.key >= '0' && e.key <= '9') handleKeyInput(e.key);
    if (e.key === 'Backspace') handleKeyInput('←');
    if (e.key === 'Enter') handleKeyInput('♡ open');
  }
}
function handleTabArrow(e) {
  if (!isUnlocked) return;
  const tabs = ['wish','photos','memories','letter','arcade'];
  const idx = tabs.indexOf(currentTab);
  if (e.key === 'ArrowRight' && idx < tabs.length - 1) navigateTo(tabs[idx + 1]);
  if (e.key === 'ArrowLeft' && idx > 0) navigateTo(tabs[idx - 1]);
}

function handleKeyInput(val) {
  if (val === '←') {
    enteredCode = enteredCode.slice(0, -1);
    updateSlots();
    return;
  }
  if (val === '♡ open') {
    checkCode();
    return;
  }
  if (enteredCode.length < 4) {
    enteredCode += val;
    updateSlots();
    if (enteredCode.length === 4) {
      setTimeout(checkCode, 300);
    }
  }
}

function updateSlots() {
  const slots = $$('.code-slot');
  slots.forEach((s, i) => {
    if (i < enteredCode.length) {
      s.textContent = '';
      s.classList.add('filled');
      // show digit briefly then replace with bow
      s.textContent = enteredCode[i];
      clearTimeout(s._timer);
      s._timer = setTimeout(() => { s.textContent = '🎀'; }, 300);
    } else {
      s.textContent = '';
      s.classList.remove('filled');
    }
  });
}

function checkCode() {
  if (enteredCode === CONFIG.PASSCODE) {
    // Correct!
    puppy.setState('cheer');
    puppy.say('yay!! you did it! 🎉');
    playUnlockAnimation();
  } else {
    // Wrong
    const parcel = $('.parcel-wrap');
    parcel.style.animation = 'none';
    parcel.classList.add('anim-shake');
    setTimeout(() => { parcel.classList.remove('anim-shake'); parcel.style.animation = ''; }, 600);
    puppy.setState('sad');
    puppy.say(randItem(CONFIG.puppyLines.wrongCode));
    enteredCode = '';
    updateSlots();
  }
}

function playUnlockAnimation() {
  // animate twine untying
  const twine = $('#twine-path');
  if (twine) {
    twine.style.strokeDasharray = '200';
    twine.style.strokeDashoffset = '0';
    twine.style.animation = 'knot-untie 1s ease forwards';
  }
  // lid open
  const lid = $('.parcel-lid');
  if (lid) lid.style.animation = 'lid-open .8s .5s ease forwards';

  // confetti burst
  spawnConfetti(40, $('#screen-lock'));

  setTimeout(() => {
    sessionStorage.setItem('unlocked', '1');
    isUnlocked = true;
    // Flash transition
    const overlay = $('#transition-overlay');
    overlay.style.display = 'block';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity .4s ease';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      setTimeout(() => {
        showApp();
        navigateTo('wish', false);
        musicPlayer.play();
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
      }, 500);
    });
  }, 1400);
}

/* ── Tab Navigation ──────────────────────────────────────── */
const tabScreens = {
  wish:      '#screen-wish',
  photos:    '#screen-photos',
  memories:  '#screen-memories',
  letter:    '#screen-letter',
  arcade:    '#screen-arcade'
};
const tabMessages = {
  wish:      'wish',
  photos:    'photos',
  memories:  'memories',
  letter:    'letter',
  arcade:    'arcade'
};

function navigateTo(tabId, animate = true) {
  if (tabId === currentTab && animate) return;

  // Hide all screens
  Object.values(tabScreens).forEach(sel => {
    const el = $(sel);
    if (el) { el.classList.remove('active'); }
  });

  // Update tab buttons
  $$('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Show new screen
  const target = $(tabScreens[tabId]);
  if (!target) return;

  if (animate) {
    target.style.animation = 'sticker-slide-in .5s ease both';
    setTimeout(() => { target.style.animation = ''; }, 600);
  }
  target.classList.add('active');

  // Mochi reacts
  const lineKey = tabMessages[tabId];
  if (puppy && CONFIG.puppyLines[lineKey]) {
    puppy.hop();
    setTimeout(() => {
      puppy.say(randItem(CONFIG.puppyLines[lineKey]));
      puppy.setState('happy');
    }, 300);
  }

  currentTab = tabId;

  // Tab-specific init
  if (tabId === 'photos' && !photosInitialized) { initPhotos(); }
  if (tabId === 'memories' && !memoriesInitialized) { initMemories(); }
  if (tabId === 'letter' && !letterInitialized) { initLetter(); }
  if (tabId === 'arcade' && !arcadeInitialized) { initArcade(); }
}

// Tab buttons
document.addEventListener('DOMContentLoaded', () => {
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.tab));
  });
  document.getElementById('arrow-prev')?.addEventListener('click', () => {
    const tabs = ['wish','photos','memories','letter','arcade'];
    const idx = tabs.indexOf(currentTab);
    if (idx > 0) navigateTo(tabs[idx - 1]);
  });
  document.getElementById('arrow-next')?.addEventListener('click', () => {
    const tabs = ['wish','photos','memories','letter','arcade'];
    const idx = tabs.indexOf(currentTab);
    if (idx < tabs.length - 1) navigateTo(tabs[idx + 1]);
  });
});

/* ── Floating decor ──────────────────────────────────────── */
const floatSymbols = ['💗','✦','💕','⭐','🌸','💖','✨','💓','🎀','⭑','🌺','💝'];
const floatColors  = ['#C8323C','#F7C9D0','#E88A98','#E7B94A','#FFF6EA'];
let floaterCount = 0;
const maxFloaters = window.innerWidth < 600 ? 10 : 16;

function spawnFloater() {
  if (floaterCount >= maxFloaters) return;
  const layer = document.getElementById('floaters');
  if (!layer) return;

  const el = document.createElement('span');
  el.className = 'floater';
  el.setAttribute('aria-hidden', 'true');
  el.textContent = randItem(floatSymbols);
  el.style.setProperty('--left', rand(2, 95) + '%');
  el.style.setProperty('--sz', rand(12, 26) + 'px');
  el.style.setProperty('--dur', rand(10, 20) + 's');
  el.style.setProperty('--delay', rand(0, 3) + 's');
  el.style.setProperty('--opa', rand(0.35, 0.8));
  el.style.setProperty('--r', rand(-30, 30) + 'deg');
  el.style.setProperty('--sway-start', rand(-20, 20) + 'px');
  el.style.setProperty('--sway-end', rand(-40, 40) + 'px');
  layer.appendChild(el);
  floaterCount++;
  el.addEventListener('animationend', () => {
    el.remove();
    floaterCount--;
    spawnFloater();
  });
}

function setupFloaters() {
  const count = window.innerWidth < 600 ? 8 : 14;
  for (let i = 0; i < count; i++) {
    setTimeout(spawnFloater, i * 400);
  }
  // Keep spawning
  setInterval(spawnFloater, 1800);

  // Pause when hidden
  document.addEventListener('visibilitychange', () => {
    const layer = document.getElementById('floaters');
    if (layer) layer.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });
}

/* ── Cursor sparkle trail ────────────────────────────────── */
function setupCursorSparkle() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sparkleSymbols = ['✦','💗','⭐','✨','🌸'];
  let lastSparkle = 0;
  const throttle = 60; // ms between sparkles

  function spawnSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkle < throttle) return;
    lastSparkle = now;
    const el = document.createElement('span');
    el.className = 'sparkle-dot';
    el.textContent = randItem(sparkleSymbols);
    el.style.left = (x + rand(-8, 8)) + 'px';
    el.style.top = (y + rand(-8, 8)) + 'px';
    el.style.fontSize = rand(10, 18) + 'px';
    el.style.color = randItem(['#C8323C','#E7B94A','#F7C9D0','#E88A98']);
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  document.addEventListener('pointermove', e => spawnSparkle(e.clientX, e.clientY));
  document.addEventListener('pointerdown', e => {
    for (let i = 0; i < 4; i++) spawnSparkle(e.clientX, e.clientY);
  });
}

/* ── Corner decor ────────────────────────────────────────── */
function setupCornerDecor() {
  // Built into HTML as fixed elements
}

/* ── Confetti helper ─────────────────────────────────────── */
function spawnConfetti(count = 20, container = document.body) {
  const colors = ['#C8323C','#E7B94A','#F7C9D0','#E88A98','#FFF6EA','#7A2428'];
  const layer = document.getElementById('confetti-layer') || document.body;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.background = randItem(colors);
    el.style.left = rand(10, 90) + '%';
    el.style.top = rand(20, 60) + '%';
    el.style.setProperty('--i', i);
    el.style.setProperty('--cx', rand(-120, 120) + 'px');
    el.style.setProperty('--cy', rand(-80, -160) + 'px');
    el.style.setProperty('--cr', rand(0, 720) + 'deg');
    el.style.animationDelay = rand(0, .3) + 's';
    el.style.width = rand(8, 14) + 'px';
    el.style.height = rand(6, 12) + 'px';
    el.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    layer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

/* ── Heart burst helper ──────────────────────────────────── */
function spawnHeartBurst(x, y) {
  const hearts = ['💗','💕','💖','❤️','💓'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('span');
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${rand(14,22)}px;
      pointer-events:none;z-index:9999;animation:heart-burst .8s ease forwards;`;
    el.textContent = randItem(hearts);
    el.style.setProperty('--hx', rand(-40, 40) + 'px');
    el.style.setProperty('--hy', rand(-60, -20) + 'px');
    el.style.animationDelay = i * 60 + 'ms';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

/* ── Balloon float helper (wish tab) ─────────────────────── */
function spawnBalloons() {
  const container = document.querySelector('.balloons-container');
  if (!container) return;
  const balloons = ['🎈','🎀','💖','🎊','🎉'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'balloon';
    el.textContent = randItem(balloons);
    el.style.left = rand(5, 90) + '%';
    el.style.setProperty('--dur', rand(5, 10) + 's');
    el.style.setProperty('--delay', i * .3 + 's');
    el.style.setProperty('--bx', rand(-30, 30) + 'px');
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

/* expose helpers globally */
window.spawnConfetti = spawnConfetti;
window.spawnHeartBurst = spawnHeartBurst;
window.spawnBalloons = spawnBalloons;
window.navigateTo = navigateTo;
window.rand = rand;
window.randItem = randItem;
