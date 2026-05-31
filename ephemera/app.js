const STORAGE_KEY = 'ephemera_thoughts';
const DECAY_RATE = 0.0002; // decay per second (full decay in ~83 minutes for demo)
const REMEMBER_BOOST = 0.4; // how much clarity hovering restores

let thoughts = loadThoughts();

const form = document.getElementById('thought-form');
const input = document.getElementById('thought-input');
const stream = document.getElementById('thought-stream');
const emptyEl = document.getElementById('empty');
const particlesEl = document.getElementById('particles');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addThought(text);
  input.value = '';
});

function loadThoughts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveThoughts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
}

function detectMood(text) {
  const lower = text.toLowerCase();
  const moods = {
    joy: /\b(happy|joy|excited|amazing|wonderful|great|love it|fantastic|awesome|glad|smile|laugh)\b/,
    sadness: /\b(sad|miss|lonely|cry|tears|grief|lost|empty|alone|sorrow|regret|depressed)\b/,
    anger: /\b(angry|furious|hate|annoyed|frustrated|rage|mad|irritated|pissed)\b/,
    fear: /\b(afraid|scared|anxious|worried|nervous|panic|dread|terrified|fear)\b/,
    love: /\b(love|adore|cherish|heart|darling|sweetheart|kiss|embrace|passion)\b/,
    calm: /\b(calm|peace|serene|quiet|still|gentle|relax|breathe|meditate|content)\b/
  };
  for (const [mood, pattern] of Object.entries(moods)) {
    if (pattern.test(lower)) return mood;
  }
  return null;
}

function addThought(text) {
  thoughts.unshift({
    id: Date.now().toString(),
    text,
    mood: detectMood(text),
    clarity: 1.0, // 1.0 = fully clear, 0.0 = fully decayed
    lastSeen: Date.now(),
    createdAt: new Date().toISOString()
  });
  saveThoughts();
  render();
}

function rememberThought(id) {
  const t = thoughts.find((th) => th.id === id);
  if (t) {
    t.clarity = Math.min(1.0, t.clarity + REMEMBER_BOOST);
    t.lastSeen = Date.now();
    saveThoughts();
  }
}

function deleteThought(id) {
  thoughts = thoughts.filter((t) => t.id !== id);
  saveThoughts();
  render();
}

function scrambleText(text, clarity) {
  if (clarity > 0.7) return text;
  const chars = text.split('');
  const scrambleRate = 1 - clarity;
  return chars.map((ch) => {
    if (ch === ' ' || ch === '\n') return ch;
    if (Math.random() < scrambleRate * 0.6) {
      const glitch = '·.,:;\'"`~-_=+*#@!?%&░▒▓';
      return glitch[Math.floor(Math.random() * glitch.length)];
    }
    return ch;
  }).join('');
}

function getDecayLevel(clarity) {
  if (clarity > 0.8) return 0;
  if (clarity > 0.6) return 1;
  if (clarity > 0.4) return 2;
  if (clarity > 0.2) return 3;
  if (clarity > 0.05) return 4;
  return 5;
}

function decayBarColor(clarity) {
  if (clarity > 0.7) return 'rgba(120, 200, 160, 0.6)';
  if (clarity > 0.4) return 'rgba(200, 180, 80, 0.6)';
  if (clarity > 0.15) return 'rgba(200, 100, 60, 0.6)';
  return 'rgba(100, 40, 40, 0.5)';
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

function spawnParticles(x, y, color) {
  const count = 8 + Math.floor(Math.random() * 8);
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 4;
    const offsetX = (Math.random() - 0.5) * 120;
    const duration = 3 + Math.random() * 5;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x + offsetX}px; top: ${y}px;
      background: ${color || 'rgba(200, 190, 170, 0.5)'};
      animation-duration: ${duration}s;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    particlesEl.appendChild(p);
    setTimeout(() => p.remove(), (duration + 1) * 1000);
  }
}

function applyDecay() {
  const now = Date.now();
  let changed = false;
  thoughts.forEach((t) => {
    const elapsed = (now - t.lastSeen) / 1000;
    const decay = elapsed * DECAY_RATE;
    const newClarity = Math.max(0, t.clarity - decay);
    if (Math.abs(newClarity - t.clarity) > 0.001) {
      t.clarity = newClarity;
      changed = true;
    }
  });
  if (changed) saveThoughts();
}

function dissolveThought(id, cardEl) {
  const rect = cardEl.getBoundingClientRect();
  const moodColors = {
    joy: 'rgba(255, 214, 102, 0.5)',
    sadness: 'rgba(100, 140, 200, 0.5)',
    anger: 'rgba(200, 80, 60, 0.5)',
    fear: 'rgba(160, 100, 180, 0.5)',
    love: 'rgba(220, 120, 160, 0.5)',
    calm: 'rgba(120, 200, 160, 0.5)'
  };
  const t = thoughts.find((th) => th.id === id);
  const color = t && t.mood ? moodColors[t.mood] : undefined;
  spawnParticles(rect.left + rect.width / 2, rect.top, color);
  cardEl.classList.add('dissolving');
  setTimeout(() => {
    thoughts = thoughts.filter((th) => th.id !== id);
    saveThoughts();
    render();
  }, 1500);
}

function render() {
  applyDecay();
  stream.innerHTML = '';
  emptyEl.hidden = thoughts.length > 0;

  thoughts.forEach((t) => {
    if (t.clarity <= 0) {
      // auto-dissolve on next render
      setTimeout(() => {
        const el = document.querySelector(`[data-id="${t.id}"]`);
        if (el) dissolveThought(t.id, el);
        else {
          thoughts = thoughts.filter((th) => th.id !== t.id);
          saveThoughts();
          render();
        }
      }, 100);
    }

    const level = getDecayLevel(t.clarity);
    const card = document.createElement('div');
    card.className = 'thought-card' + (level > 0 ? ` decay-${level}` : '') + (t.mood ? ` mood-${t.mood}` : '');
    card.dataset.id = t.id;

    card.addEventListener('mouseenter', () => {
      rememberThought(t.id);
      const textEl = card.querySelector('.thought-text');
      if (textEl) textEl.textContent = t.text; // restore original on hover
      card.className = 'thought-card' + (t.mood ? ` mood-${t.mood}` : '');
      const fill = card.querySelector('.decay-fill');
      if (fill) {
        fill.style.width = (t.clarity * 100) + '%';
        fill.style.background = decayBarColor(t.clarity);
      }
    });

    const textEl = document.createElement('div');
    textEl.className = 'thought-text';
    textEl.textContent = scrambleText(t.text, t.clarity);

    const meta = document.createElement('div');
    meta.className = 'thought-meta';

    const time = document.createElement('span');
    time.textContent = timeAgo(t.createdAt);

    const bar = document.createElement('div');
    bar.className = 'decay-bar';
    const fill = document.createElement('div');
    fill.className = 'decay-fill';
    fill.style.width = (t.clarity * 100) + '%';
    fill.style.background = decayBarColor(t.clarity);
    bar.appendChild(fill);

    meta.append(time, bar);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '\u00d7';
    delBtn.setAttribute('aria-label', 'Forget this thought');
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dissolveThought(t.id, card);
    });

    card.append(textEl, meta, delBtn);
    stream.appendChild(card);
  });
}

// Tick: re-render every 5 seconds to show progressive decay
setInterval(() => render(), 5000);

render();
