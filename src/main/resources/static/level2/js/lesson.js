document.addEventListener("DOMContentLoaded", () => {
  // Select DOM Elements
  const audioButtons = [...document.querySelectorAll(".audio-button")];
  const progressLabel = document.querySelector("#progressLabel");
  const progressFill = document.querySelector("#progressFill");
  const finishButton = document.querySelector("#finishButton");
  const finishHint = document.querySelector("#finishHint");
  const finishMessage = document.querySelector("#finishMessage");
  const languageToggle = document.querySelector("#languageToggle");

  // Track progress
  const completed = new Set();
  
  // Dynamic dataset properties from <body> tag (with fallbacks)
  const courseLabel = document.body.dataset.courseLabel || "Course";
  const completeLabel = document.body.dataset.completeLabel || "Complete lesson";
  
  // Default target path set to /level3/l3c1.html if data-next is missing or incorrect
  const nextPage = document.body.dataset.next || "/level3/l3c1.html";
  
  let currentAudio = null;

  // Language toggle handler
  languageToggle?.addEventListener("click", () => {
    document.documentElement.lang =
      document.documentElement.lang === "en" ? "my" : "en";
    languageToggle.textContent =
      document.documentElement.lang === "en" ? "MM" : "EN";
  });

  // Audio button click handlers and progress tracking
  audioButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      // Pause any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
      }

      // Reset playing indicators across all audio buttons
      audioButtons.forEach((item) => item.classList.remove("playing"));
      button.classList.add("playing");

      // Mark card container as learned
      button
        .closest(
          ".review-card, .main-sign, .practice-row, .word-card, .passage-card, .sign-card"
        )
        ?.classList.add("learned");

      // Register completion index
      completed.add(index);

      // Calculate progress percentage
      const percentage = Math.round((completed.size / audioButtons.length) * 100);
      if (progressLabel) progressLabel.textContent = `${percentage}% complete`;
      if (progressFill) progressFill.style.width = `${percentage}%`;

      // Enable Finish Button when all audio files have been played
      if (completed.size === audioButtons.length && finishButton) {
        finishButton.disabled = false;
        finishButton.classList.add("completed");
        finishButton.innerHTML = `<span aria-hidden="true">⭐</span><span>${completeLabel}</span><span aria-hidden="true">✓</span>`;
        if (finishHint) {
          finishHint.textContent = `All sounds explored — ${courseLabel} is ready!`;
        }
      }

      // Play targeted audio file
      currentAudio = new Audio(button.dataset.audio);
      const reset = () => button.classList.remove("playing");

      currentAudio
        .play()
        .then(() => currentAudio.addEventListener("ended", reset, { once: true }))
        .catch(reset);
    });
  });

  // Complete button click event -> Directs to /level3/l3c1.html
  finishButton?.addEventListener("click", () => {
    if (!finishButton.disabled) {
      // Direct user to Level 3 Course 1
      window.location.href = nextPage || "/level3/l3c1.html";
    }
  });
});