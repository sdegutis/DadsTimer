const [button] = document.getElementsByTagName('button');
const [input] = document.getElementsByTagName('input');
const [span] = document.getElementsByTagName('span');
const [path] = document.getElementsByTagName('path');
const controlsEl = document.querySelector('#controls');

window.resizeTo(300, 300);
adjustControlSizes();

input.value = '30s';

let totalSeconds = 0;
let remainingSeconds = 0;
let running = false;
let timer;

maybeResetTimer();

document.onmousedown = (e) => {
  if (e.target !== controlsEl) return;

  e.preventDefault();
  document.onmousemove = (e) => {
    e.preventDefault();
    window.moveBy(e.movementX, e.movementY);
  };
};

document.onmouseup = (e) => {
  e.preventDefault();
  document.onmousemove = null;
};

button.onclick = () => {
  if (running) {
    pauseTimer();
  }
  else {
    startTimer();
  }
};

input.onkeydown = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
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
  window.onbeforeunload = () => true;

  maybeResetTimer();

  tick();
  timer = setInterval(tick, 100);

  button.innerText = 'Pause';
  span.hidden = false;
  input.hidden = true;
}

function pauseTimer() {
  running = false;
  window.onbeforeunload = null;

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

  document.documentElement.classList.toggle('done', percentDone >= 1);
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

document.onmousewheel = (e) => {
  const by = (e.deltaY > 0 ? -1 : 1) * 10;
  if (by < 0 && window.innerWidth < 201) return;

  window.resizeBy(by, by);
  window.moveBy(-by / 2, -by / 2);
  adjustControlSizes();
};
