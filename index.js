const [button] = document.getElementsByTagName('button');
const [input] = document.getElementsByTagName('input');
const [path] = document.getElementsByTagName('path');

resizeInnerTo(300, 300);

let totalSeconds = 0;
let remainingSeconds = totalSeconds;
let running = false;
let timer;
let changed = true;

input.onchange = () => {
  changed = true;
};

button.onclick = () => {
  if (running) {
    pauseTimer();
  }
  else {
    if (changed) {
      const seconds = 10;
      resetTimer(seconds);
    }
    startTimer();
  }
};

resetTimer(30 * 60);

function resetTimer(seconds) {
  totalSeconds = remainingSeconds = seconds;
}

function startTimer() {
  running = true;
  changed = false;
  tick();
  timer = setInterval(tick, 100);
  button.innerText = 'Pause';
}

function pauseTimer() {
  running = false;
  clearInterval(timer);
  timer = null;
  button.innerText = 'Start';
}

function tick() {
  remainingSeconds -= 0.1;

  if (remainingSeconds < 0) {
    pauseTimer();
    resetTimer(30);
  }
  else {
    const percentDone = (totalSeconds - remainingSeconds) / totalSeconds;
    path.style.strokeDasharray = `${Math.round(percentDone * 283)} 283`;

    let color = 'gold';
    if (percentDone > 0.5) color = 'orange';
    if (percentDone > 0.9) color = 'red';
    path.style.color = color;
  }
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
