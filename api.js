const API_KEY = "live_P6LlOdplbdwwzhqhBifJ8stQXnVnvHEnXS1al28Lr6emVSGGxLLgENu7OtYI5XIR";

const WORK_CATEGORY_ID = 1;
const BREAK_CATEGORY_ID = 5;

const timerEl = document.getElementById("timer");
const modeEl = document.getElementById("mode");
const catImg = document.getElementById("cat-img");
const quoteEl = document.getElementById("quote");
const startBtn = document.getElementById("startBtn");

const doneSound = new Audio("img/harp.mp3");
doneSound.volume = 0.6;

let mode = "work";
let timeLeft = 25 * 60;
let timerInterval = null;
let isPaused = false;

let workCount = 0;
let breakCount = 0;

startBtn.addEventListener("click", toggleTimer);

function toggleTimer() {
    timerInterval ? pauseTimer() : startTimer();
}

function startTimer() {
    catImg.style.display = "block";

    if (!isPaused) {
        mode === "work" ? onWorkStart() : onBreakStart();
    }

    isPaused = false;
    startBtn.textContent = "Pause";

    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft === 0) {
            doneSound.currentTime = 0;
            doneSound.play();
            switchMode();
        }

        updateUI();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = true;
    startBtn.textContent = "Resume";
}

function switchMode() {
    if (mode === "work") {
        workCount++;
        mode = "break";
        timeLeft = 5 * 60;
        onBreakStart();
    } else {
        breakCount++;
        mode = "work";
        timeLeft = 25 * 60;
        onWorkStart();
    }
}

function updateUI() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerEl.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

    modeEl.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    document.getElementById("work-count").textContent = workCount;
    document.getElementById("break-count").textContent = breakCount;
}

async function fetchCat(categoryId) {
    const res = await fetch(
        `https://api.thecatapi.com/v1/images/search?category_ids=${categoryId}`,
        { headers: { "x-api-key": API_KEY } }
    );
    const data = await res.json();
    return data[0].url;
}

async function onWorkStart() {
    catImg.src = await fetchCat(WORK_CATEGORY_ID);
    quoteEl.textContent = "";
}

async function onBreakStart() {
    catImg.src = await fetchCat(BREAK_CATEGORY_ID);
    showMotivationalQuote();
}

async function onWorkStart() {
    document.getElementById("left-gif").style.display = "none";
    document.getElementById("right-gif").style.display = "none";

    catImg.src = await fetchCat(WORK_CATEGORY_ID);
    catImg.style.display = "block";

    quoteEl.textContent = "";
}

async function onBreakStart() {
    document.getElementById("left-gif").style.display = "block";
    document.getElementById("right-gif").style.display = "block";
    catImg.src = await fetchCat(BREAK_CATEGORY_ID);
    catImg.style.display = "block";

    showMotivationalQuote();
}

const quotes = [
    "You did great. Now go loaf.",
    "Even cats take breaks.",
    "Stretch like a cat. You earned it."
];

function showMotivationalQuote() {
    quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}