const [button] = document.getElementsByTagName('button');
const [input] = document.getElementsByTagName('input');
const [path] = document.getElementsByTagName('path');

setTimeout(() => {
  path.style.strokeDasharray = '70 283';
  path.style.color = 'red';
}, 1000);
