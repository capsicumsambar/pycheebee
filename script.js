// Game state management
let gameState = {
  currentSet: null,
  currentWordIndex: 0,
  currentWord: null,
  score: 0,
  answeredQuestions: [],
  usedCarFacts: [],
  speechVoice: null,
};

// Initialize speech synthesis
function initSpeech() {
  if ("speechSynthesis" in window) {
    // Wait for voices to load
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer US English voice
      gameState.speechVoice =
        voices.find(
          (voice) => voice.lang === "en-US" && voice.name.includes("Female")
        ) ||
        voices.find((voice) => voice.lang === "en-US") ||
        voices.find((voice) => voice.lang.startsWith("en")) ||
        voices[0];
    };

    // Load voices initially
    loadVoices();

    // Some browsers need this event
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  initSpeech();
});

// Start game with selected set
function startGame(setNumber) {
  gameState.currentSet = WORD_SETS[setNumber];
  gameState.currentWordIndex = 0;
  gameState.score = 0;
  gameState.answeredQuestions = [];
  gameState.usedCarFacts = [];

  // Shuffle the words in the set
  gameState.currentSet.words = shuffleArray([...gameState.currentSet.words]);

  // Hide start screen, show game screen
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "flex";
  document.getElementById("gameOver").style.display = "none";

  loadQuestion();
}

// Load current question
function loadQuestion() {
  // Hide side section initially
  document.getElementById("sideSection").style.display = "none";

  // Clear info display
  document.getElementById("infoDisplay").style.display = "none";
  document.getElementById("infoDisplay").classList.remove("active");

  // Update progress
  updateProgress();

  // Get current word
  gameState.currentWord =
    gameState.currentSet.words[gameState.currentWordIndex];

  // Display pronunciation
  document.getElementById("phonetic").textContent =
    gameState.currentWord.pronunciation;

  // Shuffle and display options
  const shuffledOptions = shuffleArray([...gameState.currentWord.options]);
  displayOptions(shuffledOptions);

  // Auto-pronounce after a short delay
  setTimeout(() => pronounceWord(), 700);
}

// Display word options
function displayOptions(options) {
  const container = document.getElementById("wordOptions");
  container.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "word-option";
    button.textContent = option;
    button.onclick = () => checkAnswer(option, button);
    container.appendChild(button);
  });
}

// Check answer
function checkAnswer(selected, buttonElement) {
  const correct = selected === gameState.currentWord.word;
  const allButtons = document.querySelectorAll(".word-option");

  // Disable all buttons
  allButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === gameState.currentWord.word) {
      btn.classList.add("correct");
    } else if (btn === buttonElement && !correct) {
      btn.classList.add("incorrect");
    }
  });

  // Update score if correct
  if (correct) {
    gameState.score++;
    updateProgress();
  }

  // Show side section with feedback
  showResultFeedback(correct);
}

// Show result feedback
function showResultFeedback(correct) {
  const sideSection = document.getElementById("sideSection");
  const icon = document.getElementById("resultIcon");
  const text = document.getElementById("resultText");
  const spelling = document.getElementById("correctSpelling");

  if (correct) {
    icon.textContent = "✅";
    text.textContent = "Excellent!";
    spelling.textContent = "";
  } else {
    icon.textContent = "❌";
    text.textContent = "Not quite!";
    spelling.textContent = `Correct: ${gameState.currentWord.word}`;
  }

  // Show car fact
  const factText = document.getElementById("carFactText");
  let availableFacts = CAR_FACTS.filter(
    (f) => !gameState.usedCarFacts.includes(f)
  );
  if (availableFacts.length === 0) {
    gameState.usedCarFacts = [];
    availableFacts = CAR_FACTS;
  }
  const randomFact =
    availableFacts[Math.floor(Math.random() * availableFacts.length)];
  gameState.usedCarFacts.push(randomFact);
  factText.textContent = randomFact;

  // Show side section
  sideSection.style.display = "flex";
}

