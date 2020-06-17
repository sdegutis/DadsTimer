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

button.onclick = () => {
  if (running) {
    pauseTimer();
  }
  else {
    maybeResetTimer();
    startTimer();
  }
};

maybeResetTimer();

function maybeResetTimer() {
  const newTime = parseTime(input.value);
  if (newTime !== totalSeconds) {
    totalSeconds = remainingSeconds = newTime;
  }
}

function startTimer() {
  running = true;
  changed = false;
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
  console.log(percentDone);
  path.style.strokeDasharray = `${Math.round(percentDone * 283)} 283`;

  let color = 'gold';
  if (percentDone > 0.5) color = 'orange';
  if (percentDone > 0.9) color = 'red';
  path.style.color = color;

  if (remainingSeconds < 0) {
    pauseTimer();
    // maybeResetTimer();
  }
}

function parseTime(/** @type {string} */ time) {
  const UNITS = { h: 60 * 60, m: 60, s: 1 };
  return [...time.matchAll(/([0-9.]+)(h|m|s)/g)]
    .map(([, amt, unit]) => parseFloat(amt) * UNITS[unit])
    .reduce((a, b) => a + b)
}

// setTimeout(() => {
//   path.style.strokeDasharray = '70 283';
//   path.style.color = 'red';
// }, 1000);


function adjustControlSizes() {
  const size = window.innerWidth / 10;
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


/**
 * @param {number} width
 * @param {number} height
 */
function resizeInnerTo(width, height) {
  const diffX = window.outerWidth - window.innerWidth;
  const diffY = window.outerHeight - window.innerHeight;
  window.resizeTo(width + diffX, height + diffY);
}
