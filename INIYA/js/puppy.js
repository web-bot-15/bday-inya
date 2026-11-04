// ============================================================
// puppy.js — Mochi the puppy guide, states + dialogue
// ============================================================

const puppy = (() => {
  let bubbleTimer = null;
  let inactivityTimer = null;
  const INACTIVITY_MS = 25000; // 25s until sleep

  /* ── State classes ───────────────────────────────────────── */
  const STATES = ['idle','happy','wave','think','sad','cheer','sleep','point','love'];

  function setState(state) {
    const svg = document.getElementById('mochi-svg');
    if (!svg) return;
    STATES.forEach(s => svg.classList.remove('mochi-' + s));
    svg.classList.add('mochi-' + state);
    // Handle special animation tweaks
    const eyes = svg.querySelectorAll('.mochi-eye');
    const tail = svg.querySelector('.mochi-tail');
    const tongue = svg.querySelector('.mochi-tongue');
    const arms = svg.querySelectorAll('.mochi-arm');

    if (state === 'sleep') {
      if (eyes) eyes.forEach(e => e.style.transform = 'scaleY(.05)');
      if (tongue) tongue.style.display = 'none';
    } else {
      if (eyes) eyes.forEach(e => e.style.transform = '');
      if (tongue) tongue.style.display = '';
    }

    if (state === 'cheer' || state === 'happy') {
      if (arms) arms.forEach((a, i) => {
        a.style.transform = i === 0 ? 'rotate(-40deg) translateY(-4px)' : 'rotate(40deg) translateY(-4px)';
      });
      setTimeout(() => { if (arms) arms.forEach(a => a.style.transform = ''); }, 1200);
    }
  }

  function say(text, duration = 5000) {
    const bubble = document.getElementById('mochi-bubble');
    if (!bubble) return;
    const content = bubble.querySelector('.bubble-text');
    if (content) {
      content.textContent = '';
      bubble.classList.remove('hidden');
      // typewriter effect
      let i = 0;
      const timer = setInterval(() => {
        content.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(timer);
      }, 24);
    }

    clearTimeout(bubbleTimer);
    if (duration > 0) {
      bubbleTimer = setTimeout(() => bubble.classList.add('hidden'), duration);
    }
  }

  function hop() {
    const svg = document.getElementById('mochi-svg');
    if (!svg) return;
    svg.classList.remove('anim-hop');
    void svg.offsetWidth; // reflow
    svg.classList.add('anim-hop');
    setTimeout(() => svg.classList.remove('anim-hop'), 500);
  }

  function show() {
    const wrap = document.getElementById('mochi-wrap');
    if (wrap) wrap.classList.add('visible');
  }

  /* ── Setup interactions ─────────────────────────────────── */
  function setup() {
    const svg = document.getElementById('mochi-svg');
    if (!svg) return;

    svg.addEventListener('click', e => {
      hop();
      setState('happy');
      say(randItem(CONFIG.tips));
      spawnHeartBurst(e.clientX, e.clientY);
      resetInactivity();
    });

    // Sleep after inactivity
    document.addEventListener('pointerdown', resetInactivity);
    document.addEventListener('keydown', resetInactivity);
    resetInactivity();
  }

  function resetInactivity() {
    clearTimeout(inactivityTimer);
    const svg = document.getElementById('mochi-svg');
    if (svg && svg.classList.contains('mochi-sleep')) {
      // Wake up with stretch
      setState('happy');
      say('*stretch* i\'m awake! 🐾');
    }
    inactivityTimer = setTimeout(() => {
      setState('sleep');
    }, INACTIVITY_MS);
  }

  document.addEventListener('DOMContentLoaded', setup);

  return { setState, say, hop, show };
})();