// Next question
function nextQuestion() {
  gameState.currentWordIndex++;

  if (gameState.currentWordIndex >= 10) {
    endGame();
  } else {
    loadQuestion();
  }
}

// End game
function endGame() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("gameOver").style.display = "flex";

  const finalScore = gameState.score;
  document.getElementById("finalScore").textContent = finalScore;

  // Performance message and stars
  let message, stars;
  if (finalScore === 10) {
    message = "Perfect! You're a spelling champion! 🏆";
    stars = "⭐⭐⭐⭐⭐";
  } else if (finalScore >= 8) {
    message = "Excellent work! Almost perfect! 🌟";
    stars = "⭐⭐⭐⭐";
  } else if (finalScore >= 6) {
    message = "Good job! Keep practicing! 👍";
    stars = "⭐⭐⭐";
  } else if (finalScore >= 4) {
    message = "Not bad! You're improving! 📚";
    stars = "⭐⭐";
  } else {
    message = "Keep trying! Practice makes perfect! 💪";
    stars = "⭐";
  }

  document.getElementById("performanceMessage").textContent = message;
  document.getElementById("starRating").textContent = stars;
}

// Back to menu
function backToMenu() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("gameOver").style.display = "none";
}

// Update progress
function updateProgress() {
  document.getElementById("currentQuestion").textContent =
    gameState.currentWordIndex + 1;
  document.getElementById("score").textContent = gameState.score;

  // Update progress bar
  const progress = ((gameState.currentWordIndex + 1) / 10) * 100;
  document.getElementById("progressFill").style.width = progress + "%";
}

// Show info
function showInfo(type) {
  const display = document.getElementById("infoDisplay");
  const word = gameState.currentWord;

  const info = {
    definition: `📖 Definition: ${word.definition}`,
    origin: `🌍 Origin: ${word.origin}`,
    partOfSpeech: `🏷️ Part of Speech: ${word.partOfSpeech}`,
  };

  display.textContent = info[type];
  display.style.display = "block";
  display.classList.add("active");
}

// Speak sentence (voice only, no text display)
function speakSentence() {
  if ("speechSynthesis" in window && gameState.currentWord) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create utterance with the sentence
    const utterance = new SpeechSynthesisUtterance(
      gameState.currentWord.sentence
    );
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Use selected voice if available
    if (gameState.speechVoice) {
      utterance.voice = gameState.speechVoice;
    }

    window.speechSynthesis.speak(utterance);

    // Visual feedback that sentence is being spoken
    const display = document.getElementById("infoDisplay");
    display.textContent = "🗣️ Playing example sentence...";
    display.style.display = "block";
    display.classList.add("active");

    // Clear the message after speech ends
    utterance.onend = () => {
      setTimeout(() => {
        display.style.display = "none";
        display.classList.remove("active");
      }, 1000);
    };
  } else {
    alert("Speech synthesis not supported in your browser.");
  }
}

// Pronounce word
function pronounceWord() {
  if ("speechSynthesis" in window && gameState.currentWord) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(gameState.currentWord.word);
    utterance.rate = 0.7; // Slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Use selected voice if available
    if (gameState.speechVoice) {
      utterance.voice = gameState.speechVoice;
    }

    // Speak the word
    window.speechSynthesis.speak(utterance);

    // Optional: Speak it twice with a pause for spelling bee effect
    utterance.onend = () => {
      setTimeout(() => {
        const utterance2 = new SpeechSynthesisUtterance(
          gameState.currentWord.word
        );
        utterance2.rate = 0.6; // Even slower second time
        utterance2.pitch = 1;
        utterance2.volume = 1;
        if (gameState.speechVoice) {
          utterance2.voice = gameState.speechVoice;
        }
        window.speechSynthesis.speak(utterance2);
      }, 500);
    };
  } else {
    // Fallback message
    alert(
      "Speech synthesis not supported. The word is related to: " +
        gameState.currentWord.definition
    );
  }
}

// Utility function to shuffle array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
