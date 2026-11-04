// ============================================================
// candles.js — candle blow-out logic (mic + tap fallback)
// ============================================================

let candlesOut = 0;
let totalCandles = CONFIG.CANDLE_COUNT;
let micStream = null;
let audioCtx = null;
let analyser = null;
let micActive = false;
let wishInitialized = false;

/* ── Init wish tab ──────────────────────────────────────────── */
function initWish() {
  if (wishInitialized) return;
  wishInitialized = true;

  buildHBLetters();
  buildCake();
  buildBunting();

  const blowBtn = document.getElementById('blow-btn');
  blowBtn?.addEventListener('click', requestMic);

  const relightBtn = document.getElementById('relight-btn');
  relightBtn?.addEventListener('click', relightCandles);

  const nextBtn = document.getElementById('wish-next-btn');
  nextBtn?.addEventListener('click', () => navigateTo('photos'));
}

/* ── Happy Birthday sticker letters ─────────────────────────── */
function buildHBLetters() {
  const wrap = document.getElementById('hb-letters');
  if (!wrap) return;
  const text = 'happy birthday';
  [...text].forEach((ch, i) => {
    if (ch === ' ') {
      const sp = document.createElement('span');
      sp.style.width = '12px';
      sp.style.display = 'inline-block';
      wrap.appendChild(sp);
      return;
    }
    const el = document.createElement('span');
    el.className = 'hb-letter';
    el.textContent = ch;
    el.style.setProperty('--i', i);
    el.style.animationDelay = i * 0.08 + 's';
    wrap.appendChild(el);
  });
}

