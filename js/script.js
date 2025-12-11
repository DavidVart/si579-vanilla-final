// State variables
let selectedDuration = 25 * 60;
let remainingSeconds = selectedDuration;
let timerId = null;
let sessionsCount = 0;

// DOM elements
const presetButtons = document.querySelectorAll('.preset-btn');
const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.querySelector('.start-btn');
const pauseBtn = document.querySelector('.pause-btn');
const resetBtn = document.querySelector('.reset-btn');
const sessionsCountElement = document.querySelector('.sessions-count');
const completionMessage = document.querySelector('.completion-message');

// Format seconds to MM:SS
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Update timer display
const renderTime = () => {
  timerDisplay.textContent = formatTime(remainingSeconds);
};

// Update sessions count display
const renderSessionsCount = () => {
  sessionsCountElement.textContent = sessionsCount;
};

// Get today's date as a string
const getTodayString = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

// Load sessions from localStorage
const loadSessionsFromLocalStorage = () => {
  const storedDate = localStorage.getItem('studySessionsDate');
  const storedCount = localStorage.getItem('studySessionsCount');
  const todayString = getTodayString();

  if (storedDate === todayString && storedCount !== null) {
    sessionsCount = parseInt(storedCount, 10);
  } else {
    sessionsCount = 0;
    localStorage.setItem('studySessionsDate', todayString);
    localStorage.setItem('studySessionsCount', '0');
  }

  renderSessionsCount();
};

// Save sessions to localStorage
const saveSessionsToLocalStorage = () => {
  const todayString = getTodayString();
  localStorage.setItem('studySessionsDate', todayString);
  localStorage.setItem('studySessionsCount', String(sessionsCount));
};

// Complete a session
const completeSession = () => {
  remainingSeconds = 0;
  renderTime();

  sessionsCount++;
  saveSessionsToLocalStorage();
  renderSessionsCount();
  completionMessage.hidden = false;
};

// Handle preset button click
const handlePresetClick = (minutes) => {
  pauseTimer();
  selectedDuration = minutes * 60;
  remainingSeconds = selectedDuration;
  renderTime();
  completionMessage.hidden = true;

  presetButtons.forEach((btn) => {
    btn.classList.remove('active');
  });
  const clickedButton = document.querySelector(`[data-minutes="${minutes}"]`);
  clickedButton.classList.add('active');
};

// Start the timer
const startTimer = () => {
  if (timerId !== null) {
    return;
  }

  // If the timer finished previously, start a fresh session
  if (remainingSeconds <= 0) {
    remainingSeconds = selectedDuration;
    renderTime();
  }

  completionMessage.hidden = true;

  timerId = setInterval(() => {
    remainingSeconds--;
    renderTime();

    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      timerId = null;
      completeSession();
    }
  }, 1000);
};

// Pause the timer
const pauseTimer = () => {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
};

// Reset the timer
const resetTimer = () => {
  pauseTimer();
  remainingSeconds = selectedDuration;
  renderTime();
  completionMessage.hidden = true;
};

// Event listeners
presetButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const minutes = parseInt(btn.dataset.minutes, 10);
    handlePresetClick(minutes);
  });
});

startBtn.addEventListener('click', () => {
  startTimer();
});

pauseBtn.addEventListener('click', () => {
  pauseTimer();
});

resetBtn.addEventListener('click', () => {
  resetTimer();
});

// Initialize
loadSessionsFromLocalStorage();
renderTime();

// Set default active preset (25 minutes)
document.querySelector('[data-minutes="25"]').classList.add('active');
