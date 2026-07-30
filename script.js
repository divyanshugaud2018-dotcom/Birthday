/* ============================================
   BIRTHDAY CELEBRATION WEBSITE - script.js
   ============================================ */

// ──────────────────────────────────────────
// 1.  FLOATING PARTICLES (background)
// ──────────────────────────────────────────
const PARTICLE_EMOJIS = ['🌸', '💖', '✨', '🌺', '💕', '⭐', '🎀', '💫', '🌷', '🦋'];

function createParticles() {
  const container = document.getElementById('particles');
  const count = 22;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];

    const size    = 0.9 + Math.random() * 1.2;          // rem
    const left    = Math.random() * 100;                 // vw %
    const delay   = Math.random() * 12;                  // s
    const dur     = 8 + Math.random() * 10;              // s

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(el);
  }
}

// ──────────────────────────────────────────
// 2.  SECTION NAVIGATION
// ──────────────────────────────────────────
function goToSection(id) {
  // hide all
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  const target = document.getElementById(id);
  target.style.display = 'flex';
  // small rAF so display:flex is painted before animation class
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // section-specific setup
  if (id === 'quiz')  initQuiz();
  if (id === 'music') setupMusicSection();
}

// ──────────────────────────────────────────
// 3.  QUIZ
// ──────────────────────────────────────────
const QUESTIONS = [
  {
    q: '💖 What is your absolute favourite thing to do on a lazy day?',
    opts: ['Binge-watch rom-coms 🎬', 'Sleep in & dream more 😴', 'Go on a spontaneous trip 🌍', 'Cook something delicious 🍳'],
    fun: ['You and Netflix are soulmates! 💕', 'Sleep is self-care, totally valid! 😍', 'A free spirit at heart! ✈️', 'Chef goals! 🍽️'],
    any: true   // any answer is "correct" — all get praise
  },
  {
    q: '🎂 If your birthday cake could be ANY flavour, what would it be?',
    opts: ['Chocolate fudge & more chocolate 🍫', 'Strawberry with cream 🍓', 'Vanilla with rainbow sprinkles 🌈', 'Red velvet royalty 🔴'],
    fun: ['Chocoholic queen! 👑', 'Sweet & fresh, just like you! 🍓', 'Colourful & joyful — so you! 🌈', 'Classy and bold! 💋'],
    any: true
  },
  {
    q: '✨ Which word describes you BEST on your birthday?',
    opts: ['Glowing & gorgeous ✨', 'Happy & hyper 🎉', 'Calm & content 🧘‍♀️', 'Blessed & grateful 🙏'],
    fun: ['You are literally glowing! 🌟', 'Your energy is contagious! 🥳', 'Zen queen! So peaceful! 🌸', 'Grateful hearts are beautiful hearts! 💖'],
    any: true
  },
  {
    q: '🌸 What is your go-to way to celebrate? 🥳',
    opts: ['Big party with everyone! 🎊', 'Dinner with close friends 🍽️', 'Solo spa day 💆‍♀️', 'Surprise me, I love surprises! 🎁'],
    fun: ['The life of the party! 🎉', 'Quality over quantity — love that! 💕', 'Ultimate self-love day! 🌹', 'Adventurous soul! 🎀'],
    any: true
  },
  {
    q: '💌 What gift would make you the HAPPIEST today?',
    opts: ['Jewellery & accessories 💍', 'A heartfelt handwritten letter 📝', 'A trip / travel experience ✈️', 'Quality time with loved ones 🤗'],
    fun: ['Sparkling, just like you! 💎', 'The sweetest soul right here! 🥹', 'Wanderlust goals! 🗺️', 'Love is the best gift! ❤️'],
    any: true
  },
  {
    q: '🌟 What is your secret superpower?',
    opts: ['Making everyone smile 😊', 'Never giving up 💪', 'Always knowing the right thing to say 🗣️', 'Spreading kindness everywhere 🌈'],
    fun: ['The world needs more smiles like yours! 😄', 'Resilience queen! Nothing stops you! 👸', 'Words of wisdom, always! ✨', 'The kindest heart in the room! 🌸'],
    any: true
  }
];

let currentQ    = 0;
let score       = 0;
let quizStarted = false;

function initQuiz() {
  if (quizStarted) return;
  quizStarted = true;
  currentQ = 0;
  score    = 0;
  document.getElementById('q-total').textContent = QUESTIONS.length;
  showQuestion();
}

