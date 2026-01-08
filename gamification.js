// Gamification System 3.0: XP, Progression, Bilingual Bot & Floating Decorations
// Concept: "Retro Arcade Terminal" - XP & Progression

const gameState = {
    xp: parseInt(localStorage.getItem('gamedev_xp')) || 0,
    level: parseInt(localStorage.getItem('gamedev_lvl')) || 1,
    xpToNextLevel: 100,
    lang: localStorage.getItem('gamedev_lang') || 'es',
    soundEnabled: localStorage.getItem('gamedev_sound') !== 'false'
};

const vocab = {
    es: {
        level: "NIVEL",
        welcome: "¡Psst! Bienvenido al Nexus para Game Devs. 🕹️",
        konamiHint: "Dicen que los verdaderos gamers intentan ↑↑↓↓...",
        clickSecret: "¡Haz click en todo! Hay secretos escondidos.",
        jobsHint: "Los mejores trabajos están en la sección Jobs.",
        konamiSuccess: "¡MODO DIOS ACTIVADO! 🚀 (Konami Code)",
        levelUp: "¡LEVEL UP! Ahora eres Nivel",
    },
    en: {
        level: "LEVEL",
        welcome: "Psst! Welcome to the Game Dev Nexus. 🕹️",
        konamiHint: "They say real gamers try ↑↑↓↓...",
        clickSecret: "Click everything! Secrets are hidden everywhere.",
        jobsHint: "Top tier jobs are waiting in the Jobs section.",
        konamiSuccess: "GOD MODE ACTIVATED! 🚀 (Konami Code)",
        levelUp: "LEVEL UP! You are now Level",
    }
};

// Sound System
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (!gameState.soundEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    switch (type) {
        case 'hover':
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start(); osc.stop(audioCtx.currentTime + 0.05);
            break;
        case 'click':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
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
    }
}

function initGamification() {
    // Force UI Injection
    injectUI();
    updateProgression();
    spawnDecorations();

    // Initial message
    setTimeout(() => updateBotMessage(vocab[gameState.lang].welcome), 1000);
}

function injectUI() {
    // XP Bar
    if (!document.querySelector('.xp-container')) {
        const xpUI = document.createElement('div');
        xpUI.className = 'xp-container';
        xpUI.innerHTML = `
            <span class="level-badge">${vocab[gameState.lang].level} <span id="lvlNum">${gameState.level}</span></span>
            <div class="xp-bar-bg">
                <div class="xp-bar-fill" id="xpFill"></div>
            </div>
        `;
        document.body.appendChild(xpUI);
    }

    // Guide Bot
    if (!document.querySelector('.guide-bot-container')) {
        const botUI = document.createElement('div');
        botUI.className = 'guide-bot-container';
        botUI.innerHTML = `
            <div class="guide-speech-bubble" id="guideBubble">¡Hola! 🕹️</div>
            <div class="guide-bot" id="guideBot"></div>
        `;
        document.body.appendChild(botUI);

        botUI.addEventListener('click', () => {
            addXP(5);
            const hints = [vocab[gameState.lang].konamiHint, vocab[gameState.lang].jobsHint, vocab[gameState.lang].clickSecret];
            updateBotMessage(hints[Math.floor(Math.random() * hints.length)]);
        });
    }
}

function addXP(amount, event) {
    gameState.xp += amount;
    if (gameState.xp >= 100) {
        gameState.xp = 0;
        gameState.level++;
        playSound('success');
        updateBotMessage(`${vocab[gameState.lang].levelUp} ${gameState.level}! 🎉`);
        saveState();
    }
    updateProgression();
    if (event) showFloatingXP(amount, event.clientX, event.clientY);
}

function updateProgression() {
    const lvlNum = document.getElementById('lvlNum');
    const xpFill = document.getElementById('xpFill');
    if (lvlNum) lvlNum.innerText = gameState.level;
    if (xpFill) xpFill.style.width = `${gameState.xp}%`;
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
    if (bubble) {
        bubble.innerText = msg;
        document.querySelector('.guide-bot-container').classList.add('active');
        setTimeout(() => document.querySelector('.guide-bot-container').classList.remove('active'), 5000);
    }
}

function spawnDecorations() {
    const icons = ['👾', '🕹️', '🚀', '⭐', '💎', '🎮'];
    setInterval(() => {
        if (Math.random() > 0.7) return;
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const dec = document.createElement('div');
        dec.innerText = icon;
        dec.style.cssText = `
            position: fixed;
            bottom: -50px;
            left: ${Math.random() * 100}vw;
            font-size: ${1 + Math.random() * 2}rem;
            opacity: 0.2;
            pointer-events: none;
            z-index: -1;
            animation: floatUpSlow ${10 + Math.random() * 20}s linear forwards;
        `;
        document.body.appendChild(dec);
        setTimeout(() => dec.remove(), 30000);
    }, 5000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes floatUpSlow {
        from { transform: translateY(0) rotate(0deg); opacity: 0.2; }
        to { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.append(style);

function saveState() {
    localStorage.setItem('gamedev_xp', gameState.xp);
    localStorage.setItem('gamedev_lvl', gameState.level);
}

// Global Listeners
document.addEventListener('DOMContentLoaded', initGamification);
document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .card')) {
        playSound('click');
        addXP(10, e);
    }
});

// Konami Code
let kKeys = [];
const konami = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";
document.addEventListener('keydown', (e) => {
    kKeys.push(e.key);
    if (kKeys.toString().indexOf(konami) >= 0) {
        addXP(500);
        updateBotMessage(vocab[gameState.lang].konamiSuccess);
        kKeys = [];
    }
    if (kKeys.length > 20) kKeys.shift();
});
