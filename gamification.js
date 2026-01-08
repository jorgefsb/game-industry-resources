// Gamification System 2.0: XP, Progression & Bilingual Bot

// Game State
const gameState = {
  xp: 0,
  level: 1,
  xpToNextLevel: 100,
  achievements: [],
  lang: 'es' // Default language
};

// Vocabulary (Bilingual)
const vocab = {
  es: {
    level: "NIVEL",
    xpObj: "XP",
    welcome: "¡Psst! Bienvenido al Nexus para Game Devs. 🕹️",
    konamiHint: "Dicen que los verdaderos gamers intentan ↑↑↓↓...",
    clickSecret: "¡Haz click en todo! Hay secretos escondidos.",
    jobsHint: "Los mejores trabajos están en la sección Jobs.",
    konamiSuccess: "¡MODO DIOS ACTIVADO! 🚀 (Konami Code)",
    levelUp: "¡LEVEL UP! Ahora eres Nivel",
    achievements: {
      explorer: "Explorador (Visitaste todas las secciones)",
      hunter: "Cazador de Bugs (Encontraste el secreto)"
    }
  },
  en: {
    level: "LEVEL",
    xpObj: "XP",
    welcome: "Psst! Welcome to the Game Dev Nexus. 🕹️",
    konamiHint: "They say real gamers try ↑↑↓↓...",
    clickSecret: "Click everything! Secrets are hidden everywhere.",
    jobsHint: "Top tier jobs are waiting in the Jobs section.",
    konamiSuccess: "GOD MODE ACTIVATED! 🚀 (Konami Code)",
    levelUp: "LEVEL UP! You are now Level",
    achievements: {
      explorer: "Explorer (Visited all sections)",
      hunter: "Bug Hunter (Found the secret)"
    }
  }
};

// Initialize UI
function initGamification() {
  // Load saved state
  const savedState = localStorage.getItem('gamedev_rpg_state');
  if (savedState) Object.assign(gameState, JSON.parse(savedState));

  // Create XP UI
  const xpUI = document.createElement('div');
  xpUI.className = 'xp-container';
  xpUI.innerHTML = `
    <span class="level-badge">${vocab[gameState.lang].level} <span id="lvlNum">${gameState.level}</span></span>
    <div class="xp-bar-bg">
      <div class="xp-bar-fill" id="xpFill" style="width: ${(gameState.xp / gameState.xpToNextLevel) * 100}%"></div>
    </div>
  `;
  document.body.appendChild(xpUI);

  updateBotMessage(vocab[gameState.lang].welcome);
}

function addXP(amount, event) {
  const oldLevel = gameState.level;
  gameState.xp += amount;

  // Level Up Logic
  if (gameState.xp >= gameState.xpToNextLevel) {
    gameState.xp -= gameState.xpToNextLevel;
    gameState.level++;
    gameState.xpToNextLevel = Math.floor(gameState.xpToNextLevel * 1.5);
    playSound('success');
    updateBotMessage(`${vocab[gameState.lang].levelUp} ${gameState.level}! 🎉`);
  }

  // Visual Update
  document.getElementById('lvlNum').innerText = gameState.level;
  document.getElementById('xpFill').style.width = `${(gameState.xp / gameState.xpToNextLevel) * 100}%`;

  // Floating Text (Particle)
  if (event && event.clientX) {
    showFloatingXP(amount, event.clientX, event.clientY);
  }

  saveState();
}

function showFloatingXP(amount, x, y) {
  const floatEl = document.createElement('div');
  floatEl.className = 'float-xp';
  floatEl.innerText = `+${amount} XP`;
  floatEl.style.left = `${x}px`;
  floatEl.style.top = `${y}px`;
  document.body.appendChild(floatEl);
  setTimeout(() => floatEl.remove(), 1000);
}

function updateBotMessage(msg) {
  const bubble = document.getElementById('guideBubble');
  const bot = document.getElementById('guideBot');
  if (bubble && bot) {
    bubble.innerText = msg;
    bot.classList.remove('active');
    void bot.offsetWidth; // trigger reflow
    bot.classList.add('active');
  }
}

function saveState() {
  localStorage.setItem('gamedev_rpg_state', JSON.stringify(gameState));
}

// Sound System (Simplified)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'hover') {
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  } else if (type === 'click') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'success') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initGamification();

  // Basic Interactions
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', (e) => {
      playSound('click');
      addXP(10, e);
    });
  });

  // Konami Code - ENHANCED VERSION
  let kKeys = [];
  const konami = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";
  document.addEventListener('keydown', (e) => {
    kKeys.push(e.key);
    if (kKeys.toString().indexOf(konami) >= 0) {
      // EPIC CELEBRATION MODE
      addXP(500, { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
      updateBotMessage(vocab[gameState.lang].konamiSuccess);

      // Create fullscreen overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        animation: fadeIn 0.3s;
      `;

      overlay.innerHTML = `
        <div style="text-align: center; animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
          <h1 style="font-family: 'Press Start 2P', monospace; font-size: 3rem; color: #00ffff; text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff; margin-bottom: 2rem; animation: rainbow 2s infinite;">
            🚀 GOD MODE 🚀
          </h1>
          <p style="font-size: 1.5rem; color: #ff2d95; font-weight: bold; margin-bottom: 1rem;">
            ¡KONAMI CODE ACTIVADO!
          </p>
          <p style="font-size: 1rem; color: #fff; opacity: 0.8;">
            +500 XP • Achievement Unlocked
          </p>
        </div>
      `;

      document.body.appendChild(overlay);

      // Rainbow effect on body
      document.body.style.animation = 'rainbow 2s infinite, shake 0.5s';

      // Particle explosion
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${['#00ffff', '#ff2d95', '#ffd700'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: 50%;
            top: 50%;
            animation: explode 2s forwards;
          `;
          particle.style.setProperty('--angle', Math.random() * 360 + 'deg');
          particle.style.setProperty('--distance', 200 + Math.random() * 300 + 'px');
          document.body.appendChild(particle);
          setTimeout(() => particle.remove(), 2000);
        }, i * 20);
      }

      // Remove overlay after 5 seconds
      setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.5s';
        setTimeout(() => {
          overlay.remove();
          document.body.style.animation = '';
        }, 500);
      }, 5000);

      kKeys = [];
    }
  });

  // Guide Bot Click
  document.getElementById('guideBot')?.addEventListener('click', (e) => {
    addXP(5, e);
    const hints = [vocab[gameState.lang].konamiHint, vocab[gameState.lang].jobsHint, vocab[gameState.lang].clickSecret];
    updateBotMessage(hints[Math.floor(Math.random() * hints.length)]);
  });

  // Typing Sounds for Inputs
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('keydown', () => playSound('type'));
  });
});

function playSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'hover') {
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  } else if (type === 'click') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'success') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
  } else if (type === 'type') {
    // Mechanical keyboard sound simulation (short click)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.start(); osc.stop(audioCtx.currentTime + 0.03);
  }
}