function showQuestion() {
  const data = QUESTIONS[currentQ];

  document.getElementById('q-current').textContent = currentQ + 1;
  document.getElementById('question-text').textContent = data.q;
  document.getElementById('answer-feedback').className = 'answer-feedback hidden';
  document.getElementById('answer-feedback').textContent = '';

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  data.opts.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className   = 'option-btn';
    btn.textContent = opt;
    btn.onclick     = () => handleAnswer(idx);
    container.appendChild(btn);
  });

  // animate card
  const card = document.getElementById('quiz-card');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = 'cardIn 0.4s ease';
}

function handleAnswer(idx) {
  const data    = QUESTIONS[currentQ];
  const buttons = document.querySelectorAll('.option-btn');

  // disable all
  buttons.forEach(b => { b.disabled = true; });

  // highlight chosen — all are "correct" since it's personality-based
  buttons[idx].classList.add('correct');

  // show fun feedback
  const fb = document.getElementById('answer-feedback');
  fb.textContent  = data.fun[idx];
  fb.className    = 'answer-feedback correct-fb';

  score++;

  // wait then advance
  setTimeout(() => {
    currentQ++;
    if (currentQ < QUESTIONS.length) {
      showQuestion();
    } else {
      showQuizResult();
    }
  }, 1600);
}

function showQuizResult() {
  document.getElementById('quiz-card').classList.add('hidden');
  const result = document.getElementById('quiz-result');
  result.classList.remove('hidden');

  const messages = [
    { emoji: '👸', title: 'You\'re an Absolute Queen!', text: 'Every answer showed just how unique, beautiful, and amazing you truly are. Today is YOUR day and you deserve every bit of happiness! 🌟💖' },
    { emoji: '🌸', title: 'A Truly Beautiful Soul!',    text: 'You radiate warmth, love, and joy wherever you go. The world is a better place because of you. Keep shining bright! ✨' },
    { emoji: '💫', title: 'Wonderfully You!',           text: 'There is nobody quite like you — and that is your superpower. Happy Birthday to someone who makes every day brighter! 🎉💕' }
  ];

  const pick = messages[Math.floor(Math.random() * messages.length)];
  document.getElementById('result-emoji').textContent = pick.emoji;
  document.getElementById('result-title').textContent = pick.title;
  document.getElementById('result-text').textContent  = pick.text;

  launchConfetti(120);
}

// ──────────────────────────────────────────
// 4.  CAKE CUTTING
// ──────────────────────────────────────────
let cakeCut = false;

function cutCake() {
  if (cakeCut) return;
  cakeCut = true;

  // hide whole cake
  document.getElementById('cake').classList.add('hidden');

  // show cut pieces
  document.getElementById('cut-cake').classList.remove('hidden');
  document.getElementById('cake-msg').classList.remove('hidden');

  // big confetti burst
  launchConfetti(200);

  // play a short "slice" sound via Web Audio
  playSliceSound();
}

// ──────────────────────────────────────────
// 5.  MUSIC  — Web Audio API synthesised
//     Happy Birthday tune (no external file needed)
// ──────────────────────────────────────────
let audioCtx       = null;
let isPlaying      = false;
let scheduledNodes = [];

// Note frequencies (Hz)
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00
};

// Happy Birthday melody  [note, duration (beats)]
const HB_MELODY = [
  ['G4',0.75],['G4',0.25],['A4',1],['G4',1],['C5',1],['B4',2],
  ['G4',0.75],['G4',0.25],['A4',1],['G4',1],['D5',1],['C5',2],
  ['G4',0.75],['G4',0.25],['G5',1],['E5',1],['C5',1],['B4',1],['A4',2],
  ['F5',0.75],['F5',0.25],['E5',1],['C5',1],['D5',1],['C5',3]
];

const BPM      = 100;
const BEAT_DUR = 60 / BPM;   // seconds per beat

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playNote(ctx, freq, startTime, duration) {
  const osc    = ctx.createOscillator();
  const gainNd = ctx.createGain();

  osc.type      = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  gainNd.gain.setValueAtTime(0, startTime);
  gainNd.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
  gainNd.gain.setValueAtTime(0.35, startTime + duration - 0.05);
  gainNd.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gainNd);
  gainNd.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);

  scheduledNodes.push(osc, gainNd);
  return osc;
}

function scheduleMelody(ctx, startAt) {
  let t = startAt;
  HB_MELODY.forEach(([note, beats]) => {
    playNote(ctx, NOTES[note], t, beats * BEAT_DUR * 0.92);
    t += beats * BEAT_DUR;
  });
  return t - startAt;   // total duration in seconds
}

