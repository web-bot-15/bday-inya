// ============================================================
// games.js — Photo Book, Memories, Letter, Arcade init
// ============================================================

/* ── Flags ───────────────────────────────────────────────── */
let photosInitialized   = false;
let memoriesInitialized = false;
let letterInitialized   = false;
let arcadeInitialized   = false;

/* ═══════════════════════════════════════════════════════════
   TAB 2 — PHOTO BOOK
═══════════════════════════════════════════════════════════ */
function initPhotos() {
  photosInitialized = true;
  const collage = document.getElementById('photo-collage');
  if (!collage) return;
  collage.innerHTML = '';

  CONFIG.photos.forEach((photo, i) => {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';
    polaroid.style.setProperty('--i', i);
    const rots = [-4,-2,3,-3,5,-1,2,-4];
    polaroid.style.setProperty('--rot', (rots[i % rots.length]) + 'deg');
    polaroid.tabIndex = 0;
    polaroid.setAttribute('role', 'button');
    polaroid.setAttribute('aria-label', `Open photo: ${photo.caption}`);

    const tapeClass = i % 2 === 0 ? 'gingham' : 'solid';
    const tape = document.createElement('div');
    tape.className = `polaroid-tape ${tapeClass}`;
    polaroid.appendChild(tape);

    // Try image, fallback to placeholder
    const img = document.createElement('img');
    img.className = 'polaroid-img';
    img.alt = photo.caption;
    img.loading = 'lazy';
    img.src = photo.src;
    img.onerror = () => {
      img.replaceWith(makePlaceholder());
    };
    polaroid.appendChild(img);

    const caption = document.createElement('div');
    caption.className = 'polaroid-caption';
    caption.textContent = photo.caption;
    polaroid.appendChild(caption);

    polaroid.addEventListener('click', e => {
      openLightbox(i);
      spawnHeartBurst(e.clientX, e.clientY);
    });
    polaroid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
    });

    collage.appendChild(polaroid);
  });

  // Lightbox navigation
  document.getElementById('lb-prev')?.addEventListener('click', () => shiftLightbox(-1));
  document.getElementById('lb-next')?.addEventListener('click', () => shiftLightbox(1));
  document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });

  // Swipe on lightbox
  let lbTouchX = 0;
  document.getElementById('lightbox')?.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  document.getElementById('lightbox')?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - lbTouchX;
    if (Math.abs(dx) > 40) shiftLightbox(dx < 0 ? 1 : -1);
  });
}

function makePlaceholder() {
  const ph = document.createElement('div');
  ph.className = 'polaroid-placeholder';
  ph.innerHTML = '<span style="font-size:2rem">💗</span><span>add photo here</span>';
  return ph;
}

let currentLightboxIndex = 0;
function openLightbox(index) {
  currentLightboxIndex = index;
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  updateLightbox();
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
function shiftLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + CONFIG.photos.length) % CONFIG.photos.length;
  updateLightbox();
}
function updateLightbox() {
  const photo = CONFIG.photos[currentLightboxIndex];
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');
  if (img) {
    img.src = photo.src;
    img.alt = photo.caption;
    img.onerror = () => { img.src = ''; img.alt = photo.caption; };
  }
  if (cap) cap.textContent = photo.caption;
}

/* ═══════════════════════════════════════════════════════════
   TAB 3 — MEMORIES
═══════════════════════════════════════════════════════════ */
function initMemories() {
  memoriesInitialized = true;
  buildMemoryCards();
  buildQualityStickers();
  buildClosingNote();
  setupMemoryScrollReveal();
}

