
const quizQuestions = [
  {
    type: "select-image",
    instruction: "Select the correct image for Clock",
  
    audioUrl: "audio/clock.mp3",
    options: [
      { text: "နာရီ", image: "images/clock.jpg", correct: true },
      { text: "ထီး", image: "images/umbrella.jpg", correct: false },
      { text: "ငါး", image: "images/fish.jpg", correct: false },
      { text: "ရထား", image: "images/train.png", correct: false }
    ]
  },
  {
    type: "translate",
    instruction: "Select the correct translation",
    promptText: "Parents",
    options: ["မိဘ", "ညီမ", "နဂါး", "မထိရ"],
    correctAnswer: "မိဘ"
  },
  {
    type: "tap-what-you-hear",
    instruction: "Tap what you hear!",
     audioUrl: "audio/parents.mp3",
    promptText: "Listen to the phrase",
    wordBank: ["နာရီ", "မိဘ", "ထီး", "ငါး"],
    correctSequence: ["မိဘ"]
  },
  {
    type: "matching",
    instruction: "Tap the matching pairs",
    pairs: [
      { left: "Fish", right: "ငါး" },
      { left: "Train", right: "ရထား" },
      { left: "Dragon", right: "နဂါး" },
      { left: "Bamboo", right: "ဝါး" }
    ]
  },
  {
    type: "vowels-check",
    instruction: "Identify the Diacritic Symbol",
     audioUrl: "audio/yaycha.mp3",
    options: ["ရေးချ ( ာ )", "လုံးကြီးတင် ( ိ )", "တစ်ချောင်းငင် ( ု )", "ဝတ်စနှစ်လုံးပေါက် ( း )"],
    correctAnswer: "ရေးချ ( ာ )"
  },
  {
    type: "translate",
    instruction: "Select the correct meaning",
    promptText: "Don't touch",
    options: ["မထိရ", "ညီမ", "နာရီ", "ရထား"],
    correctAnswer: "မထိရ"
  },
  {
    type: "sentence-builder",
    instruction: "Choose these nouns: 'Fish' and 'Bamboo'",
    
    wordBank: ["ဝါး", "ငါး", "နှင့်", "ထီး"],
    correctSequence: ["ငါး", "ဝါး"]
  },
  {
    type: "listening-choice",
    instruction: "Listen and choose the diacritic name",
    promptAudio: "audio/lone_g_tin.mp3",
    promptText: "Listen carefully to the audio",
    options: ["လုံးကြီးတင် ( ိ )", "မောက်ချ ( ါ )", "နှစ်ချောင်းငင် ( ူ )", "နောက်ပစ် ( ဲ )"],
    correctAnswer: "လုံးကြီးတင် ( ိ )"
  },
  {
    type: "fill-blank",
    instruction: "Fill in the missing character for 'Dragon'",
    promptText: "န _ _ (Dragon)",
    options: ["ဓါး", "ဂါး", "ဝါး", "ငါး"],
    correctAnswer: "ဂါး"
  },
  {
    type: "select-image",
    instruction: "Select the correct image for Train",
  
    options: [
      { text: "ထီး", image: "images/umbrella.jpg", correct: false },
      { text: "ရထား", image: "images/train.png", correct: true },
      { text: "နဂါး", image: "images/dragon.jpg", correct: false },
      { text: "ငါး", image: "images/fish.jpg", correct: false }
    ]
  }
];

let currentIndex = 0;
let userSelection = null;
let selectedWords = [];
let matchedCount = 0;
let correctCount = 0;

const progressBar = document.getElementById("progress-bar");
const questionTracker = document.getElementById("question-tracker");
const instructionTitle = document.getElementById("instruction-title");
const promptText = document.getElementById("prompt-text");
const btnAudioPrompt = document.getElementById("btn-audio-prompt");
const interactiveArea = document.getElementById("interactive-area");
const sentenceZone = document.getElementById("sentence-builder-zone");
const answerSlots = document.getElementById("answer-slots");
const btnCheck = document.getElementById("btn-check");
const feedbackBanner = document.getElementById("feedback-banner");

