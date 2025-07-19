let timer = null;
let intervalId = null;

function broadcast() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { type: 'timerUpdate', timer });
    }
  });
}

function clearTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  timer = null;
  chrome.storage.local.remove('timer');
  broadcast();
}

function tick() {
  if (!timer || timer.paused) return;
  const elapsed = Math.floor((Date.now() - timer.start) / 1000);
  timer.remaining = Math.max(0, timer.duration - elapsed);
  if (timer.remaining <= 0) {
    clearTimer();
  } else {
    chrome.storage.local.set({ timer });
    broadcast();
  }
}

function startTimer(duration) {
  timer = {
    start: Date.now(),
    duration,
    remaining: duration,
    paused: false,
  };
  chrome.storage.local.set({ timer });
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(tick, 1000);
  broadcast();
}

function togglePause() {
  if (!timer) return;
  if (timer.paused) {
    timer.start = Date.now() - (timer.duration - timer.remaining) * 1000;
    timer.paused = false;
  } else {
    timer.paused = true;
  }
  chrome.storage.local.set({ timer });
  broadcast();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'startTimer') {
    startTimer(msg.duration);
  } else if (msg.type === 'togglePause') {
    togglePause();
  } else if (msg.type === 'getTimer') {
    sendResponse({ timer });
  }
});

// restore timer from storage on startup
chrome.storage.local.get('timer', ({ timer: saved }) => {
  if (saved) {
    timer = saved;
    const remaining = saved.paused
      ? saved.remaining
      : Math.max(0, saved.duration - Math.floor((Date.now() - saved.start) / 1000));
    timer.remaining = remaining;
    if (remaining > 0) {
      if (!saved.paused) intervalId = setInterval(tick, 1000);
      broadcast();
    } else {
      chrome.storage.local.remove('timer');
      timer = null;
    }
  }
});