function buildMemoryCards() {
  const container = document.getElementById('memory-cards');
  if (!container) return;

  CONFIG.memories.forEach((mem, i) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.style.setProperty('--i', i);

    let innerHtml = `<div class="mem-inner ${mem.style}">
      <div class="mem-title">${getMemSticker(mem.sticker)} ${mem.title}</div>
      <div class="mem-text">${mem.text}</div>`;

    if (mem.style === 'chat-bubble') {
      innerHtml += `<div class="typing-dots" aria-hidden="true">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>`;
    }
    if (mem.style === 'calendar') {
      innerHtml += buildCalendar(mem.date);
    }

    innerHtml += `</div>`;

    // Tape decoration
    innerHtml += `<div style="position:absolute;top:-8px;left:${i%2===0?'20px':'auto'};right:${i%2===1?'20px':'auto'};
      width:40px;height:12px;border-radius:3px;
      background:repeating-linear-gradient(90deg,var(--rose) 0,var(--rose) 6px,var(--blush) 6px,var(--blush) 12px);
      opacity:.8;transform:rotate(${i%2===0?'-3deg':'3deg'});"></div>`;

    card.innerHTML = innerHtml;
    container.appendChild(card);
  });
}

function getMemSticker(type) {
  const stickers = {
    camera:   '📷',
    bow:      '🎀',
    envelope: '💌',
    heart:    '💗',
    star:     '⭐'
  };
  return stickers[type] || '✨';
}

function buildCalendar(highlightDay) {
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  // May 2025 starts on Thursday (index 4)
  const startDay = 4;
  const totalDays = 31;
  let html = `<div class="calendar-grid" aria-label="May 2025">`;
  days.forEach(d => { html += `<div class="cal-day header">${d}</div>`; });
  for (let i = 0; i < startDay; i++) html += `<div class="cal-day"></div>`;
  for (let d = 1; d <= totalDays; d++) {
    if (d == highlightDay) {
      html += `<div class="cal-day special" aria-label="May 5, 2025 — our beginning">
        <svg class="heart-circle" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12,21 C12,21 3,15 3,9 A5,5 0 0,1 12,6 A5,5 0 0,1 21,9 C21,15 12,21 12,21Z"
            stroke="#C8323C" stroke-width="2" fill="none"
            stroke-dasharray="60" stroke-dashoffset="60"
            style="animation:heart-draw 1.5s .5s ease forwards;"/>
        </svg>
        ${d}
      </div>`;
    } else {
      html += `<div class="cal-day">${d}</div>`;
    }
  }
  html += `</div><p style="text-align:center;margin-top:8px;font-size:.75rem;">
    <strong>05.05.2025 ♡</strong></p>`;
  return html;
}

function buildQualityStickers() {
  const row = document.getElementById('qualities-row');
  if (!row) return;
  CONFIG.qualities.forEach((q, i) => {
    const btn = document.createElement('div');
    btn.className = 'quality-sticker';
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-label', `Flip to reveal: ${q}`);
    btn.innerHTML = `<span class="quality-front">✨ tap me!</span>
                     <span class="quality-back">${q}</span>`;
    btn.addEventListener('click', () => {
      btn.classList.toggle('flipped');
      spawnHeartBurst(btn.getBoundingClientRect().left + 20, btn.getBoundingClientRect().top + 20);
    });
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') btn.click(); });
    row.appendChild(btn);
  });
}

function buildClosingNote() {
  const note = document.getElementById('closing-note');
  if (!note) return;
  note.innerHTML = CONFIG.closingNote.map(l => `<p>${l}</p>`).join('');
}

