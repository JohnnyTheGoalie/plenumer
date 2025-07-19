+33
-14

let overlay;
let interval;

document.addEventListener("keydown", async (e) => {
  if (["n", "r"].includes(e.key)) {
    const durations = { n: 10 * 60, r: 2 * 60 };
    const duration = durations[e.key];
    chrome.runtime.sendMessage({ type: "startTimer", duration });
  } else if (e.key === " ") {
    chrome.runtime.sendMessage({ type: "togglePause" });
  }
});

chrome.runtime.sendMessage({ type: "getTimer" }, (response) => {
  if (response?.timerEnd) {
    startTimer(response);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "updateTimer") {
    if (message.timerEnd) {
      startTimer(message);
    } else if (overlay) {
      overlay.remove();
      overlay = null;
      clearInterval(interval);
    }
  }
});

let currentInfo;

function startTimer(info) {
  if (overlay) overlay.remove();
  overlay = document.createElement("div");
  overlay.id = "global-timer-overlay";
  document.body.appendChild(overlay);

  if (interval) clearInterval(interval);
  currentInfo = info;

  updateTime();
  if (!info.paused) {
    interval = setInterval(updateTime, 1000);
  }
}

function updateTime() {
  if (!currentInfo) return;

  let remain;
  if (currentInfo.paused) {
    remain = currentInfo.remaining;
  } else {
    remain = Math.max(0, Math.ceil((currentInfo.timerEnd - Date.now()) / 1000));
  }

  if (remain <= 0) {
    overlay.textContent = "";
    clearInterval(interval);
    return;
  }
  const mins = Math.floor(remain / 60);
  const secs = remain % 60;
  overlay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
}