let melodyTimer = null;

function startMelody() {
  const ctx   = getAudioCtx();
  const total = scheduleMelody(ctx, ctx.currentTime + 0.05);

  // loop: re-schedule when melody ends
  melodyTimer = setTimeout(() => {
    if (isPlaying) startMelody();
  }, total * 1000);
}

function stopMelody() {
  clearTimeout(melodyTimer);
  scheduledNodes.forEach(n => {
    try { n.disconnect(); } catch (_) {}
    if (n.stop) try { n.stop(0); } catch (_) {}
  });
  scheduledNodes = [];
}

function toggleMusic() {
  const btn   = document.getElementById('play-btn');
  const notes = document.getElementById('music-notes');

  if (!isPlaying) {
    isPlaying = true;
    btn.textContent = '⏸ Pause Song';
    btn.classList.add('playing');
    notes.classList.add('playing');

    // Resume suspended AudioContext (required by browsers after user gesture)
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      startMelody();
    });

    launchConfetti(80);
  } else {
    isPlaying = false;
    btn.textContent = '▶ Play Happy Birthday!';
    btn.classList.remove('playing');
    notes.classList.remove('playing');
    stopMelody();
  }
}

function setupMusicSection() {
  // Do NOT auto-play — browsers block audio without a direct user gesture.
  // User must click the Play button.
  const btn = document.getElementById('play-btn');
  btn.textContent = '▶ Play Happy Birthday!';
  btn.classList.remove('playing');
}

// ──────────────────────────────────────────
// 6.  SLICE SOUND  (short percussive click)
// ──────────────────────────────────────────
function playSliceSound() {
  try {
    const ctx  = getAudioCtx();
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.6;
    src.buffer = buf;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

// ──────────────────────────────────────────
// 7.  CONFETTI
// ──────────────────────────────────────────
const canvas = document.getElementById('confetti-canvas');
const ctx2   = canvas.getContext('2d');
let confettiPieces = [];
let confettiRAF    = null;

const CONFETTI_COLORS = [
  '#ff6fb0','#e91e8c','#c084fc','#fbbf24',
  '#34d399','#60a5fa','#f472b6','#a78bfa'
];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti(count) {
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x:     Math.random() * canvas.width,
      y:     -10 - Math.random() * 200,
      w:     6  + Math.random() * 8,
      h:     10 + Math.random() * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rot:   Math.random() * Math.PI * 2,
      vx:    (Math.random() - 0.5) * 3,
      vy:    2 + Math.random() * 4,
      vrot:  (Math.random() - 0.5) * 0.2,
      alpha: 1
    });
  }

  if (!confettiRAF) animateConfetti();
}

function animateConfetti() {
  ctx2.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces = confettiPieces.filter(p => p.alpha > 0.05);

  confettiPieces.forEach(p => {
    p.x   += p.vx;
    p.y   += p.vy;
    p.rot += p.vrot;
    p.vy  += 0.08;   // gravity

    if (p.y > canvas.height - 50) p.alpha -= 0.025;

    ctx2.save();
    ctx2.globalAlpha = p.alpha;
    ctx2.translate(p.x, p.y);
    ctx2.rotate(p.rot);
    ctx2.fillStyle = p.color;
    ctx2.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx2.restore();
  });

  if (confettiPieces.length > 0) {
    confettiRAF = requestAnimationFrame(animateConfetti);
  } else {
    confettiRAF = null;
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ──────────────────────────────────────────
// 8.  RESTART
// ──────────────────────────────────────────
function restartCelebration() {
  // stop music
  if (isPlaying) toggleMusic();

  // reset quiz state
  quizStarted = false;
  cakeCut     = false;

  // reset cake UI
  document.getElementById('cake').classList.remove('hidden');
  document.getElementById('cut-cake').classList.add('hidden');
  document.getElementById('cake-msg').classList.add('hidden');

  // reset quiz UI
  document.getElementById('quiz-card').classList.remove('hidden');
  document.getElementById('quiz-result').classList.add('hidden');

  goToSection('landing');
  launchConfetti(60);
}

// ──────────────────────────────────────────
// 9.  INIT on page load
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createParticles();

  // make sure landing is the only visible section
  document.querySelectorAll('.section').forEach(s => {
    s.style.display = 'none';
    s.classList.remove('active');
  });
  const landing = document.getElementById('landing');
  landing.style.display = 'flex';
  landing.classList.add('active');

  // small entrance confetti burst
  setTimeout(() => launchConfetti(60), 400);
});
