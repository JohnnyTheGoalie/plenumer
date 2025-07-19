let overlay;
let timerInfo;
let intervalId;

function createOverlay() {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-timer-overlay';
    document.body.appendChild(overlay);
  }
}

function removeOverlay() {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}

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

function updateDisplay(info) {
  const remaining = computeRemaining(info);
  if (!info || remaining <= 0) {
    removeOverlay();
    return;
  }
  info.remaining = remaining;
  createOverlay();
  overlay.textContent = formatTime(remaining);
}

function startInterval() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    if (!timerInfo) return;
    timerInfo.remaining = computeRemaining(timerInfo);
    updateDisplay(timerInfo);
    if (timerInfo.remaining <= 0) {
      chrome.runtime.sendMessage({ type: 'timerEnded' });
      clearInterval(intervalId);
      intervalId = null;
    }
  }, 1000);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'timerUpdate') {
    timerInfo = msg.timer;
    startInterval();
    updateDisplay(timerInfo);
  }
});

chrome.runtime.sendMessage({ type: 'getTimer' }, (response) => {
  if (response && response.timer) {
    timerInfo = response.timer;
    startInterval();
    updateDisplay(timerInfo);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'n') {
    chrome.runtime.sendMessage({ type: 'startTimer', duration: 10 * 60 });
  } else if (e.key === 'r') {
    chrome.runtime.sendMessage({ type: 'startTimer', duration: 2 * 60 });
  } else if (e.key === ' ') {
    chrome.runtime.sendMessage({ type: 'togglePause' });
  }
}, true);