function setupMemoryScrollReveal() {
  const cards = document.querySelectorAll('.memory-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => observer.observe(c));
}

/* ═══════════════════════════════════════════════════════════
   TAB 4 — LETTER
═══════════════════════════════════════════════════════════ */
function initLetter() {
  letterInitialized = true;
  const envBtn = document.getElementById('envelope-btn');
  envBtn?.addEventListener('click', openLetter);
  document.getElementById('letter-fold-btn')?.addEventListener('click', foldLetter);
  document.getElementById('letter-reread-btn')?.addEventListener('click', () => {
    foldLetter();
    setTimeout(openLetter, 600);
  });
}

function openLetter() {
  // Animate envelope flap
  const flap = document.getElementById('env-flap');
  if (flap) {
    flap.style.animation = 'envelope-flap .6s ease forwards';
    flap.style.transformOrigin = 'bottom';
  }

  // Wax seal pop
  const seal = document.getElementById('env-seal');
  if (seal) seal.style.animation = 'wax-seal-pop .5s .2s ease forwards';

  puppy.setState('love');
  puppy.say(randItem(CONFIG.puppyLines.letter));

  setTimeout(() => {
    // Show letter
    const scroll = document.getElementById('letter-scroll');
    if (scroll) scroll.classList.add('open');
    renderLetterLines();
    // Hide envelope
    document.getElementById('envelope-wrap')?.style.setProperty('display', 'none');
    // Show actions
    document.getElementById('letter-actions')?.style.setProperty('display', 'flex');
    // Float hearts off letter
    spawnLetterHearts();
  }, 900);
}

function foldLetter() {
  const scroll = document.getElementById('letter-scroll');
  if (scroll) scroll.classList.remove('open');
  document.getElementById('envelope-wrap')?.style.setProperty('display', '');
  document.getElementById('letter-actions')?.style.setProperty('display', 'none');
  const flap = document.getElementById('env-flap');
  if (flap) { flap.style.animation = ''; }
  const seal = document.getElementById('env-seal');
  if (seal) { seal.style.animation = ''; seal.style.opacity = '1'; seal.style.transform = ''; }
}

function renderLetterLines() {
  const container = document.getElementById('letter-lines');
  if (!container) return;
  container.innerHTML = '';
  const paragraphs = CONFIG.LETTER.split('\n');
  paragraphs.forEach((para, i) => {
    const el = document.createElement('span');
    el.className = 'letter-line';
    if (para.startsWith('Rokith')) {
      el.innerHTML = `<span class="letter-sig">Rokith</span>
        <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true" style="display:inline-block;vertical-align:middle;margin-left:4px;">
          <path d="M2 10 Q10 2 15 10 Q20 2 28 8" stroke="#C8323C" stroke-width="2" fill="none"
            stroke-linecap="round"
            stroke-dasharray="60" stroke-dashoffset="60"
            style="animation:draw-stroke .8s ease forwards; --dash-len:60;"/>
        </svg>`;
    } else {
      el.innerHTML = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '&nbsp;';
    }
    el.style.animationDelay = i * 0.12 + 's';
    container.appendChild(el);
    // Trigger fade-up after small delay
    setTimeout(() => el.classList.add('visible'), 100 + i * 120);
  });
}

function spawnLetterHearts() {
  const paper = document.getElementById('letter-scroll');
  if (!paper) return;
  const rect = paper.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.style.cssText = `position:fixed;left:${rect.left + rand(20, rect.width - 20)}px;
        top:${rect.top + rand(20, rect.height - 40)}px;font-size:${rand(14, 22)}px;
        pointer-events:none;z-index:9999;animation:heart-fly-out 1.2s ease forwards;`;
      el.textContent = randItem(['💗','💕','💖','❤️']);
      el.style.setProperty('--fx', rand(-40, 40) + 'px');
      el.style.setProperty('--fy', rand(-80, -40) + 'px');
      el.style.setProperty('--fr', rand(-20, 20) + 'deg');
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 300);
  }
}

/* ═══════════════════════════════════════════════════════════
   TAB 5 — ARCADE
═══════════════════════════════════════════════════════════ */
let arcadeGiftsEarned = new Set(JSON.parse(localStorage.getItem('giftsEarned') || '[]'));
let grandGiftUnlocked = localStorage.getItem('grandGift') === '1';
let currentGame = null;

