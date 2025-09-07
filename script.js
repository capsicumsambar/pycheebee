// Game state variables
let currentSet = null;
let currentWordIndex = 0;
let score = 0;
let currentWord = null;
let hintsUsed = false;
let answeredWords = [];

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Set button event listeners
  document
    .getElementById("set1-btn")
    .addEventListener("click", () => startSet("set1"));
  document
    .getElementById("set2-btn")
    .addEventListener("click", () => startSet("set2"));
  document
    .getElementById("set3-btn")
    .addEventListener("click", () => startSet("set3"));
  document
    .getElementById("set4-btn")
    .addEventListener("click", () => startSet("set4"));
  document
    .getElementById("set5-btn")
    .addEventListener("click", () => startSet("set5"));

  // Game controls
  document
    .getElementById("listen-btn")
    .addEventListener("click", pronounceWord);
  document.getElementById("back-btn").addEventListener("click", backToMenu);
  document.getElementById("next-btn").addEventListener("click", nextWord);
  document
    .getElementById("play-again-btn")
    .addEventListener("click", () => location.reload());

  // Hint buttons
  document
    .getElementById("hint-definition")
    .addEventListener("click", () => showHint("definition"));
  document
    .getElementById("hint-origin")
    .addEventListener("click", () => showHint("origin"));
  document
    .getElementById("hint-example")
    .addEventListener("click", () => showHint("example"));
  document
    .getElementById("hint-part")
    .addEventListener("click", () => showHint("partOfSpeech"));
});

function startSet(setName) {
  currentSet = wordSets[setName];
  currentWordIndex = 0;
  score = 0;
  answeredWords = [];

  // Hide start screen, show game screen
  document.getElementById("start-screen").classList.add("d-none");
  document.getElementById("game-screen").classList.remove("d-none");
  document.getElementById("score").textContent = score;

  loadWord();
}

function loadWord() {
  if (currentWordIndex >= currentSet.length) {
    endGame();
    return;
  }

  currentWord = currentSet[currentWordIndex];
  hintsUsed = false;

  // Update progress
  document.getElementById("current-word").textContent = currentWordIndex + 1;
  document.getElementById("progress-bar").style.width = `${
    ((currentWordIndex + 1) / currentSet.length) * 100
  }%`;

  // Reset display
  document.getElementById("phonetic-display").textContent =
    "Listen to the word";
  document.getElementById("info-display").classList.add("d-none");
  document.getElementById("result-feedback").classList.add("d-none");
  document.getElementById("next-btn").classList.add("d-none");

  // Generate options
  generateOptions();

  // Auto-pronounce
  setTimeout(() => pronounceWord(), 500);
}

function generateOptions() {
  const options = currentWord.options;
  const optionsContainer = document.getElementById("options-container");

  // Clear previous options
  optionsContainer.innerHTML = "";

  options.forEach((option, index) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6";

    const button = document.createElement("button");
    button.className = "word-option";
    button.textContent = option;
    button.addEventListener("click", function () {
      checkAnswer(option, this);
    });

    col.appendChild(button);
    optionsContainer.appendChild(col);
  });
}

function checkAnswer(selectedWord, buttonElement) {
  // Disable all buttons
  const allButtons = document.querySelectorAll(".word-option");
  allButtons.forEach((btn) => (btn.disabled = true));

  const isCorrect = selectedWord === currentWord.correct;

  if (isCorrect) {
    buttonElement.classList.add("correct");
    if (!hintsUsed) {
      score += 10;
    } else {
      score += 5;
    }
    showResult(true);
  } else {
    buttonElement.classList.add("incorrect");
    // Highlight correct answer
    allButtons.forEach((btn) => {
      if (btn.textContent === currentWord.correct) {
        btn.classList.add("correct");
      }
    });
    showResult(false);
  }

  document.getElementById("score").textContent = score;
  answeredWords.push({
    word: currentWord.correct,
    correct: isCorrect,
  });
}

