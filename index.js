const [toggleButton, resetButton, setButton, cancelButton, closeButton] = document.getElementsByTagName('button');
const [input] = document.getElementsByTagName('input');
const [span] = document.getElementsByTagName('span');
const [path] = document.getElementsByTagName('path');
const controlBox = document.querySelector('#controls');
const timerEl = document.querySelector('#timer');
const resetBox = /** @type {HTMLDivElement} */(document.querySelector('#resetBox'));

window.resizeTo(300, 300);
adjustControlSizes();

input.value = '30s';

let totalSeconds = 0;
let remainingSeconds = 0;
let running = false;
let timer;

resetTimer();
updateTimeDisplay();

document.onmousedown = (e) => {
  if (e.target.closest('.non-draggable')) return;

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

closeButton.onclick = () => window.close();

resetButton.onclick = () => {
  controlBox.hidden = true;
  resetBox.hidden = false;
  input.focus();
};

cancelButton.onclick = () => {
  controlBox.hidden = false;
  resetBox.hidden = true;
};

setButton.onclick = () => {
  resetTimer();
  updateTimeDisplay();
  updateCircle();
  controlBox.hidden = false;
  resetBox.hidden = true;
};

toggleButton.onclick = () => {
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
    setButton.click();
  }
  else if (e.keyCode === 27) {
    e.preventDefault();
    cancelButton.click();
  }
};

function resetTimer() {
  const newTime = parseTime(input.value);
  totalSeconds = remainingSeconds = newTime;
}

function startTimer() {
  running = true;

  window.onbeforeunload = () => true;
  closeButton.disabled = true;

  tick();
  timer = setInterval(tick, 100);

  toggleButton.innerText = 'Pause';
  resetButton.hidden = true;
  input.hidden = true;
}

function pauseTimer() {
  running = false;
  updateTimeDisplay();

  window.onbeforeunload = null;
  closeButton.disabled = false;

  clearInterval(timer);
  timer = null;

  toggleButton.innerText = 'Start';
  resetButton.hidden = false;
  input.hidden = false;
}

function tick() {
  remainingSeconds -= 0.1;

  updateCircle();
  updateTimeDisplay();

  // if (remainingSeconds < 0) {
  //   remainingSeconds = 0;
  //   pauseTimer();
  //   remainingSeconds = totalSeconds;
  // }
}

function updateCircle() {
  const percentDone = remainingSeconds / totalSeconds;

  const percentShow = percentDone <= 0 ? 1 : percentDone;
  path.style.strokeDasharray = `${(percentShow * 283)} 283`;

  let cls = 'good';
  if (percentDone < 0.5) cls = 'half';
  if (percentDone < 0.1) cls = 'warning';
  if (percentDone <= 0) cls = 'done';
  timerEl.removeAttribute('class');
  timerEl.classList.add(cls);
}

function timeStringFor(seconds) {
  const neg = seconds < 0 ? '-' : '';
  const min = Math.floor(Math.abs(seconds) / 60);
  const sec = Math.floor(Math.abs(seconds)) % 60;
  return `${neg}${twoDigits(min)}:${twoDigits(sec)}`;
}

function updateTimeDisplay() {
  let text = timeStringFor(remainingSeconds);
  if (!running) text += ' / ' + timeStringFor(totalSeconds);
  span.innerText = text;
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
