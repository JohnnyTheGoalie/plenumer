const timeDisplay = document.getElementById('time');
const durationInput = document.getElementById('duration');

function computeRemaining(info) {
  if (!info) return 0;
  if (info.paused) return info.remaining;
  const elapsed = Math.floor((Date.now() - info.start) / 1000);
  return Math.max(0, info.duration - elapsed);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateTimer() {
  chrome.runtime.sendMessage({ type: 'getTimer' }, (response) => {
    const info = response ? response.timer : null;
    if (info) {
      const remaining = computeRemaining(info);
      timeDisplay.textContent = formatTime(remaining);
    } else {
      timeDisplay.textContent = '0:00';
    }
  });
}

document.getElementById('start').addEventListener('click', () => {
  const minutes = parseInt(durationInput.value, 10);
  if (!isNaN(minutes) && minutes > 0) {
    chrome.runtime.sendMessage({ type: 'startTimer', duration: minutes * 60 });
  }
});

document.getElementById('pause').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'togglePause' });
});

setInterval(updateTimer, 1000);
updateTimer();
