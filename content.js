let overlay;
let interval;

document.addEventListener("keydown", async (e) => {
  if (["t", "g"].includes(e.key)) {
    const durations = { t: 5 * 60, g: 10 * 60 };
    const duration = durations[e.key];
    chrome.runtime.sendMessage({ type: "startTimer", duration });
  }
});

chrome.runtime.sendMessage({ type: "getTimer" }, (response) => {
  if (response?.timerEnd) {
    startTimer(response.timerEnd);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "updateTimer") {
    startTimer(message.endTime);
  }
});

function startTimer(endTime) {
  if (overlay) overlay.remove();
  overlay = document.createElement("div");
  overlay.id = "global-timer-overlay";
  document.body.appendChild(overlay);

  if (interval) clearInterval(interval);
  updateTime(endTime);

  interval = setInterval(() => {
    updateTime(endTime);
  }, 1000);
}

function updateTime(endTime) {
  const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  if (remaining <= 0) {
    overlay.textContent = "";
    clearInterval(interval);
    return;
  }
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  overlay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
}
