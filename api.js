const API_KEY = "live_P6LlOdplbdwwzhqhBifJ8stQXnVnvHEnXS1al28Lr6emVSGGxLLgENu7OtYI5XIR";

fetch("https://api.thecatapi.com/v1/images/search", {
    headers: {
        "x-api-key": API_KEY
    }
})
    .then(res => res.json())
    .then(data => console.log(data));

const WORK_CATEGORY_ID = 1;
const BREAK_CATEGORY_ID = 5;

// dom
const timerEl = document.getElementById("timer");
const modeEl = document.getElementById("mode");
const catImg = document.getElementById("cat-img");
const quoteEl = document.getElementById("quote");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", startTimer);

// work
let mode = "work";
let timeLeft = 25 * 60;
let timerInterval = null;

// sessions
let workCount = 0;
let breakCount = 0;

//timer
function startTimer() {
     if (timerInterval) return;
    catImg.style.display = "block";

    if (mode === "work") {
        onWorkStart();
    } else {
        onBreakStart();
    }

    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft === 0) {
            switchMode();
        }

        updateUI();
    }, 1000);
}


//mode
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
    updateUI();
}

function updateUI() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    modeEl.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);

    // sessions
    document.getElementById("work-count").textContent = workCount;
    document.getElementById("break-count").textContent = breakCount;
}


//cat categories
async function fetchCat(categoryId) {
    const res = await fetch(
        `https://api.thecatapi.com/v1/images/search?category_ids=${categoryId}`
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

// quotes
const quotes = [
    "You did great. Now go loaf.",
    "Even cats take breaks.",
    "Stretch like a cat. You earned it."
];
function showMotivationalQuote() {
    const random =
        quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = random;
}

// start button
startBtn.addEventListener("click", startTimer);


