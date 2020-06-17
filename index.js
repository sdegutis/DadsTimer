const [button] = document.getElementsByTagName('button');
const [input] = document.getElementsByTagName('input');
const [span] = document.getElementsByTagName('span');
const [path] = document.getElementsByTagName('path');

resizeInnerTo(300, 300);

input.value = '30s';

let totalSeconds = 0;
let remainingSeconds = 0;
let running = false;
let timer;

maybeResetTimer();

button.onclick = () => {
  if (running) {
    pauseTimer();
  }
  else {
    startTimer();
  }
};

function maybeResetTimer() {
  const newTime = parseTime(input.value);
  if (newTime !== totalSeconds) {
    totalSeconds = remainingSeconds = newTime;
  }
}

function startTimer() {
  running = true;

  maybeResetTimer();

  tick();
  timer = setInterval(tick, 100);

  button.innerText = 'Pause';
  span.hidden = false;
  input.hidden = true;
}

function pauseTimer() {
  running = false;

  clearInterval(timer);
  timer = null;

  button.innerText = 'Start';
  span.hidden = true;
  input.hidden = false;
}

function tick() {
  remainingSeconds -= 0.1;

  const percentDone = (totalSeconds - remainingSeconds) / totalSeconds;
  path.style.strokeDasharray = `${(percentDone * 283)} 283`;

  updateCircle(percentDone);
  updateTimeDisplay();

  if (remainingSeconds < 0) {
    pauseTimer();
    remainingSeconds = totalSeconds;
  }
}

function updateCircle(percentDone) {
  let cls = 'good';
  if (percentDone > 0.5) cls = 'half';
  if (percentDone > 0.9) cls = 'warning';
  if (percentDone >= 1) cls = 'done';
  path.removeAttribute('class');
  path.classList.add(cls);
}

function updateTimeDisplay() {
  const min = Math.floor(remainingSeconds / 60);
  const sec = remainingSeconds % 60;
  span.innerText = `${twoDigits(min)}:${twoDigits(sec)}`;
}

function twoDigits(n) {
  return n.toFixed(0).padStart(2, '0');
}

function parseTime(/** @type {string} */ time) {
  const UNITS = { h: 60 * 60, m: 60, s: 1 };
  return [...time.matchAll(/([0-9.]+)(h|m|s)/g)]
    .map(([, amt, unit]) => parseFloat(amt) * UNITS[unit])
    .reduce((a, b) => a + b)
}

function adjustControlSizes() {
  const size = window.innerWidth / 8;
  document.documentElement.style.fontSize = size + 'px';
}

let bounce = null;
function ensureAspectRatio() {
  if (bounce) clearTimeout(bounce);
  bounce = setTimeout(() => {
    bounce = null;
    const size = Math.max(window.innerWidth, window.innerHeight);
    resizeInnerTo(size, size);
  }, 100);
}

window.addEventListener('resize', adjustControlSizes);
window.addEventListener('resize', ensureAspectRatio);

adjustControlSizes();
ensureAspectRatio();

function resizeInnerTo(width, height) {
  const diffX = window.outerWidth - window.innerWidth;
  const diffY = window.outerHeight - window.innerHeight;
  window.resizeTo(width + diffX, height + diffY);
}

window.onbeforeunload = (e) => {
  return running;
};
