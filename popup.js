document.getElementById('start-n').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'startTimer', duration: 10 * 60 });
});

document.getElementById('start-r').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'startTimer', duration: 2 * 60 });
});