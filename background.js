let timer = null;

function broadcast() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { type: 'timerUpdate', timer });
    }
  });
}

function clearTimer() {
  timer = null;
  chrome.storage.local.remove('timer');
  chrome.alarms.clear('timerEnd');
  broadcast();
}


function startTimer(duration) {
  timer = {
    start: Date.now(),
    duration,
    remaining: duration,
    paused: false,
  };
  chrome.storage.local.set({ timer });
  chrome.alarms.create('timerEnd', { when: Date.now() + duration * 1000 });
  broadcast();
}

function togglePause() {
  if (!timer) return;
  if (timer.paused) {
    timer.start = Date.now() - (timer.duration - timer.remaining) * 1000;
    timer.paused = false;
    chrome.alarms.create('timerEnd', { when: Date.now() + timer.remaining * 1000 });
  } else {
    const elapsed = Math.floor((Date.now() - timer.start) / 1000);
    timer.remaining = Math.max(0, timer.duration - elapsed);
    timer.paused = true;
    chrome.alarms.clear('timerEnd');
  }
  chrome.storage.local.set({ timer });
  broadcast();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'startTimer') {
    startTimer(msg.duration);
  } else if (msg.type === 'togglePause') {
    togglePause();
  } else if (msg.type === 'timerEnded') {
    clearTimer();
  } else if (msg.type === 'getTimer') {
    sendResponse({ timer });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timerEnd') {
    clearTimer();
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
      if (!saved.paused) {
        chrome.alarms.create('timerEnd', { when: Date.now() + remaining * 1000 });
      }
      broadcast();
    } else {
      chrome.storage.local.remove('timer');
      timer = null;
    }
  }
});