/* ── Build the cake with candles ─────────────────────────── */
function buildCake() {
  const candleRow = document.getElementById('candle-row');
  if (!candleRow) return;
  candleRow.innerHTML = '';
  candlesOut = 0;

  for (let i = 0; i < totalCandles; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'candle-item';

    const btn = document.createElement('button');
    btn.className = 'candle-btn';
    btn.setAttribute('aria-label', `blow out candle ${i + 1}`);
    btn.dataset.index = i;

    // Flame SVG
    btn.innerHTML = `
      <svg class="flame-svg" id="flame-${i}" viewBox="0 0 20 32" aria-hidden="true">
        <defs>
          <radialGradient id="fg${i}" cx="50%" cy="70%">
            <stop offset="0%" stop-color="#FFF176"/>
            <stop offset="40%" stop-color="#FFB300"/>
            <stop offset="100%" stop-color="#C8323C" stop-opacity=".8"/>
          </radialGradient>
          <filter id="glow${i}">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <ellipse cx="10" cy="22" rx="6" ry="8" fill="url(#fg${i})" filter="url(#glow${i})"
          style="animation:flame-flicker .6s ease-in-out infinite; transform-origin:10px 28px;"/>
        <ellipse cx="10" cy="18" rx="3.5" ry="6" fill="#FFF9C4" opacity=".9"
          style="animation:flame-flicker .5s .1s ease-in-out infinite; transform-origin:10px 24px;"/>
      </svg>
      <svg class="smoke-svg" id="smoke-${i}" viewBox="0 0 12 24" aria-hidden="true">
        <path d="M6 22 Q9 16 6 10 Q3 4 6 0" stroke="#aaa" stroke-width="2" fill="none"
          stroke-linecap="round" style="animation:smoke-wisp 1.5s ease infinite;"/>
      </svg>
      <svg class="candle-body-svg" viewBox="0 0 16 44" aria-hidden="true">
        <rect x="2" y="4" width="12" height="38" rx="6" fill="#F7C9D0"/>
        <rect x="2" y="4" width="12" height="10" rx="6" fill="#E88A98"/>
        <line x1="8" y1="0" x2="8" y2="6" stroke="#4A1417" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;

    btn.addEventListener('click', () => blowOutCandle(i));
    wrap.appendChild(btn);
    candleRow.appendChild(wrap);
  }
}

/* ── Blow out a single candle ─────────────────────────────── */
function blowOutCandle(index) {
  const flame = document.getElementById(`flame-${index}`);
  const smoke = document.getElementById(`smoke-${index}`);
  if (!flame || flame.classList.contains('out')) return;

  flame.classList.add('out');
  flame.style.display = 'none';
  if (smoke) {
    smoke.classList.add('active');
    setTimeout(() => { if (smoke) smoke.classList.remove('active'); }, 2000);
  }

  candlesOut++;
  if (candlesOut >= totalCandles) {
    setTimeout(allCandlesOut, 400);
  }
}

function allCandlesOut() {
  // Stop mic
  stopMic();
  // Show wish message
  const wishMsg = document.getElementById('wish-msg');
  if (wishMsg) wishMsg.classList.add('visible');

  // Confetti + balloons
  spawnConfetti(50);
  spawnBalloons();

  // Mochi cheer
  puppy.setState('cheer');
  puppy.say(randItem(CONFIG.puppyLines.blown));

  // Show next btn
  const nextBtn = document.getElementById('wish-next-btn');
  if (nextBtn) {
    nextBtn.style.display = 'inline-flex';
    nextBtn.classList.add('anim-pop-in');
  }
  document.getElementById('relight-btn')?.style.setProperty('display', 'inline-block');
}

/* ── Relight candles ─────────────────────────────────────── */
function relightCandles() {
  buildCake();
  const wishMsg = document.getElementById('wish-msg');
  if (wishMsg) wishMsg.classList.remove('visible');
  const nextBtn = document.getElementById('wish-next-btn');
  if (nextBtn) nextBtn.style.display = 'none';
  document.getElementById('relight-btn')?.style.setProperty('display', 'none');
  puppy.say('let\'s do it again! 🕯️');
}

/* ── Microphone ──────────────────────────────────────────── */
async function requestMic() {
  const blowBtn = document.getElementById('blow-btn');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    fallbackBlow();
    return;
  }
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    micActive = true;
    if (blowBtn) blowBtn.textContent = '🎤 listening… blow now!';
    puppy.say('i can hear you! blow the candles! 💨');
    listenForBlow();
  } catch (err) {
    fallbackBlow();
  }
}

function listenForBlow() {
  if (!micActive || !analyser) return;
  const data = new Uint8Array(analyser.frequencyBinCount);
  let blowFrames = 0;

  function checkVolume() {
    if (!micActive) return;
    analyser.getByteFrequencyData(data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    if (avg > 28) {
      blowFrames++;
      if (blowFrames > 4) {
        // Blow out next unextinguished candle
        for (let i = 0; i < totalCandles; i++) {
          const flame = document.getElementById(`flame-${i}`);
          if (flame && !flame.classList.contains('out') && flame.style.display !== 'none') {
            blowOutCandle(i);
            blowFrames = 0;
            break;
          }
        }
      }
    } else {
      blowFrames = 0;
    }
    if (candlesOut < totalCandles) requestAnimationFrame(checkVolume);
  }
  requestAnimationFrame(checkVolume);
}

function stopMic() {
  micActive = false;
  if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
  analyser = null;
}

function fallbackBlow() {
  puppy.say('tap each candle to blow it out! 🕯️');
  const blowBtn = document.getElementById('blow-btn');
  if (blowBtn) {
    blowBtn.textContent = '💨 tap to blow all!';
    blowBtn.onclick = () => {
      for (let i = 0; i < totalCandles; i++) {
        setTimeout(() => blowOutCandle(i), i * 300);
      }
    };
  }
}

/* ── Bunting ─────────────────────────────────────────────── */
function buildBunting() {
  const wrap = document.querySelector('.bunting-wrap');
  if (!wrap) return;
  const colors = ['#C8323C','#F7C9D0','#E7B94A','#E88A98','#FFF6EA'];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 400 50');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '50');
  svg.setAttribute('aria-hidden', 'true');
  // string
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M0 10 Q50 30 100 10 Q150 30 200 10 Q250 30 300 10 Q350 30 400 10');
  path.setAttribute('stroke', '#E7B94A'); path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');
  svg.appendChild(path);
  // flags
  const positions = [30, 90, 150, 210, 270, 330];
  positions.forEach((x, i) => {
    const tri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const y = i % 2 === 0 ? 14 : 20;
    tri.setAttribute('points', `${x-10},${y} ${x+10},${y} ${x},${y+22}`);
    tri.setAttribute('fill', colors[i % colors.length]);
    if (i % 2 === 0) {
      // gingham pattern
      tri.setAttribute('fill', 'url(#gh)');
    }
    svg.appendChild(tri);
  });
  wrap.appendChild(svg);
}

// expose
window.initWish = initWish;
