let timerEnd = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startTimer") {
    const duration = message.duration; // in seconds
    timerEnd = Date.now() + duration * 1000;
    broadcastTimer(timerEnd);
  }

  if (message.type === "getTimer") {
    sendResponse({ timerEnd });
  }
});

function broadcastTimer(endTime) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, {
        type: "updateTimer",
        endTime,
      });
    }
  });
}