function initArcade() {
  arcadeInitialized = true;
  buildGiftShelf();

  // Game card buttons
  document.getElementById('btn-catch')?.addEventListener('click', () => startGame('catch'));
  document.getElementById('btn-memory')?.addEventListener('click', () => startGame('memory'));
  document.getElementById('btn-balloon')?.addEventListener('click', () => startGame('balloon'));

  // Back buttons
  document.querySelectorAll('.back-link').forEach(btn => {
    btn.addEventListener('click', backToHub);
  });
}

function backToHub() {
  document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('arcade-hub').style.display = 'flex';
  currentGame = null;
}

function startGame(gameId) {
  document.getElementById('arcade-hub').style.display = 'none';
  document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(`game-${gameId}`);
  if (screen) screen.classList.add('active');
  currentGame = gameId;
  puppy.say(randItem(CONFIG.puppyLines.gameStart));

  if (gameId === 'catch') initCatchGame();
  if (gameId === 'memory') initMemoryMatch();
  if (gameId === 'balloon') initBalloonGame();
}

/* ── GIFT SHELF ─────────────────────────────────────────── */
function buildGiftShelf() {
  const shelf = document.getElementById('shelf-items');
  if (!shelf) return;
  shelf.innerHTML = '';
  if (arcadeGiftsEarned.size === 0 && !grandGiftUnlocked) {
    shelf.innerHTML = '<span style="color:var(--rose);font-size:.8rem;font-family:var(--font-hand);">play games to win gifts! 🎁</span>';
    return;
  }
  arcadeGiftsEarned.forEach(idx => {
    const g = CONFIG.GIFTS[idx];
    if (!g) return;
    const item = document.createElement('div');
    item.className = 'shelf-item anim-pop-in';
    item.textContent = `${g.icon} ${g.name}`;
    shelf.appendChild(item);
  });
  if (grandGiftUnlocked) {
    const grand = document.createElement('div');
    grand.className = 'shelf-item anim-pop-in';
    grand.style.background = 'var(--gold)';
    grand.textContent = `${CONFIG.GRAND_GIFT.icon} ${CONFIG.GRAND_GIFT.name}`;
    shelf.appendChild(grand);
  }
}

function saveGift(roundIndex) {
  arcadeGiftsEarned.add(roundIndex);
  localStorage.setItem('giftsEarned', JSON.stringify([...arcadeGiftsEarned]));
  if (arcadeGiftsEarned.size >= 3 && !grandGiftUnlocked) {
    grandGiftUnlocked = true;
    localStorage.setItem('grandGift', '1');
  }
}

function showGiftReveal(giftIndex) {
  const isGrand = giftIndex === 'grand';
  const gift = isGrand ? CONFIG.GRAND_GIFT : CONFIG.GIFTS[giftIndex];
  const reveal = document.getElementById('gift-reveal');
  if (!reveal) return;
  reveal.classList.add('open');
  const icon = document.getElementById('gift-icon');
  const name = document.getElementById('gift-name');
  const note = document.getElementById('gift-note');
  if (icon) icon.textContent = gift.icon;
  if (name) name.textContent = gift.name;
  if (note) note.textContent = gift.note;
  spawnConfetti(40);
  puppy.setState('cheer');
  puppy.say(randItem(CONFIG.puppyLines.gameEnd));
  document.getElementById('gift-close-btn')?.addEventListener('click', () => {
    reveal.classList.remove('open');
    backToHub();
    buildGiftShelf();
    if (grandGiftUnlocked && isGrand === false && arcadeGiftsEarned.size >= 3) {
      setTimeout(() => showGiftReveal('grand'), 600);
    }
  }, { once: true });
}