function renderQuestion() {
  userSelection = null;
  selectedWords = [];
  btnCheck.disabled = true;
  btnCheck.innerText = "CHECK ANSWER";
  btnCheck.onclick = checkAnswer;
  feedbackBanner.className = "feedback-banner hidden";

  const q = quizQuestions[currentIndex];

  // Update Header Trackers
  questionTracker.innerText = `Question ${currentIndex + 1} of ${quizQuestions.length}`;
  progressBar.style.width = `${((currentIndex + 1) / quizQuestions.length) * 100}%`;

  instructionTitle.innerText = q.instruction;

  // Prompt Box ထဲသို့ Text ထည့်သွင်းခြင်း
  const promptBox = document.getElementById("prompt-text");
  promptBox.innerText = q.promptText || "";

  // Prompt Box ကို ဓာတ်ပုံ သို့မဟုတ် စာလုံးပေါ်မူတည်၍ Style ချိန်ညှိခြင်း
  if (q.promptText) {
    promptBox.classList.remove("hidden");
  } else {
    promptBox.classList.add("hidden");
  }
  
  if (q.promptAudio || q.audioUrl) {
    btnAudioPrompt.classList.remove("hidden");
    btnAudioPrompt.onclick = () => new Audio(q.promptAudio || q.audioUrl).play();
  } else {
    btnAudioPrompt.classList.add("hidden");
  }

  sentenceZone.classList.add("hidden");
  interactiveArea.innerHTML = "";

  if (q.type === "select-image") {
    renderImageGrid(q.options);
  } else if (q.type === "translate" || q.type === "vowels-check" || q.type === "listening-choice" || q.type === "fill-blank") {
    renderListOptions(q.options);
  } else if (q.type === "tap-what-you-hear" || q.type === "sentence-builder") {
    sentenceZone.classList.remove("hidden");
    renderWordBank(q.wordBank);
  } else if (q.type === "matching") {
    renderMatchingPairs(q.pairs);
  }
}

