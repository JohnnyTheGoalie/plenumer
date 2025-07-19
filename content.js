let overlay;
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
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateFromStorage() {
  chrome.storage.local.get('timer', ({ timer }) => {
    if (!timer) {
      removeOverlay();
      return;
    }

    createOverlay();

    let remaining;
    if (timer.paused) {
      remaining = timer.remaining;
    } else {
      remaining = Math.max(
        0,
        Math.ceil(timer.duration - (Date.now() - timer.start) / 1000)
      );
    }

    if (remaining <= 0) {
      chrome.storage.local.remove('timer');
      removeOverlay();
      return;
    }

    overlay.textContent = formatTime(remaining);
  });
}

function ensureInterval() {
  if (!intervalId) {
    intervalId = setInterval(updateFromStorage, 1000);
  }
}

function startTimer(duration) {
  const timer = {
    start: Date.now(),
    duration,
    paused: false,
    remaining: duration,
  };
  chrome.storage.local.set({ timer });
}

function togglePause() {
  chrome.storage.local.get('timer', ({ timer }) => {
    if (!timer) return;

    if (timer.paused) {
      timer.start = Date.now() - (timer.duration - timer.remaining) * 1000;
      timer.paused = false;
    } else {
      timer.remaining = Math.max(
        0,
        Math.ceil(timer.duration - (Date.now() - timer.start) / 1000)
      );
      timer.paused = true;
    }
    chrome.storage.local.set({ timer });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'n') {
    startTimer(10 * 60);
  } else if (e.key === 'r') {
    startTimer(2 * 60);
  } else if (e.key === ' ') {
    togglePause();
  }
});

chrome.storage.local.get('timer', ({ timer }) => {
  if (timer) {
    updateFromStorage();
    ensureInterval();
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.timer) {
    if (changes.timer.newValue) {
      updateFromStorage();
      ensureInterval();
    } else {
      removeOverlay();
    }
  }
});