/* ── GAME 1: CATCH THE HEARTS ───────────────────────────── */
let catchRAF = null;
function initCatchGame() {
  const canvas = document.getElementById('canvas-catch');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.clientWidth; const H = canvas.clientHeight;
  canvas.width = W; canvas.height = H;

  let score = 0;
  let timeLeft = 25;
  let basketX = W / 2;
  const basketW = 60;
  const basketH = 24;
  let hearts = [];
  let running = true;

  // Basket control
  function moveBasket(x) { basketX = Math.max(basketW/2, Math.min(W - basketW/2, x)); }

  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();
    moveBasket((e.clientX - rect.left) * (W / rect.width));
  }, { passive: true });
  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    moveBasket((e.clientX - rect.left) * (W / rect.width));
  }, { passive: true });

  document.addEventListener('keydown', function kh(e) {
    if (!running) { document.removeEventListener('keydown', kh); return; }
    if (e.key === 'ArrowLeft') moveBasket(basketX - 24);
    if (e.key === 'ArrowRight') moveBasket(basketX + 24);
  });

  // Spawn hearts
  function spawnHeart() {
    if (!running) return;
    const isGold = Math.random() < 0.1;
    hearts.push({
      x: rand(20, W - 20), y: -20,
      speed: rand(2, 4.5),
      size: rand(18, 28),
      emoji: isGold ? '⭐' : randItem(['💗','💕','💖','❤️']),
      points: isGold ? 3 : 1
    });
    setTimeout(spawnHeart, rand(600, 1200));
  }
  spawnHeart();

  // Timer
  const timerEl = document.getElementById('catch-timer');
  const scoreEl = document.getElementById('catch-score');
  const timerInterval = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      running = false;
      cancelAnimationFrame(catchRAF);
      endCatch(score);
    }
  }, 1000);

  // Draw loop
  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Basket
    ctx.fillStyle = '#FFF6EA';
    ctx.strokeStyle = '#C8323C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(basketX - basketW/2, H - basketH - 10, basketW, basketH, 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#E88A98';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎀', basketX, H - 12);

    // Hearts
    ctx.font = '24px serif';
    hearts.forEach((h, i) => {
      h.y += h.speed;
      ctx.fillText(h.emoji, h.x, h.y);
      // Catch check
      if (h.y > H - basketH - 20 && Math.abs(h.x - basketX) < basketW / 2) {
        score += h.points;
        if (scoreEl) scoreEl.textContent = `💗 ${score}`;
        hearts.splice(i, 1);
        spawnHeartBurst(canvas.getBoundingClientRect().left + h.x, canvas.getBoundingClientRect().top + h.y);
      }
      // Off screen
      if (h.y > H + 20) hearts.splice(i, 1);
    });

    if (running) catchRAF = requestAnimationFrame(draw);
  }
  if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
  if (scoreEl) scoreEl.textContent = '💗 0';
  draw();
}

function endCatch(score) {
  const already = arcadeGiftsEarned.has(0);
  if (!already) saveGift(0);
  setTimeout(() => showGiftReveal(already ? null : 0), 500);
}

/* ── GAME 2: MEMORY MATCH ───────────────────────────────── */
function initMemoryMatch() {
  const grid = document.getElementById('memory-match-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const emojis = ['🎂','🎀','🧸','💗','⭐','📷'];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - .5);
  let flipped = [], matched = 0, busy = false;

  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.emoji = emoji;
    card.dataset.index = i;
    card.innerHTML = `<div class="mem-card-front" aria-hidden="true">💝</div>
                      <div class="mem-card-back" aria-hidden="true">${emoji}</div>`;
    card.setAttribute('aria-label', 'memory card');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    card.addEventListener('click', () => flipCard(card));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') flipCard(card); });
    grid.appendChild(card);
  });

  function flipCard(card) {
    if (busy || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flipped.push(card);
    if (flipped.length === 2) {
      busy = true;
      setTimeout(() => {
        if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
          flipped.forEach(c => { c.classList.add('matched'); c.classList.remove('flipped'); });
          matched++;
          spawnHeartBurst(
            flipped[0].getBoundingClientRect().left + 20,
            flipped[0].getBoundingClientRect().top + 20
          );
          if (matched === 6) {
            const already = arcadeGiftsEarned.has(1);
            if (!already) saveGift(1);
            setTimeout(() => showGiftReveal(already ? null : 1), 600);
          }
        } else {
          flipped.forEach(c => c.classList.remove('flipped'));
        }
        flipped = []; busy = false;
      }, 900);
    }
  }
}

