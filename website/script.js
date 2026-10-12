const themeToggle = document.getElementById("themeToggle");
const counterBtn = document.getElementById("counterBtn");
const visitCounter = document.getElementById("visitCounter");
const celebrateBtn = document.getElementById("celebrateBtn");
const celebrationMessage = document.getElementById("celebrationMessage");

// Restore the user's saved theme.
const savedTheme = localStorage.getItem("website-theme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "🌙";
}

// Toggle between dark and light themes.
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains("light-theme");

    themeToggle.textContent = isLight ? "🌙" : "☀️";
    localStorage.setItem("website-theme", isLight ? "light" : "dark");
});

// Interactive click counter.
let clicks = 0;

counterBtn.addEventListener("click", () => {
    clicks++;
    visitCounter.textContent = clicks;
});

// Celebrate the deployment milestone.
celebrateBtn.addEventListener("click", () => {
    celebrationMessage.textContent =
        "🎉 Great job! Your DevOps journey has officially begun!";
});