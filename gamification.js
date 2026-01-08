// Gamification Logic & Sound FX

// Simple Synth using Web Audio API for Retro Sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (type === 'hover') {
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
  } else if (type === 'click') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'success') {
    // Zelda Secret Sound-ish
    const now = audioCtx.currentTime;
    
    // Note 1
    const osc1 = audioCtx.createOscillator();
    const g1 = audioCtx.createGain();
    osc1.connect(g1);
    g1.connect(audioCtx.destination);
    osc1.frequency.value = 783.99; // G5
    g1.gain.setValueAtTime(0.1, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Note 2
    const osc2 = audioCtx.createOscillator();
    const g2 = audioCtx.createGain();
    osc2.connect(g2);
    g2.connect(audioCtx.destination);
    osc2.frequency.value = 880.00; // A5
    g2.gain.setValueAtTime(0.1, now + 0.15);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.3);
    
    // Note 3 etc... simplified for brevity
  }
}

// Attach sounds to interactables
document.addEventListener('DOMContentLoaded', () => {
  const interactables = document.querySelectorAll('a, button, .card, .guide-bot-container');
  
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => playSound('click'));
  });

  // Guide Bot Logic
  const bot = document.getElementById('guideBot');
  const bubble = document.getElementById('guideBubble');
  const messages = [
    "¡Psst! ¿Ya probaste el Konami Code? ⬆️⬆️⬇️⬇️...",
    "Haz click en el logo para un secreto...",
    "Los mejores trabajos están en la sección Jobs.",
    "¿Sabías que Amber Studio está contratando?",
    "¡Sigue explorando para desbloquear logros!"
  ];

  let msgIndex = 0;

  if(bot) {
    bot.addEventListener('click', () => {
      msgIndex = (msgIndex + 1) % messages.length;
      bubble.textContent = messages[msgIndex];
      playSound('click');
      
      // Trigger animation
      bot.classList.remove('active');
      void bot.offsetWidth; // trigger reflow
      bot.classList.add('active');
    });

    // Random message every 10 seconds
    setInterval(() => {
      if (Math.random() > 0.7) {
        msgIndex = Math.floor(Math.random() * messages.length);
        bubble.textContent = messages[msgIndex];
        bot.classList.add('active');
        setTimeout(() => bot.classList.remove('active'), 4000);
      }
    }, 10000);
  }
});