function showResult(isCorrect) {
  const feedback = document.getElementById("result-feedback");
  const icon = document.getElementById("result-icon");
  const text = document.getElementById("result-text");
  const spelling = document.getElementById("correct-spelling");

  feedback.classList.remove("d-none");

  if (isCorrect) {
    icon.textContent = "✅";
    text.textContent = "Correct!";
    spelling.textContent = "Well done!";
  } else {
    icon.textContent = "❌";
    text.textContent = "Not quite!";
    spelling.textContent = `Correct spelling: ${currentWord.correct}`;
  }

  // Show next button
  document.getElementById("next-btn").classList.remove("d-none");
}

function showHint(type) {
  hintsUsed = true;
  const infoDisplay = document.getElementById("info-display");
  const infoContent = document.getElementById("info-content");

  let content = "";
  switch (type) {
    case "definition":
      content = `<strong>📖 Definition:</strong> ${currentWord.definition}`;
      infoDisplay.classList.remove("d-none");
      break;
    case "origin":
      content = `<strong>🌍 Origin:</strong> ${currentWord.origin}`;
      infoDisplay.classList.remove("d-none");
      break;
    case "example":
      // Only play audio for example, don't show text
      content = `<strong>💡 Example:</strong> <em>Playing example sentence...</em>`;
      infoDisplay.classList.remove("d-none");

      // Speak the example
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentWord.example);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onend = () => {
          // Update the display to show it's done playing
          infoContent.innerHTML = `<strong>💡 Example:</strong> <em>Example played (click to hear again)</em>`;
        };

        utterance.onerror = () => {
          infoContent.innerHTML = `<strong>💡 Example:</strong> <em>Audio error - try again</em>`;
        };

        speechSynthesis.speak(utterance);
      }
      break;
    case "partOfSpeech":
      content = `<strong>🏷️ Part of Speech:</strong> ${currentWord.partOfSpeech}`;
      infoDisplay.classList.remove("d-none");
      break;
  }

  infoContent.innerHTML = content;
}

function pronounceWord() {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentWord.correct);
    utterance.rate = 0.8;
    utterance.pitch = 1;

    document.getElementById("phonetic-display").textContent = "🔊 Playing...";

    utterance.onend = () => {
      document.getElementById("phonetic-display").textContent =
        "Click to listen again";
    };

    utterance.onerror = () => {
      document.getElementById("phonetic-display").textContent =
        "Audio error - try again";
    };

    speechSynthesis.speak(utterance);
  } else {
    alert("Speech synthesis not supported in your browser");
  }
}

function nextWord() {
  currentWordIndex++;
  loadWord();
}

function backToMenu() {
  if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
    location.reload();
  }
}

function endGame() {
  // Hide game screen, show game over screen
  document.getElementById("game-screen").classList.add("d-none");
  document.getElementById("game-over").classList.remove("d-none");

  // Display final score
  document.getElementById("final-score").textContent = score;

  // Calculate star rating and message
  const percentage = (score / (currentSet.length * 10)) * 100;
  let stars = "";
  let message = "";

  if (percentage >= 90) {
    stars = "⭐⭐⭐⭐⭐";
    message = "Outstanding! You're a spelling champion!";
  } else if (percentage >= 80) {
    stars = "⭐⭐⭐⭐";
    message = "Excellent work! Almost perfect!";
  } else if (percentage >= 70) {
    stars = "⭐⭐⭐";
    message = "Great job! Keep practicing!";
  } else if (percentage >= 60) {
    stars = "⭐⭐";
    message = "Good effort! You're getting there!";
  } else {
    stars = "⭐";
    message = "Keep practicing! You'll improve!";
  }

  document.getElementById("star-rating").textContent = stars;
  document.getElementById("performance-message").textContent = message;

  // Show word summary
  const summaryDiv = document.getElementById("word-summary");
  const correctCount = answeredWords.filter((w) => w.correct).length;
  const incorrectCount = answeredWords.filter((w) => !w.correct).length;

  summaryDiv.innerHTML = `
        <h5>Your Results:</h5>
        <p class="mb-1">✅ Correct: ${correctCount} words</p>
        <p class="mb-0">❌ Incorrect: ${incorrectCount} words</p>
    `;
}
