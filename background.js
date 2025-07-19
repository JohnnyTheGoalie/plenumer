let timerEnd = null;
let remaining = 0;
let paused = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startTimer") {
    const duration = message.duration; // in seconds
    timerEnd = Date.now() + duration * 1000;
    remaining = duration;
    paused = false;
    broadcastTimer();
  }

  if (message.type === "togglePause") {
    if (!timerEnd) return;
    if (paused) {
      // resume
      timerEnd = Date.now() + remaining * 1000;
      paused = false;
    } else {
      // pause
      remaining = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
      paused = true;
    }
    broadcastTimer();
  }

  if (message.type === "getTimer") {
    sendResponse({ timerEnd, remaining, paused });
  }
});

function broadcastTimer() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, {
        type: "updateTimer",
        timerEnd,
        remaining,
        paused,
      });
    }
  });
}