/* ── GAME 3: POP THE BALLOONS ───────────────────────────── */
let balloonRAF = null;
function initBalloonGame() {
  const canvas = document.getElementById('canvas-balloon');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.clientWidth; const H = canvas.clientHeight;
  canvas.width = W; canvas.height = H;

  let score = 0;
  let timeLeft = 20;
  let balloons = [];
  let running = true;
  let cuiteLetters = new Set();
  const target = 'CUITE PIE'.replace(' ','').split('');

  function spawnBalloon() {
    if (!running) return;
    const isLetter = Math.random() < 0.25 && cuiteLetters.size < target.length;
    const letter = isLetter ? target[Math.floor(Math.random() * target.length)] : null;
    if (letter) cuiteLetters.add(letter);
    balloons.push({
      x: rand(30, W - 30), y: H + 40,
      speed: rand(1.5, 3.2), r: rand(22, 36),
      color: randItem(['#F7C9D0','#C8323C','#E7B94A','#E88A98']),
      letter: letter, popped: false
    });
    setTimeout(spawnBalloon, rand(400, 900));
  }
  spawnBalloon();

  const timerEl = document.getElementById('balloon-timer');
  const scoreEl = document.getElementById('balloon-score');
  const timerInt = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInt);
      running = false;
      cancelAnimationFrame(balloonRAF);
      endBalloon(score);
    }
  }, 1000);

  function popBalloon(bln, cx, cy) {
    if (bln.popped) return;
    bln.popped = true;
    score++;
    if (scoreEl) scoreEl.textContent = `💗 ${score}`;
    spawnHeartBurst(cx, cy);
  }

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    balloons.forEach(b => {
      if (!b.popped && Math.hypot(mx - b.x, my - b.y) < b.r) {
        popBalloon(b, e.clientX, e.clientY);
      }
    });
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    balloons = balloons.filter(b => {
      if (b.popped) return false;
      b.y -= b.speed;
      if (b.y < -50) return false;
      // Draw balloon
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Shine
      ctx.beginPath();
      ctx.arc(b.x - b.r * .3, b.y - b.r * .3, b.r * .18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      ctx.fill();
      // String
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + b.r);
      ctx.lineTo(b.x, b.y + b.r + 24);
      ctx.strokeStyle = '#E88A98'; ctx.lineWidth = 1.5;
      ctx.stroke();
      // Letter
      if (b.letter) {
        ctx.fillStyle = '#7A2428';
        ctx.font = `bold ${b.r * .8}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(b.letter, b.x, b.y);
      }
      return true;
    });
    if (running) balloonRAF = requestAnimationFrame(draw);
  }
  if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
  if (scoreEl) scoreEl.textContent = '💗 0';
  draw();
}

function endBalloon(score) {
  const already = arcadeGiftsEarned.has(2);
  if (!already) saveGift(2);
  setTimeout(() => showGiftReveal(already ? null : 2), 500);
}

// expose init functions globally (flags are module-level, accessed via getters)
window.initPhotos   = initPhotos;
window.initMemories = initMemories;
window.initLetter   = initLetter;
window.initArcade   = initArcade;

// Expose flag getters so main.js can check without stale copies
Object.defineProperty(window, 'photosInitialized',   { get: () => photosInitialized });
Object.defineProperty(window, 'memoriesInitialized',  { get: () => memoriesInitialized });
Object.defineProperty(window, 'letterInitialized',    { get: () => letterInitialized });
Object.defineProperty(window, 'arcadeInitialized',    { get: () => arcadeInitialized });
