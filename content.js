let overlay;

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

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay(info) {
  if (!info || info.remaining <= 0) {
    removeOverlay();
    return;
  }
  createOverlay();
  overlay.textContent = formatTime(info.remaining);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'timerUpdate') {
    updateDisplay(msg.timer);
  }
});

chrome.runtime.sendMessage({ type: 'getTimer' }, (response) => {
  if (response && response.timer) {
    updateDisplay(response.timer);
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
});
