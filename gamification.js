// Gamification System 2.0: XP, Progression & Bilingual Bot
// Concept: "Retro Arcade Terminal" - XP & Progression

// Game State
const gameState = {
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
    achievements: [],
    lang: localStorage.getItem('gamedev_lang') || 'es',
    soundEnabled: localStorage.getItem('gamedev_sound') !== 'false'
};

// Vocabulary (Bilingual for Bot & UI)
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

// Sound System (Simplified Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (!gameState.soundEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    switch(type) {
        case 'hover':
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start(); osc.stop(audioCtx.currentTime + 0.05);
            break;
        case 'click':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 - higher, more subtle
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
            osc.start(); osc.stop(audioCtx.currentTime + 0.08);
            break;
        case 'success':
            osc.type = 'square';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.start(); osc.stop(audioCtx.currentTime + 0.3);
            break;
        case 'type':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
            osc.start(); osc.stop(audioCtx.currentTime + 0.03);
            break;
    }
}

// Initialize UI
function initGamification() {
    // Load saved state
    const savedState = localStorage.getItem('gamedev_rpg_state');
    if (savedState) Object.assign(gameState, JSON.parse(savedState));

    // Update sound icons
    updateSoundUI();

    // Create XP UI (Bottom Floating)
    if (!document.querySelector('.xp-container')) {
        const xpUI = document.createElement('div');
        xpUI.className = 'xp-container';
        xpUI.innerHTML = `
            <span class="level-badge">${vocab[gameState.lang].level} <span id="lvlNum">${gameState.level}</span></span>
            <div class="xp-bar-bg">
                <div class="xp-bar-fill" id="xpFill" style="width: ${(gameState.xp / gameState.xpToNextLevel) * 100}%"></div>
            </div>
        `;
        document.body.appendChild(xpUI);
    }

    updateBotMessage(vocab[gameState.lang].welcome);
    updateFooterAppearance();
}

function addXP(amount, event) {
    gameState.xp += amount;

    // Level Up Logic
    if (gameState.xp >= gameState.xpToNextLevel) {
        gameState.xp -= gameState.xpToNextLevel;
        gameState.level++;
        gameState.xpToNextLevel = Math.floor(gameState.xpToNextLevel * 1.5);
        playSound('success');
        updateBotMessage(`${vocab[gameState.lang].levelUp} ${gameState.level}! 🎉`);
        updateFooterAppearance();
    }

    // Visual Update
    const lvlNum = document.getElementById('lvlNum');
    const xpFill = document.getElementById('xpFill');
    if (lvlNum) lvlNum.innerText = gameState.level;
    if (xpFill) xpFill.style.width = `${(gameState.xp / gameState.xpToNextLevel) * 100}%`;

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

function updateFooterAppearance() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    // Remove existing level classes
    footer.classList.remove('level-2', 'level-5', 'level-10');
    
    // Add appropriate class
    if (gameState.level >= 10) footer.classList.add('level-10');
    else if (gameState.level >= 5) footer.classList.add('level-5');
    else if (gameState.level >= 2) footer.classList.add('level-2');
}

function saveState() {
    localStorage.setItem('gamedev_rpg_state', JSON.stringify(gameState));
}

function updateSoundUI() {
    const onIcon = document.querySelector('.sound-on');
    const offIcon = document.querySelector('.sound-off');
    if (onIcon && offIcon) {
        onIcon.style.display = gameState.soundEnabled ? 'block' : 'none';
        offIcon.style.display = gameState.soundEnabled ? 'none' : 'block';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initGamification();

    // Universal interaction listeners
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, .card, .ecosystem-badge');
        if (target) {
            playSound('click');
            addXP(10, e);
        }
    });

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .card, .ecosystem-badge');
        if (target) {
            playSound('hover');
        }
    });

    // Sound Toggle
    document.getElementById('soundToggle')?.addEventListener('click', () => {
        gameState.soundEnabled = !gameState.soundEnabled;
        localStorage.setItem('gamedev_sound', gameState.soundEnabled);
        updateSoundUI();
        if (gameState.soundEnabled) playSound('click');
    });

    // Konami Code Implementation
    let kKeys = [];
    const konami = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";
    document.addEventListener('keydown', (e) => {
        if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
            playSound('type');
            return;
        }
        
        kKeys.push(e.key);
        if (kKeys.toString().indexOf(konami) >= 0) {
            celebrateKonami();
            kKeys = [];
        }
        if (kKeys.length > 20) kKeys.shift();
    });

    // Guide Bot Interaction
    document.getElementById('guideBot')?.addEventListener('click', (e) => {
        addXP(5, e);
        const hints = [vocab[gameState.lang].konamiHint, vocab[gameState.lang].jobsHint, vocab[gameState.lang].clickSecret];
        updateBotMessage(hints[Math.floor(Math.random() * hints.length)]);
    });
});

function celebrateKonami() {
    addXP(500, { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
    updateBotMessage(vocab[gameState.lang].konamiSuccess);

    const overlay = document.createElement('div');
    overlay.className = 'konami-overlay'; 
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:9999; display:flex; align-items:center; justify-content:center; flex-direction:column; animation:fadeIn 0.5s;";
    
    overlay.innerHTML = `
        <div style="text-align:center; animation:scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
            <h1 style="font-family:'Press Start 2P', monospace; font-size:3rem; color:#00ffff; text-shadow:0 0 20px #00ffff; margin-bottom:2rem; animation:rainbow 2s infinite;">GOD MODE</h1>
            <p style="font-size:1.5rem; color:#ff2d95; font-weight:bold; margin-bottom:1rem;">¡KONAMI CODE ACTIVADO!</p>
            <p style="font-size:1rem; color:#fff; opacity:0.8;">+500 XP • Secret Found</p>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.animation = 'rainbow 2s infinite, shake 0.5s';

    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
            overlay.remove();
            document.body.style.animation = '';
        }, 500);
    }, 4000);
}
