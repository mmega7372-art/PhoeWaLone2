const phrases = [
  { id: 1, english: "Hello", burmese: "မင်္ဂလာပါ", phonetic: "mingalarpar", audioSrc: "audio/Hello.mp3", imageSrc: "images/hello.jpg" },
  { id: 2, english: "Good Morning", burmese: "မင်္ဂလာမနက်ခင်းပါ", phonetic: "mingalar ma nat khin par", audioSrc: "audio/Goodmorning.mp3", imageSrc: "images/good-morning.jpg" },
  { id: 3, english: "Good Afternoon", burmese: "မင်္ဂလာနေ့လယ်ခင်းပါ", phonetic: "mingalar nay lel khin par", audioSrc: "audio/goodafternoon.mp3", imageSrc: "images/good-afternoon.jpg" },
  { id: 4, english: "Good Evening", burmese: "မင်္ဂလာညချမ်းပါ", phonetic: "mingalar nya chan par", audioSrc: "audio/Gevening.mp3", imageSrc: "images/good-evening.jpg" },
  { id: 5, english: "Good Night", burmese: "ကောင်းသောညပါ", phonetic: "kaung thaw nya par", audioSrc: "audio/Gn.mp3", imageSrc: "images/good-night.jpg" },
  { id: 6, english: "How are you?", burmese: "နေကောင်းလား", phonetic: "nay kaung lar", audioSrc: "audio/Howru.mp3", imageSrc: "images/how-are-you.jpg" },
  { id: 7, english: "Nice to meet you", burmese: "တွေ့ရတာ ဝမ်းသာပါတယ်", phonetic: "twae ya tar wam thar par tal", audioSrc: "audio/nice2meetu.mp3", imageSrc: "images/nice-to-meet-you.jpg" },
  { id: 8, english: "Thank you", burmese: "ကျေးဇူးတင်ပါတယ်", phonetic: "kyaay zoo tin par tal", audioSrc: "audio/thz.mp3", imageSrc: "images/thank-you.jpg" },
  { id: 9, english: "How much is it?", burmese: "ဒါ ဘယ်လောက်လဲ", phonetic: "dar ba lauk lae", audioSrc: "audio/Howmuch.mp3", imageSrc: "images/how-much-is-it.jpg" },
  { id: 10, english: "See you later", burmese: "နောက်မှ တွေ့မယ်နော်", phonetic: "nawk ma twae mal naw", audioSrc: "audio/seeu.mp3", imageSrc: "images/see-you-later.jpg" },
  { id: 11, english: "Wait for me", burmese: "ငါ့ကို ခဏစောင့်ပေးပါ", phonetic: "nga ko kha na saung pyae par", audioSrc: "audio/wait.mp3", imageSrc: "images/wait-for-me.jpg" },
  { id: 12, english: "Long time no see", burmese: "မတွေ့ရတာ ကြာပြီနော်", phonetic: "ma twae ya tar kyar pyi naw", audioSrc: "audio/ltns.mp3", imageSrc: "images/long-time-no-see.jpg" },
  { id: 13, english: "See you tomorrow", burmese: "မနက်ဖြန် တွေ့မယ်", phonetic: "ma nat phyan twae mal", audioSrc: "audio/seeutmr.mp3", imageSrc: "images/see-you-tomorrow.jpg" },
  { id: 14, english: "Yes", burmese: "ဟုတ်ပါတယ်", phonetic: "hoat par tal", audioSrc: "audio/yes.mp3", imageSrc: "images/yes.jpg" },
  { id: 15, english: "No", burmese: "မဟုတ်ဘူး", phonetic: "ma hoat boo", audioSrc: "audio/no.mp3", imageSrc: "images/no.jpg" }
];

let currentIndex = 0;

const phraseListEl = document.getElementById("phraseList");
const burmeseTextEl = document.getElementById("burmeseText");
const phoneticTextEl = document.getElementById("phoneticText");
const englishTextEl = document.getElementById("englishText");
const audioPlayer = document.getElementById("audioPlayer");
const playAudioBtn = document.getElementById("playAudioBtn");
const phraseImageEl = document.getElementById("phraseImage");

function renderSidebar() {
  phraseListEl.innerHTML = "";
  phrases.forEach((phrase, index) => {
    const li = document.createElement("li");
    li.className = `phrase-item ${index === currentIndex ? "active" : ""}`;
    li.innerHTML = `
      <span>${phrase.english}</span>
      <i class="fa-solid fa-check check-icon"></i>
    `;
    li.addEventListener("click", () => selectPhrase(index));
    phraseListEl.appendChild(li);
  });
}

function selectPhrase(index) {
  currentIndex = index;
  const currentPhrase = phrases[index];
  
  burmeseTextEl.textContent = currentPhrase.burmese;
  phoneticTextEl.textContent = currentPhrase.phonetic;
  englishTextEl.textContent = currentPhrase.english;
  audioPlayer.src = currentPhrase.audioSrc;

  // Update background image for the active phrase
  if (phraseImageEl) {
    phraseImageEl.src = currentPhrase.imageSrc;
  }

  renderSidebar();
}

playAudioBtn.addEventListener("click", () => {
  if (audioPlayer.src) {
    audioPlayer.play().catch(error => {
      console.log("Audio file missing or blocked by browser:", error);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  selectPhrase(0);
});