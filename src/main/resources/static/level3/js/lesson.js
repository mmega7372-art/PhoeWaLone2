const audioButtons = [...document.querySelectorAll(".audio-button")];
const progressLabel = document.querySelector("#progressLabel");
const progressFill = document.querySelector("#progressFill");
const finishButton = document.querySelector("#finishButton");
const finishHint = document.querySelector("#finishHint");
const languageToggle = document.querySelector("#languageToggle");
const completed = new Set();
const courseLabel = document.body.dataset.courseLabel || "Course";
const completeLabel = document.body.dataset.completeLabel || "Complete lesson";
const nextPage = document.body.dataset.next || "";
let currentAudio = null;

languageToggle?.addEventListener("click", () => {
  document.documentElement.lang =
    document.documentElement.lang === "en" ? "my" : "en";
  languageToggle.textContent =
    document.documentElement.lang === "en" ? "MM" : "EN";
});
audioButtons.forEach((button, index) =>
  button.addEventListener("click", () => {
    if (currentAudio) currentAudio.pause();
    audioButtons.forEach((item) => item.classList.remove("playing"));
    button.classList.add("playing");
    button
      .closest(
        ".review-card, .main-sign, .practice-row, .word-card, .passage-card, .sign-card",
      )
      ?.classList.add("learned");
    completed.add(index);
    const percentage = Math.round((completed.size / audioButtons.length) * 100);
    if (progressLabel) progressLabel.textContent = `${percentage}% complete`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (completed.size === audioButtons.length) {
      finishButton.disabled = false;
      finishButton.classList.add("completed");
      finishButton.innerHTML = `<span aria-hidden="true">⭐</span><span>${completeLabel}</span><span aria-hidden="true">✓</span>`;
      finishHint.textContent = `All sounds explored — ${courseLabel} is ready!`;
    }
    currentAudio = new Audio(button.dataset.audio);
    const reset = () => button.classList.remove("playing");
    currentAudio
      .play()
      .then(() => currentAudio.addEventListener("ended", reset, { once: true }))
      .catch(reset);
  }),
);
finishButton?.addEventListener("click", () => {
  if (finishButton.disabled) return;
  if (nextPage) {
    window.location.href = nextPage;
  } else {
    finishButton.textContent = `${courseLabel} completed! 🎉`;
    const finishMessage = document.querySelector("#finishMessage");
    if (finishMessage) finishMessage.hidden = false;
    document.querySelector(".finish-card").classList.add("celebrating");
  }
});
