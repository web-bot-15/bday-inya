// ============================================================
// music.js — cassette tape music player
// ============================================================

const musicPlayer = (() => {
  let audio = null;
  let isPlaying = false;
  let isMuted = localStorage.getItem('muted') === '1';
  let expanded = false;
  let noFile = false;

  function init() {
    const player = document.getElementById('music-player');
    if (!player) return;
    player.classList.add('visible');

    audio = new Audio(CONFIG.SONG.src);
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.6;

    audio.addEventListener('error', () => {
      noFile = true;
      updateUI();
    });

    // Update UI
    const title = player.querySelector('.music-title');
    if (title) title.textContent = `🎵 ${CONFIG.SONG.title} — ${CONFIG.SONG.artist}`;

    const cassette = player.querySelector('.music-cassette');
    cassette?.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlayPause();
    });
    cassette?.addEventListener('contextmenu', e => { e.preventDefault(); togglePanel(); });

    const panelBtn = player.querySelector('.music-panel-toggle');
    panelBtn?.addEventListener('click', togglePanel);

    const playBtn = player.querySelector('.music-play-btn');
    playBtn?.addEventListener('click', togglePlayPause);

    const muteBtn = player.querySelector('.music-mute-btn');
    muteBtn?.addEventListener('click', toggleMute);

    const vol = player.querySelector('.music-vol');
    vol?.addEventListener('input', e => {
      if (audio) audio.volume = e.target.value;
    });

    document.addEventListener('click', e => {
      if (!player.contains(e.target)) closePanel();
    });

    updateUI();
  }

  function play() {
    if (!audio || noFile) return;
    // Fade in
    audio.volume = 0;
    audio.play().then(() => {
      isPlaying = true;
      let v = 0;
      const target = isMuted ? 0 : 0.6;
      const step = setInterval(() => {
        v = Math.min(v + 0.04, target);
        if (audio) audio.volume = v;
        if (v >= target) clearInterval(step);
      }, 80);
      updateUI();
    }).catch(() => { noFile = true; updateUI(); });
  }

  function togglePlayPause() {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().catch(() => {});
      isPlaying = true;
    }
    updateUI();
  }

  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('muted', isMuted ? '1' : '0');
    if (audio) audio.volume = isMuted ? 0 : 0.6;
    updateUI();
  }

  function togglePanel() {
    expanded = !expanded;
    const panel = document.querySelector('.music-panel');
    if (panel) panel.classList.toggle('open', expanded);
  }

  function closePanel() {
    expanded = false;
    const panel = document.querySelector('.music-panel');
    if (panel) panel.classList.remove('open');
  }

  function updateUI() {
    const reels = document.querySelectorAll('.cassette-reel');
    reels.forEach(r => r.classList.toggle('spinning', isPlaying && !isMuted && !noFile));

    const playBtn = document.querySelector('.music-play-btn');
    if (playBtn) playBtn.textContent = isPlaying ? '⏸' : '▶';

    const muteBtn = document.querySelector('.music-mute-btn');
    if (muteBtn) muteBtn.textContent = isMuted ? '🔇' : '🔊';

    const noFileEl = document.querySelector('.music-no-file');
    if (noFileEl) noFileEl.style.display = noFile ? 'block' : 'none';

    // Show tooltip if no file
    const cassette = document.querySelector('.music-cassette');
    if (cassette) cassette.title = noFile ? 'add your song in assets/audio/song.mp3' : (isPlaying ? 'pause music' : 'play music');
  }

  return { init, play, togglePlayPause, toggleMute };
})();