function renderImageGrid(options) {
  const grid = document.createElement("div");
  grid.className = "image-grid";

  options.forEach((opt, index) => {
    const card = document.createElement("div");
  
    const colorClass = index % 2 === 0 ? "yellow-type" : "purple-type";
    card.className = `img-card ${colorClass}`;
    card.innerHTML = `<img src="${opt.image}" alt="${opt.text}"><span>${opt.text}</span>`;
    card.onclick = () => {
      document.querySelectorAll(".img-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      userSelection = opt;
      btnCheck.disabled = false;
    };
    grid.appendChild(card);
  });

  interactiveArea.appendChild(grid);
}

function renderListOptions(options) {
  const container = document.createElement("div");
  container.className = "list-options";

  options.forEach((opt, index) => {
    const tile = document.createElement("div");
    const colorClass = index % 2 === 0 ? "yellow-type" : "purple-type";
    tile.className = `list-tile ${colorClass}`;
    tile.innerText = opt;
    tile.onclick = () => {
      document.querySelectorAll(".list-tile").forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      userSelection = opt;
      btnCheck.disabled = false;
    };
    container.appendChild(tile);
  });

  interactiveArea.appendChild(container);
}

function renderWordBank(words) {
  answerSlots.innerHTML = "";
  const bank = document.createElement("div");
  bank.className = "word-bank";

  words.forEach(word => {
    const tile = document.createElement("div");
    tile.className = "word-tile";
    tile.innerText = word;

    tile.onclick = () => {
      if (tile.classList.contains("used")) return;

      tile.classList.add("used");
      selectedWords.push(word);

      const slotTile = document.createElement("div");
      slotTile.className = "word-tile";
      slotTile.innerText = word;
      slotTile.onclick = () => {
        tile.classList.remove("used");
        selectedWords = selectedWords.filter(w => w !== word);
        slotTile.remove();
        btnCheck.disabled = selectedWords.length === 0;
      };

      answerSlots.appendChild(slotTile);
      btnCheck.disabled = false;
    };

    bank.appendChild(tile);
  });

  interactiveArea.appendChild(bank);
}

function renderMatchingPairs(pairs) {
  matchedCount = 0;
  let leftItems = pairs.map(p => p.left);
  let rightItems = pairs.map(p => p.right).sort(() => Math.random() - 0.5);

  const grid = document.createElement("div");
  grid.className = "match-grid";

  let selectedLeft = null;
  let selectedRight = null;

  const leftCol = document.createElement("div");
  leftCol.className = "list-options";
  leftItems.forEach((item, index) => {
    const t = document.createElement("div");
    const colorClass = index % 2 === 0 ? "yellow-type" : "purple-type";
    t.className = `list-tile ${colorClass}`;
    t.innerText = item;
    
    t.onclick = () => {
      if (t.classList.contains("matched")) return;
      
      document.querySelectorAll("#left-col .list-tile:not(.matched)").forEach(x => x.classList.remove("selected"));
      t.classList.add("selected");
      selectedLeft = { text: item, el: t };
      checkPairMatch();
    };
    leftCol.appendChild(t);
  });
  leftCol.id = "left-col";

  const rightCol = document.createElement("div");
  rightCol.className = "list-options";
  rightItems.forEach((item, index) => {
    const t = document.createElement("div");
    const colorClass = index % 2 === 0 ? "purple-type" : "yellow-type";
    t.className = `list-tile ${colorClass}`;
    t.innerText = item;
    
    t.onclick = () => {
      if (t.classList.contains("matched")) return; 
      
      document.querySelectorAll("#right-col .list-tile:not(.matched)").forEach(x => x.classList.remove("selected"));
      t.classList.add("selected");
      selectedRight = { text: item, el: t };
      checkPairMatch();
    };
    rightCol.appendChild(t);
  });
  rightCol.id = "right-col";

  function checkPairMatch() {
    if (selectedLeft && selectedRight) {
      const pair = pairs.find(p => p.left === selectedLeft.text);
      
      if (pair && pair.right === selectedRight.text) {
        // Correct Pair Match - အစိမ်းရောင် Highlight ပြပြီး ငြိမ်သွားမည်
        selectedLeft.el.classList.remove("selected");
        selectedRight.el.classList.remove("selected");
        
        selectedLeft.el.classList.add("matched");
        selectedRight.el.classList.add("matched");
        
        matchedCount++;
        
        // ၄ စုံစလုံး ကိုက်ညီသွားပါက
        if (matchedCount === pairs.length) {
          btnCheck.disabled = false;
          userSelection = true;
        }
      } else {
        // Wrong Pair Match - အနီရောင်ခဏပြပြီး Reset ပြန်လုပ်မည်
        const leftEl = selectedLeft.el;
        const rightEl = selectedRight.el;
        
        leftEl.classList.add("wrong-match");
        rightEl.classList.add("wrong-match");
        
        setTimeout(() => {
          leftEl.classList.remove("selected", "wrong-match");
          rightEl.classList.remove("selected", "wrong-match");
        }, 600);
      }
      
      selectedLeft = null;
      selectedRight = null;
    }
  }

  grid.appendChild(leftCol);
  grid.appendChild(rightCol);
  interactiveArea.appendChild(grid);
}

function checkAnswer() {
  const q = quizQuestions[currentIndex];
  let isCorrect = false;

  if (q.type === "select-image") {
    isCorrect = userSelection && userSelection.correct;
  } else if (q.type === "translate" || q.type === "vowels-check" || q.type === "listening-choice" || q.type === "fill-blank") {
    isCorrect = userSelection === q.correctAnswer;
  } else if (q.type === "tap-what-you-hear" || q.type === "sentence-builder") {
    isCorrect = JSON.stringify(selectedWords) === JSON.stringify(q.correctSequence);
  } else if (q.type === "matching") {
    isCorrect = true;
  }

  showFeedback(isCorrect);
}

function showFeedback(isCorrect) {
  feedbackBanner.classList.remove("hidden");
  const title = document.getElementById("feedback-title");
  const desc = document.getElementById("feedback-desc");
  const icon = document.getElementById("feedback-icon");

  if (isCorrect) {
    correctCount++;
    feedbackBanner.className = "feedback-banner correct";
    icon.innerText = "✓";
    title.innerText = "Awesome!";
    desc.innerText = "You got the correct answer.";
  } else {
    feedbackBanner.className = "feedback-banner wrong";
    icon.innerText = "✕";
    title.innerText = "Correct answer:";
    desc.innerText = quizQuestions[currentIndex].correctAnswer || "Check your sequence/selection";
  }

  btnCheck.innerText = "CONTINUE →";
  btnCheck.onclick = nextQuestion;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < quizQuestions.length) {
    renderQuestion();
  } else {
    showFinalResults();
  }
}

function showFinalResults() {
  document.getElementById("quiz-box").classList.add("hidden");
  document.querySelector(".bottom-bar").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  const accuracy = Math.round((correctCount / quizQuestions.length) * 100);
  document.getElementById("stat-accuracy").innerText = `${accuracy}%`;
}

renderQuestion();