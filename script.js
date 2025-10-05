//to assign tags from the page so JS can point them directly
let startStopBtn = document.getElementById("startStop");
let display = document.getElementById("display");
let resetBtn = document.getElementById("reset");
let lapBtn = document.getElementById("lap");
let lapsList = document.getElementById("laps");
let themeToggle = document.getElementById("theme-toggle");
let wrapper = document.querySelector(".stopwatch");

const lapsSection = document.querySelector(".laps");

// These variables hold the time state for the stopwatch
let startTime = 0;
let elapsed = 0;
let timerId = null;
let lapCount = 0;

// this is a helper to turn milliseconds into "hh:mm:ss.mmm" text
function format(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const mmm = String(millis).padStart(3, "0"); //this is because milliseconds is always 3 digits

  return `${hh}:${mm}:${ss}.${mmm}`;
}

// adding the current elapsed time on screen
function render() {
  display.textContent = format(elapsed);
}

function tick() {
  elapsed = Date.now() - startTime;
  render();
}

// here is to set the startTime in a way that supports "resume" after Stop
function startTimer() {
  if (timerId !== null) return;
  startTime = Date.now() - elapsed;
  timerId = setInterval(tick, 10);
  startStopBtn.textContent = "Stop";
}

// this is to stop/pause the stopwatch
function stopTimer() {
  if (timerId === null) return;
  clearInterval(timerId);
  timerId = null;
  startStopBtn.textContent = "Start";
}

// this resets everything back to zero
function resetTimer() {
  stopTimer();
  elapsed = 0;
  lapCount = 0;
  render();
  lapsList.innerHTML = "";
  startStopBtn.textContent = "Start";
  lapsSection.classList.add("hidden");
}
function addLap() {
  if (timerId === null) return;
  if (lapCount === 0) lapsSection.classList.remove("hidden");
  lapCount += 1;

  // this creates one list item with two spans so my CSS can space them left/right
  const li = document.createElement("li");
  const left = document.createElement("span");
  const right = document.createElement("span");

  left.textContent = `Lap ${lapCount}:`;
  right.textContent = ` ${format(elapsed)}`;

  li.appendChild(left);
  li.appendChild(right);
  lapsList.appendChild(li);
}

// Start/Stop on same button when it toggles
startStopBtn.addEventListener("click", () => {
  if (timerId === null) {
    startTimer();
  } else {
    stopTimer();
  }
});

// Reset to always clears time and laps
resetBtn.addEventListener("click", resetTimer);

// Lap:
lapBtn.addEventListener("click", addLap);

// Theme toggle: If checked=dark theme, If not=light theme
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    wrapper.classList.remove("light-theme");
    wrapper.classList.add("dark-theme");
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  } else {
    wrapper.classList.remove("dark-theme");
    wrapper.classList.add("light-theme");
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  }
});

// this set body’s default theme on first load (light)
document.body.classList.add("light-mode");

// to make sure the toggle reflects the current theme on load (light by default)
themeToggle.checked = wrapper.classList.contains("dark-theme");

// this Shows 00:00:00.000 when the page first loads
render();

console.log("Stopwatch ready");
