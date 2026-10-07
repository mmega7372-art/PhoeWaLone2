// Centralized Language Toggle Handler for Navbar
function setupNavbarLanguageToggle() {
  const langBtn = document.querySelector("#languageToggle, #language-toggle, .language-button, .btn-mm-pill");
  if (!langBtn) return;

  // Sync initial button text based on stored or document language
  const currentLang = localStorage.getItem("lessonLanguage") || document.documentElement.lang || "en";
  document.documentElement.lang = currentLang;
  langBtn.textContent = currentLang === "my" ? "ENG" : "MM";

  langBtn.addEventListener("click", () => {
    const isMyanmar = document.documentElement.lang === "my";
    const nextLang = isMyanmar ? "en" : "my";

    document.documentElement.lang = nextLang;
    langBtn.textContent = nextLang === "my" ? "ENG" : "MM";
    localStorage.setItem("lessonLanguage", nextLang);

    // Update data attribute translations if present on page
    document.querySelectorAll("[data-my][data-en]").forEach((el) => {
      el.textContent = nextLang === "en" ? el.dataset.en : el.dataset.my;
    });

    // Invoke Course dynamic translation function if present
    if (typeof window.applyLanguage === "function") {
      window.applyLanguage(nextLang);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarLanguageToggle();

  if (document.body.dataset.lesson === "4") {
    initCourseFour();
  } else if (document.body.dataset.course === "5") {
    initCourseFive();
  } else if (document.body.dataset.course === "2") {
    initCourseTwo();
  } else if (document.body.dataset.course === "3") {
    initCourseThree();
  } else {
    initCourseOne();
  }
});

/* ==========================================================================
   COURSE 1
   ========================================================================== */
function initCourseOne() {
  const startButton = document.querySelector("#startLesson");
  const lessonCards = document.querySelector("#lessonCards");
  const audioButtons = document.querySelectorAll(".audio-button");
  const encouragement = document.querySelector("#encouragement");
  const completeButton = document.querySelector("#completeLesson");
  const completeButtonText = document.querySelector(".complete-button-text");
  const completeHint = document.querySelector(".complete-hint");

  let currentAudio = null;
  const learnedSigns = new Set();
  let currentLanguage = localStorage.getItem("lessonLanguage") || "my";

  const translations = {
    my: {
      pageTitle: "Level 1 · Course 1 | Phoe Wa Lone",
      nav: ["ပင်မစာမျက်နှာ", "အကြောင်းအရာ", "သင်ခန်းစာများ", "မာတိကာ"],
      back: "← သင်ခန်းစာများသို့ ပြန်သွားမည်",
      label: "⭐ Level 1 · Course 1",
      title: "မြန်မာသင်္ကေတလေးတွေ<br>သင်ယူကြမယ်!",
      intro: "အသံကိုနားထောင်၊ လိုက်ဆိုပြီး စာလုံးပေါင်းစပ်ပုံကို ပျော်ပျော်ရွှင်ရွှင် လေ့လာပါ။",
      start: "▶ စတင်သင်ယူမယ်",
      chapter: "အခန်း ၁",
      sectionTitle: "သင်္ကေတ ၅ ခုကို လေ့လာမယ်",
      sectionIntro: "ကတ်လေးတစ်ခုစီကိုနှိပ်ပြီး အသံထွက်နဲ့ ရှင်းလင်းချက်ကို ကြည့်ပါ။",
      lessonTip: "ဒီသင်္ကေတတွေကို ဗျည်းနဲ့ပေါင်းသုံးပါတယ်။ အသံခလုတ်တစ်ခုစီကိုနှိပ်ပြီး သုံးကြိမ်လိုက်ဆိုပါ။",
      cardTitles: ["ရေးချ", "သ၀ေထိုး", "လုံးကြီးတင်", "လုံးကြီးတင်ဆံခတ်", "၀စ္စနှစ်လုံးပေါက်"],
      cardDescriptions: [
        "စာလုံးနောက်မှာရေးပြီး “အာ” အသံဖြစ်စေတယ်။",
        "စာလုံးရှေ့မှာရေးပြီး “အေ” အသံဖြစ်စေတယ်။",
        "စာလုံးအပေါ်မှာရေးပြီး “အိ” အသံဖြစ်စေတယ်။",
        "စာလုံးအပေါ်မှာရေးပြီး “အီ” အသံဖြစ်စေတယ်။",
        "စာလုံးနောက်မှာရေးပြီး အသံကို ပြောင်းလဲပေးတယ်။"
      ],
      listen: "နားထောင်မယ်",
      encouragementTitle: "တော်လိုက်တာ!",
      encouragementText: "အသံခလုတ်ကိုနှိပ်ပြီး ကလေးနဲ့အတူ လိုက်ဆိုကြည့်နော်။",
      audioMissing: "ဒီအသံဖိုင်ကို မထည့်ရသေးပါ။ audio folder ထဲတွင် သက်ဆိုင်ရာ MP3 ဖိုင်ထည့်ပေးပါ။",
      completeTitle: "အရမ်းတော်တယ်! သင်ခန်းစာပြီးပါပြီ 🎉",
      completeText: "သင်္ကေတ ၅ ခုလုံးကို လေ့လာပြီးပါပြီ။ နောက်တစ်ခေါက် ထပ်လေ့ကျင့်ကြည့်နော်။",
      completeButton: "Next Course",
      completedButton: "Next Course",
      completeHint: "သင်္ကေတ ၅ ခုလုံး နားထောင်ပြီးရင် Next Course ကို သွားနိုင်ပါပြီ",
      footer: "ပျော်ရွှင်စွာ သင်ယူကြမယ် · Phoe Wa Lone"
    },
    en: {
      pageTitle: "Level 1 · Course 1 | Phoe Wa Lone",
      nav: ["Home", "About Us", "Courses", "Curriculum"],
      back: "← Back to courses",
      label: "⭐ Level 1 · Course 1",
      title: "Let’s Learn Five<br>Writing Signs!",
      intro: "Listen, repeat, and discover how these five Burmese signs change the sound of a word.",
      start: "▶ Start learning",
      chapter: "MEET THE SIGNS",
      sectionTitle: "Look, listen and repeat",
      sectionIntro: "Learn each writing sign by listening carefully and repeating its sound.",
      lessonTip: "These signs join a consonant. Press each speaker and repeat three times.",
      cardTitles: ["ရေးချ", "သ၀ေထိုး", "လုံးကြီးတင်", "လုံးကြီးတင်ဆံခတ်", "၀စ္စနှစ်လုံးပေါက်"],
      cardDescriptions: [
        "Written after a letter to create the long “ah” sound.",
        "Written before a letter to create the “ay” sound.",
        "Written above a letter to create the short “i” sound.",
        "Written above a letter to create the long “ee” sound.",
        "Written after a letter to change the way its sound ends."
      ],
      listen: "Listen",
      encouragementTitle: "Great job!",
      encouragementText: "Tap a sound button and repeat the sound together.",
      audioMissing: "This audio is not available yet. Add the matching MP3 file to the audio folder.",
      completeTitle: "Amazing! Lesson complete 🎉",
      completeText: "You have learned all five signs. Try them once more for extra practice!",
      completeButton: "Next Course",
      completedButton: "Next Course",
      completeHint: "Listen to all five signs to unlock the next course",
      footer: "Let’s enjoy learning · Phoe Wa Lone"
    }
  };

  window.applyLanguage = function (language) {
    currentLanguage = language;
    const text = translations[language];
    if (!text) return;
    const cards = document.querySelectorAll(".sign-card");

    document.documentElement.lang = language;
    document.title = text.pageTitle;
    document.querySelectorAll(".main-nav a, .course-nav-links a:not(.btn-mm-pill)").forEach((link, index) => {
      if (text.nav[index]) link.textContent = text.nav[index];
    });
    
    if (document.querySelector(".back-link")) document.querySelector(".back-link").textContent = text.back;
    if (document.querySelector(".lesson-label")) document.querySelector(".lesson-label").innerHTML = text.label;
    if (document.querySelector("#lesson-title")) document.querySelector("#lesson-title").innerHTML = text.title;
    if (document.querySelector(".hero-copy > p")) document.querySelector(".hero-copy > p").textContent = text.intro;
    if (startButton) startButton.textContent = text.start;
    if (document.querySelector(".eyebrow")) document.querySelector(".eyebrow").textContent = text.chapter;
    if (document.querySelector("#signs-title")) document.querySelector("#signs-title").textContent = text.sectionTitle;
    if (document.querySelector(".section-heading > div > p")) document.querySelector(".section-heading > div > p").textContent = text.sectionIntro;
    if (document.querySelector("#lessonTip p")) document.querySelector("#lessonTip p").textContent = text.lessonTip;
    
    cards.forEach((card, index) => {
      if (text.cardTitles[index]) card.querySelector("h3").textContent = text.cardTitles[index];
      if (text.cardDescriptions[index]) card.querySelector("p").textContent = text.cardDescriptions[index];
      const audioButton = card.querySelector(".audio-button");
      if (audioButton) {
        const icon = audioButton.classList.contains("playing") ? "⏸" : "🔊";
        audioButton.innerHTML = `<span>${icon}</span> ${text.listen}`;
      }
    });

    if (encouragement) {
      if (learnedSigns.size === audioButtons.length) {
        encouragement.querySelector("strong").textContent = text.completeTitle;
        encouragement.querySelector("p").textContent = text.completeText;
      } else {
        encouragement.querySelector("strong").textContent = text.encouragementTitle;
        encouragement.querySelector("p").textContent = text.encouragementText;
      }
    }

    if (document.querySelector("footer")) document.querySelector("footer").textContent = text.footer;
    if (completeButtonText) {
      completeButtonText.textContent = completeButton.classList.contains("completed")
        ? text.completedButton
        : text.completeButton;
    }
    if (completeHint) completeHint.textContent = text.completeHint;
  };

  window.applyLanguage(currentLanguage);

  if (completeButton) {
    completeButton.addEventListener("click", () => {
      if (learnedSigns.size === audioButtons.length) {
        window.location.href = "l1c2.html";
      }
    });
  }

  if (startButton) {
    startButton.addEventListener("click", () => {
      lessonCards.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  audioButtons.forEach((button) => {
    button.addEventListener("click", () => playLessonAudio(button));
  });

  function playLessonAudio(button) {
    const audioPath = button.dataset.audio;
    const card = button.closest(".sign-card");
    const sign = card.dataset.sign;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
      audioButtons.forEach((item) => {
        item.classList.remove("playing");
        item.querySelector("span").textContent = "🔊";
      });
    }

    currentAudio = new Audio(audioPath);
    button.classList.add("playing");
    button.querySelector("span").textContent = "⏸";

    currentAudio
      .play()
      .then(() => {
        markAsLearned(card, sign);
      })
      .catch(() => {
        markAsLearned(card, sign);
        button.classList.remove("playing");
        button.querySelector("span").textContent = "🔊";
        encouragement.querySelector("p").textContent =
          translations[currentLanguage].audioMissing;
      });

    currentAudio.addEventListener("ended", () => {
      button.classList.remove("playing");
      button.querySelector("span").textContent = "🔊";
      currentAudio = null;
    });
  }

  function markAsLearned(card, sign) {
    learnedSigns.add(sign);
    card.classList.add("learned");
    if (learnedSigns.size === audioButtons.length) {
      encouragement.querySelector("strong").textContent =
        translations[currentLanguage].completeTitle;
      encouragement.querySelector("p").textContent =
        translations[currentLanguage].completeText;
      completeButton.disabled = false;
      completeButton.classList.add("completed");
      completeButton.querySelector("span:first-child").textContent = "⭐";
      completeHint.hidden = true;
    }
  }
}

/* ==========================================================================
   COURSE 2
   ========================================================================== */
function initCourseTwo() {
  const audioButtons = [...document.querySelectorAll(".audio-button")];
  const finishButton = document.querySelector("#finish-button");
  const statusText = document.querySelector("#progress-label");
  const completed = new Set();
  let currentAudio = null;
  let currentLanguage = localStorage.getItem("lessonLanguage") || "my";

  const translations = {
    my: {
      pageTitle: "Level 1 · Course 2 | Phoe Wa Lone",
      nav: ["ပင်မစာမျက်နှာ", "အကြောင်းအရာ", "သင်ခန်းစာများ", "မာတိကာ"],
      back: "← သင်ခန်းစာများသို့ ပြန်သွားမည်",
      heroPill: "🌈 Level 1 · Course 2",
      heroTitle: "မောက်ချ ကို လေ့လာကြမယ်!",
      heroDesc: "<strong>ါ</strong> ကို ဗျည်းနဲ့ ဘယ်လိုပေါင်းစပ်လဲ၊ စာလုံးအသစ်တွေကို လေ့လာပြီး အသံထွက်ဖတ်ကြည့်ရအောင်။",
      sectionNav: ["၁။ လေ့လာမယ်", "၂။ လေ့ကျင့်မယ်", "၃။ ဝေါဟာရ", "၄။ ဖတ်ကြည့်မယ်"],
      s1Sub: "လေ့လာမယ်",
      s1Title: "မောက်ချ နဲ့ သူ့ရဲ့ မိတ်ဆွေ ဗျည်းများ",
      revLabel: "Course 1 မှ အမြန်ပြန်နွေးရန်",
      revDesc: "<strong>ရေးချ</strong> ကို ဗျည်းရဲ့ ညာဘက်မှာ ရေးပြီး “အာ” အသံ ထွက်ပါတယ်။",
      revListen: "ရေးချ အသံထွက် နားထောင်မယ်",
      mainSignDesc: "<strong>မောက်ချ</strong> ကို ဗျည်းရဲ့ ညာဘက်မှာ ရေးပြီး “အာ” အသံ ထွက်ပါတယ်။ အချို့ သီးသန့် ဗျည်းများအတွက် အပေါ်မြင့်မြင့် ရေးဆွဲရပါတယ်။",
      mainSignListen: "မောက်ချ အသံထွက် နားထောင်မယ်",
      tip: "💡 မောက်ချ နဲ့ တွဲသုံးရမယ့် ဗျည်း ၆ လုံးကို မှတ်ထားပါ- ",
      cmp1Title: "ရေးချ",
      cmp1Desc: "ဗျည်းအများစုနဲ့ ယှဉ်တွဲသုံးပါတယ်။",
      cmpSame: "အသံထွက်တူသည်",
      cmp2Title: "မောက်ချ",
      cmp2Desc: "ခ၊ ဂ၊ င၊ ဒ၊ ပ၊ ဝ တို့နှင့် သုံးပါတယ်။",
      s2Sub: "လေ့ကျင့်မယ်",
      s2Title: "အသံနားထောင်ပြီး စာလုံးအစုအဝေးများကို လိုက်ဆိုပါ",
      listenBtn: "နားထောင်မယ်",
      s3Sub: "ဝေါဟာရ",
      s3Title: "ဝေါဟာရ အသစ် ၅ ခု",
      vocab: ["ဆရာမ", "ဝါး", "ငါး", "ရထား", "နဂါး"],
      playBtn: "ဖွင့်မည်",
      s4Sub: "ဖတ်ကြည့်မယ်",
      s4Title: "ဇူဇူးငှက်ကလောင်လေးနဲ့ လိုက်ဖတ်ကြည့်ကြမယ်",
      card1Title: "ညအခါ",
      card2Title: "အစားအစာ",
      finishTitle: "အရမ်းတော်တာပဲ!",
      finishHint: "ခလုတ်ပွင့်ရန် အသံဖိုင်အားလုံးကို နားထောင်ပါ။",
      finishHintDone: "အသံဖိုင်များအားလုံး နားထောင်ပြီးပါပြီ — Course 2 ကို ပြီးမြောက်နိုင်ပါပြီ!",
      finishBtn: "သင်ခန်းစာ ပြီးမြောက်မည်",
      footer: "ပျော်ရွှင်စွာ သင်ယူကြမယ် · Phoe Wa Lone"
    },
    en: {
      pageTitle: "Level 1 · Course 2 | Phoe Wa Lone",
      nav: ["Home", "About Us", "Courses", "Curriculum"],
      back: "← Back to Courses",
      heroPill: "🌈 Level 1 · Course 2",
      heroTitle: "Meet မောက်ချ!",
      heroDesc: "Learn how <strong>ါ</strong> joins letters, discover new words, and read aloud.",
      sectionNav: ["1. Learn", "2. Practice", "3. Vocabulary", "4. Reading"],
      s1Sub: "Learn",
      s1Title: "မောက်ချ and its letter friends",
      revLabel: "Quick revision from Course 1",
      revDesc: "<strong>Yey Cha</strong> is written on the right side of a consonant. It gives the long “ah” sound.",
      revListen: "Listen to ရေးချ revision",
      mainSignDesc: "<strong>မောက်ချ</strong> sits on the right and makes the same long “ah” sound. Its top is taller because it is used with a special group of consonants.",
      mainSignListen: "Listen to မောက်ချ",
      tip: "💡 Remember these six မောက်ချ friends: ",
      cmp1Title: "ရေးချ",
      cmp1Desc: "Use with most consonants.",
      cmpSame: "Same sound",
      cmp2Title: "မောက်ချ",
      cmp2Desc: "Use with ခ၊ ဂ၊ င၊ ဒ၊ ပ၊ ဝ.",
      s2Sub: "Practice",
      s2Title: "Listen and say each word family",
      listenBtn: "Listen",
      s3Sub: "Vocabulary",
      s3Title: "Five new words",
      vocab: ["Teacher", "Bamboo", "Fish", "Train", "Dragon"],
      playBtn: "Play",
      s4Sub: "Reading",
      s4Title: "Read along with the friendly owl",
      card1Title: "Night Time",
      card2Title: "Food",
      finishTitle: "Wonderful work!",
      finishHint: "Listen to every audio item to unlock the button.",
      finishHintDone: "All sounds explored — you can complete Course 2!",
      finishBtn: "Complete lesson",
      footer: "Let’s enjoy learning · Phoe Wa Lone"
    }
  };

  window.applyLanguage = function (language) {
    currentLanguage = language;
    const text = translations[language];
    if (!text) return;

    document.documentElement.lang = language;
    document.title = text.pageTitle;

    // Update Nav links
    document.querySelectorAll(".course-nav-links a:not(.btn-mm-pill), .main-nav a").forEach((link, idx) => {
      if (text.nav[idx]) link.textContent = text.nav[idx];
    });

    if (document.querySelector(".back-link")) document.querySelector(".back-link").textContent = text.back;
    if (document.querySelector(".level-pill")) document.querySelector(".level-pill").textContent = text.heroPill;
    if (document.querySelector("#lesson-title")) document.querySelector("#lesson-title").innerHTML = text.heroTitle;
    if (document.querySelector(".course-hero p")) document.querySelector(".course-hero p").innerHTML = text.heroDesc;

    document.querySelectorAll(".lesson-nav a").forEach((a, i) => {
      if (text.sectionNav[i]) a.textContent = text.sectionNav[i];
    });

    // Section 1
    const s1 = document.querySelector("#learn");
    if (s1) {
      if (s1.querySelector(".section-heading p")) s1.querySelector(".section-heading p").textContent = text.s1Sub;
      if (s1.querySelector(".section-heading h2")) s1.querySelector(".section-heading h2").textContent = text.s1Title;
      if (s1.querySelector(".revision-label")) s1.querySelector(".revision-label").textContent = text.revLabel;
      if (s1.querySelector(".revision-banner p")) s1.querySelector(".revision-banner p").innerHTML = text.revDesc;
      if (s1.querySelector(".revision-audio .audio-label")) s1.querySelector(".revision-audio .audio-label").textContent = text.revListen;
      if (s1.querySelector(".main-sign p")) s1.querySelector(".main-sign p").innerHTML = text.mainSignDesc;
      if (s1.querySelector(".main-sign .audio-label")) s1.querySelector(".main-sign .audio-label").textContent = text.mainSignListen;
      
      const tipElement = s1.querySelector(".tip");
      if (tipElement) {
        tipElement.childNodes[0].nodeValue = text.tip;
      }
      
      const articles = s1.querySelectorAll(".sign-comparison article");
      if (articles[0]) {
        if (articles[0].querySelector("h3")) articles[0].querySelector("h3").textContent = text.cmp1Title;
        if (articles[0].querySelector("p")) articles[0].querySelector("p").textContent = text.cmp1Desc;
      }
      if (articles[1]) {
        if (articles[1].querySelector("h3")) articles[1].querySelector("h3").textContent = text.cmp2Title;
        if (articles[1].querySelector("p")) articles[1].querySelector("p").textContent = text.cmp2Desc;
      }
      if (s1.querySelector(".same-sound span")) s1.querySelector(".same-sound span").textContent = text.cmpSame;
    }

    // Section 2
    const s2 = document.querySelector("#practice");
    if (s2) {
      if (s2.querySelector(".section-heading p")) s2.querySelector(".section-heading p").textContent = text.s2Sub;
      if (s2.querySelector(".section-heading h2")) s2.querySelector(".section-heading h2").textContent = text.s2Title;
      s2.querySelectorAll(".practice-row .audio-button span:last-child").forEach(el => el.textContent = text.listenBtn);
    }

    // Section 3
    const s3 = document.querySelector("#vocabulary");
    if (s3) {
      if (s3.querySelector(".section-heading p")) s3.querySelector(".section-heading p").textContent = text.s3Sub;
      if (s3.querySelector(".section-heading h2")) s3.querySelector(".section-heading h2").textContent = text.s3Title;
      s3.querySelectorAll(".word-card").forEach((card, idx) => {
        if (text.vocab[idx]) card.querySelector("p").textContent = text.vocab[idx];
        const btnText = card.querySelector(".mini-audio span:last-child");
        if (btnText) btnText.textContent = text.playBtn;
      });
    }

    // Section 4
    const s4 = document.querySelector("#reading");
    if (s4) {
      if (s4.querySelector(".section-heading p")) s4.querySelector(".section-heading p").textContent = text.s4Sub;
      if (s4.querySelector(".section-heading h2")) s4.querySelector(".section-heading h2").textContent = text.s4Title;
      if (s4.querySelector(".night-card h3")) s4.querySelector(".night-card h3").textContent = text.card1Title;
      if (s4.querySelector(".food-card h3")) s4.querySelector(".food-card h3").textContent = text.card2Title;
      s4.querySelectorAll(".passage-card .audio-button span:last-child").forEach(el => el.textContent = text.listenBtn);
    }

    if (document.querySelector(".finish-card h2")) document.querySelector(".finish-card h2").textContent = text.finishTitle;
    const finishHint = document.querySelector("#finishHint");
    if (finishHint) {
      finishHint.textContent = completed.size === audioButtons.length ? text.finishHintDone : text.finishHint;
    }
    const finishBtnText = document.querySelector("#finish-button .complete-button-text");
    if (finishBtnText) finishBtnText.textContent = text.finishBtn;
    if (document.querySelector("footer")) document.querySelector("footer").textContent = text.footer;
  };

  window.applyLanguage(currentLanguage);

  audioButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (currentAudio) currentAudio.pause();
      audioButtons.forEach((item) => item.classList.remove("playing"));

      completed.add(index);
      button
        .closest(
          ".revision-banner, .main-sign, .practice-row, .word-card, .passage-card"
        )
        ?.classList.add("learned");
      const percentage = Math.round(
        (completed.size / audioButtons.length) * 100
      );
      if (statusText) statusText.textContent = `${percentage}% complete`;
      const progressFill = document.querySelector("#progress-fill");
      if (progressFill) progressFill.style.width = `${percentage}%`;

      if (completed.size === audioButtons.length) {
        finishButton.disabled = false;
        finishButton.classList.add("completed");
        document.querySelector("#finishHint").textContent =
          translations[currentLanguage].finishHintDone;
      }

      currentAudio = new Audio(button.dataset.audio);
      button.classList.add("playing");
      const finish = () => {
        button.classList.remove("playing");
        if (
          completed.size === audioButtons.length &&
          !document
            .querySelector(".finish-card")
            .classList.contains("celebrating")
        ) {
          finishButton.disabled = false;
          finishButton.classList.add("completed");
          finishButton.innerHTML =
            `<span aria-hidden="true">⭐</span><span class="complete-button-text">${translations[currentLanguage].finishBtn}</span><span aria-hidden="true">✓</span>`;
          document.querySelector("#finishHint").textContent =
            translations[currentLanguage].finishHintDone;
        }
      };

      currentAudio
        .play()
        .then(() =>
          currentAudio.addEventListener("ended", finish, { once: true })
        )
        .catch(finish);
    });
  });

  if (finishButton) {
    finishButton.addEventListener("click", () => {
      if (!finishButton.disabled) {
        const nextPage = finishButton.dataset.next || "l1c3.html";
        window.location.assign(new URL(nextPage, window.location.href).href);
      }
    });
  }
}

/* ==========================================================================
   COURSE 3
   ========================================================================== */
function initCourseThree() {
  const startButton = document.querySelector("#startLesson");
  const lesson = document.querySelector("#lessonCards");
  const audioButtons = [
    ...document.querySelectorAll(".grammar-card .audio-button"),
  ];
  const progressLabel = document.querySelector("#c3ProgressLabel");
  const progressFill = document.querySelector("#c3ProgressFill");
  const completeButton = document.querySelector("#completeCourse3");
  const completeHint = document.querySelector("#c3CompleteHint");
  const completed = new Set();
  let currentAudio = null;
  let currentLanguage = localStorage.getItem("lessonLanguage") || "my";

  const translations = {
    my: {
      pageTitle: "Level 1 · Course 3 | Phoe Wa Lone",
      nav: ["ပင်မစာမျက်နှာ", "အကြောင်းအရာ", "သင်ခန်းစာများ", "မာတိကာ"],
      back: "← သင်ခန်းစာများသို့ ပြန်သွားမည်",
      label: "⭐ Level 1 · Course 3",
      title: "အသုံးများသော သင်္ကေတ ၄ ခုကို လေ့လာရအောင်!",
      intro: "ဒီအထူးသင်္ကေတလေးတွေက ဝါကျထဲမှာ စာလုံးတွေကို ဘယ်လို ဆက်စပ်ပေးလဲဆိုတာ ကြည့်ပါ၊ နားထောင်ပါ၊ လေ့လာပါ။",
      start: "▶ စတင်သင်ယူမယ်",
      eyebrow: "သင်္ကေတများကို လေ့လာမယ်",
      secTitle: "ကြည့်ပါ၊ နားထောင်ပါ၊ လေ့လာပါ",
      secIntro: "ဥပမာတစ်ခုစီကို အသံထွက်ဖတ်ပြီး ဝါကျအသံထွက်ကို နားထောင်ရန် 'နားထောင်မယ်' ခလုတ်ကို နှိပ်ပါ။",
      tip: "ဒီသင်္ကေတ ၄ ခုက ပိုင်ဆိုင်မှု၊ ညွှန်ပြမှု၊ အပြုအမူဆက်စပ်မှု ဒါမှမဟုတ် နေရာနဲ့ အချိန်ကို ဖော်ပြပေးပါတယ်။",
      cardDescs: [
        "ပိုင်ဆိုင်မှုကို ဖော်ပြသည်။",
        "“ဒီအရာ” လို့ အနီးရှိအရာကို ညွှန်ပြသည်။",
        "လုပ်ဆောင်ချက်များကို ဆက်စပ်ပေးပြီး အကြောင်းနဲ့ အကျိုးကို ဖော်ပြသည်။",
        "“မှာ/၌” ဟု နေရာ သို့မဟုတ် အချိန်ကို ဖော်ပြသည်။"
      ],
      exMeaning: ["မောင်မောင်၏ စာအုပ်။", "ဒီစာအုပ်ကို ဖတ်ပါ။", "စာဖတ်ပြီး စာရေးသည်။", "ကျောင်းမှာ စာသင်သည်။"],
      listen: "နားထောင်မယ်",
      cheerTitle: "၄ ခုလုံး နားထောင်ကြည့်ပါ!",
      cheerDesc: "အသံထွက်ကို လေ့လာပြီးရင် ကတ်လေးတွေ အပြာရောင် ပြောင်းသွားပါလိမ့်မယ်။",
      completeBtn: "Course 3 ပြီးမြောက်မည်",
      completeHint: "ခလုတ်ဖွင့်ရန် သင်္ကေတ ၄ ခုလုံးကို နားထောင်ပါ။",
      completeHintDone: "သင်္ကေတ ၄ ခုလုံး လေ့လာပြီးပါပြီ — အရမ်းတော်တာပဲ!",
      footer: "ပျော်ရွှင်စွာ သင်ယူကြမယ် · Phoe Wa Lone"
    },
    en: {
      pageTitle: "Level 1 · Course 3 | Phoe Wa Lone",
      nav: ["Home", "About Us", "Courses", "Curriculum"],
      back: "← Back to Courses",
      label: "⭐ Level 1 · Course 3",
      title: "Meet Four Special Signs!",
      intro: "Look, listen, and discover how these helpful Burmese signs connect ideas in a sentence.",
      start: "▶ Start learning",
      eyebrow: "MEET THE SIGNS",
      secTitle: "Look, listen and learn",
      secIntro: "Read each example aloud and press Listen to hear the sentence.",
      tip: "These four signs help show belonging, point to something, connect actions, or tell a place and time.",
      cardDescs: [
        "Shows belonging or possession.",
        "Means “this” and points to something nearby.",
        "Connects actions or shows a reason and result.",
        "Means “at” or “in” and tells us a place or time."
      ],
      exMeaning: ["Maung Maung’s book.", "Read this book.", "Reads and writes.", "Studies at school."],
      listen: "Listen",
      cheerTitle: "Listen to all four!",
      cheerDesc: "Each card turns blue when you have explored its sound.",
      completeBtn: "Complete Course 3",
      completeHint: "Listen to all four signs to unlock this button",
      completeHintDone: "All four signs explored — wonderful work!",
      footer: "Let’s enjoy learning · Phoe Wa Lone"
    }
  };

  window.applyLanguage = function(language) {
    currentLanguage = language;
    const text = translations[language];
    if (!text) return;

    document.documentElement.lang = language;
    document.title = text.pageTitle;
    document.querySelectorAll(".main-nav a, .course-nav-links a:not(.btn-mm-pill)").forEach((link, idx) => {
      if (text.nav[idx]) link.textContent = text.nav[idx];
    });

    if (document.querySelector(".back-link")) document.querySelector(".back-link").textContent = text.back;
    if (document.querySelector(".lesson-label")) document.querySelector(".lesson-label").textContent = text.label;
    if (document.querySelector(".hero-copy h1")) document.querySelector(".hero-copy h1").textContent = text.title;
    if (document.querySelector(".hero-copy p")) document.querySelector(".hero-copy p").textContent = text.intro;
    if (startButton) startButton.textContent = text.start;

    if (document.querySelector(".eyebrow")) document.querySelector(".eyebrow").textContent = text.eyebrow;
    if (document.querySelector(".section-heading h2")) document.querySelector(".section-heading h2").textContent = text.secTitle;
    if (document.querySelector(".section-heading p")) document.querySelector(".section-heading p").textContent = text.secIntro;
    if (document.querySelector(".lesson-tip p")) document.querySelector(".lesson-tip p").textContent = text.tip;

    document.querySelectorAll(".grammar-card").forEach((card, idx) => {
      if (text.cardDescs[idx]) card.querySelector(".grammar-copy > p").textContent = text.cardDescs[idx];
      if (text.exMeaning[idx]) card.querySelector(".grammar-example span").textContent = text.exMeaning[idx];
      const btnText = card.querySelector(".audio-button span:last-child");
      if (btnText) btnText.textContent = text.listen;
    });

    if (document.querySelector(".c3-cheer h3")) document.querySelector(".c3-cheer h3").textContent = text.cheerTitle;
    if (document.querySelector(".c3-cheer p")) document.querySelector(".c3-cheer p").textContent = text.cheerDesc;
    
    if (completeHint) {
      completeHint.textContent = completed.size === audioButtons.length ? text.completeHintDone : text.completeHint;
    }
    const completeBtnText = document.querySelector("#completeCourse3 .complete-button-text");
    if (completeBtnText) completeBtnText.textContent = text.completeBtn;
    if (document.querySelector("footer")) document.querySelector("footer").textContent = text.footer;
  };

  window.applyLanguage(currentLanguage);

  if (startButton) {
    startButton.addEventListener("click", () =>
      lesson.scrollIntoView({ behavior: "smooth" })
    );
  }

  audioButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (currentAudio) currentAudio.pause();
      audioButtons.forEach((item) => item.classList.remove("playing"));
      button.classList.add("playing");
      button.closest(".grammar-card").classList.add("learned");
      completed.add(index);

      const percentage = Math.round(
        (completed.size / audioButtons.length) * 100
      );
      if (progressLabel) progressLabel.textContent = `${percentage}% complete`;
      if (progressFill) progressFill.style.width = `${percentage}%`;

      if (completed.size === audioButtons.length) {
        completeButton.disabled = false;
        completeButton.classList.add("completed");
        completeButton.innerHTML =
          `<span aria-hidden="true">⭐</span><span class="complete-button-text">${translations[currentLanguage].completeBtn}</span><span aria-hidden="true">✓</span>`;
        completeHint.textContent = translations[currentLanguage].completeHintDone;
      }

      currentAudio = new Audio(button.dataset.audio);
      const reset = () => button.classList.remove("playing");
      currentAudio
        .play()
        .then(() =>
          currentAudio.addEventListener("ended", reset, { once: true })
        )
        .catch(reset);
    });
  });

  if (completeButton) {
    completeButton.addEventListener("click", () => {
      if (!completeButton.disabled) {
        window.location.href = "l1c4.html";
      }
    });
  }
}

/* ==========================================================================
   COURSE 4
   ========================================================================== */
function initCourseFour() {
  const audioButtons = [...document.querySelectorAll(".audio-button")];
  const progressLabel = document.querySelector("#progress-label");
  const progressFill = document.querySelector("#progress-fill");
  const completeButton = document.querySelector("#finish-button");
  const completeHint = document.querySelector("#finishHint");
  const completed = new Set();
  let currentAudio = null;
  let currentLanguage = localStorage.getItem("lessonLanguage") || "my";

  const translations = {
    my: {
      pageTitle: "Level 1 · Course 4 | Phoe Wa Lone",
      nav: ["ပင်မစာမျက်နှာ", "အကြောင်းအရာ", "သင်ခန်းစာများ", "မာတိကာ"],
      back: "← သင်ခန်းစာများသို့ ပြန်သွားမည်",
      heroPill: "🌟 Level 1 · Course 4",
      heroTitle: "ိ · ီ · း ကို လေ့ကျင့်ကြမယ်!",
      heroDesc: "ယခင်သင်ခဲ့သော သင်္ကေတ ၃ ခုကို ပြန်နွေးပါ၊ စာလုံးအစုအဝေးများ ဖန်တီးပါ၊ ဝေါဟာရအသစ်များ လေ့လာပြီး အသံထွက်ဖတ်ကြည့်ပါ။",
      sectionNav: ["၁။ ပြန်နွေးမယ်", "၂။ လေ့ကျင့်မယ်", "၃။ ဝေါဟာရ", "၄။ ဖတ်ကြည့်မယ်"],
      s1Sub: "ပြန်နွေးမယ်",
      s1Title: "ိ · ီ · း ကို မှတ်မိကြသေးလား",
      signTitles: ["လုံးကြီးတင်", "လုံးကြီးတင်ဆံခတ်", "၀စ္စနှစ်လုံးပေါက်"],
      signDescs: ["အသံတို “အိ”", "အသံရှည် “အီ”", "အဆုံးသတ်အသံ ပြောင်းလဲပေးသည်"],
      s2Sub: "လေ့ကျင့်မယ်",
      s2Title: "အသံနားထောင်ပြီး စာလုံးအစုအဝေးများကို လိုက်ဆိုပါ",
      listenBtn: "နားထောင်မယ်",
      s3Sub: "ဝေါဟာရ",
      s3Title: "ဝေါဟာရ အသစ် ၅ ခု",
      vocab: ["နာရီ", "ထီး", "မိဘ", "ညီမ", "မထိရ"],
      playBtn: "ဖွင့်မည်",
      s4Sub: "ဖတ်ကြည့်မယ်",
      s4Title: "ပျားလေးနဲ့အတူ လိုက်ဖတ်ကြည့်ရအောင်",
      card1Title: "အတူဖတ်ကြစို့",
      card2Title: "ခရီးတစ်ခု",
      finishTitle: "အရမ်းတော်တာပဲ!",
      finishHint: "ခလုတ်ပွင့်ရန် အသံဖိုင်အားလုံးကို နားထောင်ပါ။",
      finishHintDone: "အသံဖိုင်များအားလုံး နားထောင်ပြီးပါပြီ — Course 4 အဆင်သင့်ဖြစ်ပါပြီ!",
      finishBtn: "Course 4 ပြီးမြောက်မည်",
      footer: "ပျော်ရွှင်စွာ သင်ယူကြမယ် · Phoe Wa Lone"
    },
    en: {
      pageTitle: "Level 1 · Course 4 | Phoe Wa Lone",
      nav: ["Home", "About Us", "Courses", "Curriculum"],
      back: "← Back to Courses",
      heroPill: "🌟 Level 1 · Course 4",
      heroTitle: "Practice ိ · ီ · း!",
      heroDesc: "Review three familiar signs, build word families, learn new words, and read aloud.",
      sectionNav: ["1. Review", "2. Practice", "3. Vocabulary", "4. Reading"],
      s1Sub: "Remind",
      s1Title: "Let’s remember ိ · ီ · း",
      signTitles: ["Lone Gyi Tin", "Lone Gyi Tin San Khat", "Wut Sa Hnit Lone Pauk"],
      signDescs: ["Short “i” sound", "Long “ee” sound", "Changes the ending sound"],
      s2Sub: "Practice",
      s2Title: "Listen and say each word family",
      listenBtn: "Listen",
      s3Sub: "Vocabulary",
      s3Title: "Five new words",
      vocab: ["Clock", "Umbrella", "Parents", "Sister", "Don't touch"],
      playBtn: "Play",
      s4Sub: "Reading",
      s4Title: "Read along with our friendly bee",
      card1Title: "Read Together",
      card2Title: "A Journey",
      finishTitle: "Wonderful work!",
      finishHint: "Listen to every audio item to unlock the button.",
      finishHintDone: "All sounds explored — Course 4 is ready!",
      finishBtn: "Complete Course 4",
      footer: "Let’s enjoy learning · Phoe Wa Lone"
    }
  };

  window.applyLanguage = function(language) {
    currentLanguage = language;
    const text = translations[language];
    if (!text) return;

    document.documentElement.lang = language;
    document.title = text.pageTitle;
    document.querySelectorAll(".course-nav-links a:not(.btn-mm-pill), .main-nav a").forEach((link, idx) => {
      if (text.nav[idx]) link.textContent = text.nav[idx];
    });

    if (document.querySelector(".back-link")) document.querySelector(".back-link").textContent = text.back;
    if (document.querySelector(".level-pill")) document.querySelector(".level-pill").textContent = text.heroPill;
    if (document.querySelector(".course-hero h1")) document.querySelector(".course-hero h1").textContent = text.heroTitle;
    if (document.querySelector(".course-hero p")) document.querySelector(".course-hero p").textContent = text.heroDesc;

    document.querySelectorAll(".lesson-nav a").forEach((a, i) => {
      if (text.sectionNav[i]) a.textContent = text.sectionNav[i];
    });

    // Section 1
    const s1 = document.querySelector("#review");
    if (s1) {
      if (s1.querySelector(".section-heading p")) s1.querySelector(".section-heading p").textContent = text.s1Sub;
      if (s1.querySelector(".section-heading h2")) s1.querySelector(".section-heading h2").textContent = text.s1Title;
      s1.querySelectorAll(".review-sign").forEach((card, idx) => {
        if (text.signTitles[idx]) card.querySelector("h3").textContent = text.signTitles[idx];
        if (text.signDescs[idx]) card.querySelector("p").textContent = text.signDescs[idx];
        const btnText = card.querySelector(".audio-button");
        if (btnText) btnText.innerHTML = `<span>🔊</span> ${text.listenBtn}`;
      });
    }

    // Section 2
    const s2 = document.querySelector("#practice");
    if (s2) {
      if (s2.querySelector(".section-heading p")) s2.querySelector(".section-heading p").textContent = text.s2Sub;
      if (s2.querySelector(".section-heading h2")) s2.querySelector(".section-heading h2").textContent = text.s2Title;
      s2.querySelectorAll(".practice-row .audio-button span:last-child").forEach(el => el.textContent = text.listenBtn);
    }

    // Section 3
    const s3 = document.querySelector("#vocabulary");
    if (s3) {
      if (s3.querySelector(".section-heading p")) s3.querySelector(".section-heading p").textContent = text.s3Sub;
      if (s3.querySelector(".section-heading h2")) s3.querySelector(".section-heading h2").textContent = text.s3Title;
      s3.querySelectorAll(".word-card").forEach((card, idx) => {
        if (text.vocab[idx]) card.querySelector("p").textContent = text.vocab[idx];
        const btn = card.querySelector(".mini-audio");
        if (btn) btn.innerHTML = `<span>🔊</span> ${text.playBtn}`;
      });
    }

    // Section 4
    const s4 = document.querySelector("#reading");
    if (s4) {
      if (s4.querySelector(".section-heading p")) s4.querySelector(".section-heading p").textContent = text.s4Sub;
      if (s4.querySelector(".section-heading h2")) s4.querySelector(".section-heading h2").textContent = text.s4Title;
      if (s4.querySelector(".night-card h3")) s4.querySelector(".night-card h3").textContent = text.card1Title;
      if (s4.querySelector(".food-card h3")) s4.querySelector(".food-card h3").textContent = text.card2Title;
      s4.querySelectorAll(".passage-card .audio-button").forEach(el => el.innerHTML = `<span>▶</span> ${text.listenBtn}`);
    }

    if (document.querySelector(".finish-card h2")) document.querySelector(".finish-card h2").textContent = text.finishTitle;
    if (completeHint) {
      completeHint.textContent = completed.size === audioButtons.length ? text.finishHintDone : text.finishHint;
    }
    if (completeButton) {
      completeButton.querySelector("span:nth-child(2)").textContent = text.finishBtn;
    }
    if (document.querySelector("footer")) document.querySelector("footer").textContent = text.footer;
  };

  window.applyLanguage(currentLanguage);

  audioButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (currentAudio) currentAudio.pause();
      audioButtons.forEach((item) => item.classList.remove("playing"));
      button.classList.add("playing");
      button
        .closest(".review-sign, .practice-row, .word-card, .passage-card")
        ?.classList.add("learned");
      completed.add(index);

      const percentage = Math.round(
        (completed.size / audioButtons.length) * 100
      );
      if (progressLabel) progressLabel.textContent = `${percentage}% complete`;
      if (progressFill) progressFill.style.width = `${percentage}%`;

      if (completed.size === audioButtons.length) {
        completeButton.disabled = false;
        completeButton.classList.add("completed");
        completeButton.innerHTML =
          `<span aria-hidden="true">⭐</span><span>${translations[currentLanguage].finishBtn}</span><span aria-hidden="true">✓</span>`;
        completeHint.textContent = translations[currentLanguage].finishHintDone;
      }

      currentAudio = new Audio(button.dataset.audio);
      const reset = () => button.classList.remove("playing");
      currentAudio
        .play()
        .then(() =>
          currentAudio.addEventListener("ended", reset, { once: true })
        )
        .catch(reset);
    });
  });

  if (completeButton) {
    completeButton.addEventListener("click", () => {
      if (!completeButton.disabled) {
        window.location.href = "l1c5.html";
      }
    });
  }
}

/* ==========================================================================
   COURSE 5
   ========================================================================== */
function initCourseFive() {
  const startButton = document.querySelector("#startLesson");
  const lesson = document.querySelector("#lessonCards");
  const audioButtons = [
    ...document.querySelectorAll(".sign-card .audio-button"),
  ];
  const progressLabel = document.querySelector("#c5ProgressLabel");
  const progressFill = document.querySelector("#c5ProgressFill");
  const completeButton = document.querySelector("#completeCourse5");
  const completeHint = document.querySelector("#c5CompleteHint");
  const completed = new Set();
  let currentAudio = null;
  let currentLanguage = localStorage.getItem("lessonLanguage") || "my";

  const translations = {
    my: {
      pageTitle: "Level 1 · Course 5 | Phoe Wa Lone",
      nav: ["ပင်မစာမျက်နှာ", "အကြောင်းအရာ", "သင်ခန်းစာများ", "မာတိကာ"],
      back: "← သင်ခန်းစာများသို့ ပြန်သွားမည်",
      label: "⭐ Level 1 · Course 5",
      title: "နောက်ထပ် သင်္ကေတ ၄ ခုကို လေ့လာကြမယ်!",
      intro: "ဒီသင်္ကေတ ၄ ခုက အသံအသစ်တွေကို ဘယ်လိုဖန်တီးပေးသလဲဆိုတာ နားထောင်ပါ၊ လိုက်ဆိုပါ၊ လေ့လာပါ။",
      start: "▶ စတင်သင်ယူမယ်",
      eyebrow: "သင်္ကေတများကို လေ့လာမယ်",
      secTitle: "ကြည့်ပါ၊ နားထောင်ပါ၊ လိုက်ဆိုပါ",
      secIntro: "အသံခလုတ်တစ်ခုစီကို နှိပ်ပြီး အသံထွက်ကို ၃ ကြိမ် လိုက်ဆိုပါ။",
      tip: "ဒီသင်္ကေတတွေဟာ ဗျည်းတွေနဲ့ ပေါင်းစပ်ပြီး ကွဲပြားတဲ့ သရသံနဲ့ အသံနိမ့်မြင့်တွေကို ဖန်တီးပေးပါတယ်။",
      cardTitles: ["တစ်ချောင်းငင်", "နှစ်ချောင်းငင်", "နောက်ပစ်", "အောက်မြစ်"],
      cardDescs: [
        "အသံတို “ဥ” အသံ ထွက်စေရန် ဗျည်းအောက်တွင် ရေးရသည်။",
        "အသံရှည် “ဦး” အသံ ထွက်စေရန် ဗျည်းအောက်တွင် ရေးရသည်။",
        "“အဲ” အသံ ထွက်စေရန် ဗျည်းနောက်တွင် ရေးရသည်။",
        "အသံနိမ့်မြင့် ပြောင်းလဲစေရန် ဗျည်းအောက်တွင် ရေးရသည်။"
      ],
      listen: "နားထောင်မယ်",
      cheerTitle: "ကြိုးစားထားနော်!",
      cheerDesc: "အသံထွက် နားထောင်ပြီးရင် ကတ်လေးတွေ အပြာရောင် ပြောင်းသွားပါလိမ့်မယ်။",
      completeBtn: "Course 5 ပြီးမြောက်မည်",
      completeDoneText: "Course 5 ပြီးမြောက်ပါပြီ! 🎉",
      completeHint: "ခလုတ်ဖွင့်ရန် သင်္ကေတ ၄ ခုလုံးကို နားထောင်ပါ",
      completeHintDone: "သင်္ကေတ ၄ ခုလုံး လေ့လာပြီးပါပြီ — အရမ်းတော်တာပဲ!",
      footer: "ပျော်ရွှင်စွာ သင်ယူကြမယ် · Phoe Wa Lone"
    },
    en: {
      pageTitle: "Level 1 · Course 5 | Phoe Wa Lone",
      nav: ["Home", "About Us", "Courses", "Curriculum"],
      back: "← Back to Courses",
      label: "⭐ Level 1 · Course 5",
      title: "Let’s Learn Four More Signs!",
      intro: "Listen, repeat, and learn how these four Burmese signs make new sounds.",
      start: "▶ Start learning",
      eyebrow: "MEET THE SIGNS",
      secTitle: "Look, listen and repeat",
      secIntro: "Press each speaker and repeat the sound three times.",
      tip: "These signs join consonants to make different vowel sounds and tones.",
      cardTitles: ["Ta Chaung Ngin", "Hnit Chaung Ngin", "Naut Pit", "Aut Myit"],
      cardDescs: [
        "Written below a consonant to make the short “u” sound.",
        "Written below a consonant to make the long “oo” sound.",
        "Written after a consonant to make the “ai” sound.",
        "Written below a consonant to change its tone."
      ],
      listen: "Listen",
      cheerTitle: "Keep going!",
      cheerDesc: "Each card turns blue after you press Listen.",
      completeBtn: "Complete Course 5",
      completeDoneText: "Course 5 completed! 🎉",
      completeHint: "Listen to all four signs to unlock this button",
      completeHintDone: "All four signs explored — excellent work!",
      footer: "Let’s enjoy learning · Phoe Wa Lone"
    }
  };

  window.applyLanguage = function(language) {
    currentLanguage = language;
    const text = translations[language];
    if (!text) return;

    document.documentElement.lang = language;
    document.title = text.pageTitle;
    document.querySelectorAll(".main-nav a, .course-nav-links a:not(.btn-mm-pill)").forEach((link, idx) => {
      if (text.nav[idx]) link.textContent = text.nav[idx];
    });

    if (document.querySelector(".back-link")) document.querySelector(".back-link").textContent = text.back;
    if (document.querySelector(".lesson-label")) document.querySelector(".lesson-label").textContent = text.label;
    if (document.querySelector(".hero-copy h1")) document.querySelector(".hero-copy h1").textContent = text.title;
    if (document.querySelector(".hero-copy p")) document.querySelector(".hero-copy p").textContent = text.intro;
    if (startButton) startButton.textContent = text.start;

    if (document.querySelector(".eyebrow")) document.querySelector(".eyebrow").textContent = text.eyebrow;
    if (document.querySelector(".section-heading h2")) document.querySelector(".section-heading h2").textContent = text.secTitle;
    if (document.querySelector(".section-heading p")) document.querySelector(".section-heading p").textContent = text.secIntro;
    if (document.querySelector(".lesson-tip p")) document.querySelector(".lesson-tip p").textContent = text.tip;

    document.querySelectorAll(".sign-card").forEach((card, idx) => {
      if (text.cardTitles[idx]) card.querySelector("h3").textContent = text.cardTitles[idx];
      if (text.cardDescs[idx]) card.querySelector("p").textContent = text.cardDescs[idx];
      const btn = card.querySelector(".audio-button");
      if (btn) btn.innerHTML = `<span>🔊</span> ${text.listen}`;
    });

    if (document.querySelector(".c5-cheer h3")) document.querySelector(".c5-cheer h3").textContent = text.cheerTitle;
    if (document.querySelector(".c5-cheer p")) document.querySelector(".c5-cheer p").textContent = text.cheerDesc;

    if (completeHint) {
      completeHint.textContent = completed.size === audioButtons.length ? text.completeHintDone : text.completeHint;
    }
    if (completeButton) {
      const btnSpan = completeButton.querySelector("span:nth-child(2)");
      if (btnSpan) btnSpan.textContent = text.completeBtn;
    }
    if (document.querySelector("footer")) document.querySelector("footer").textContent = text.footer;
  };

  window.applyLanguage(currentLanguage);

  if (startButton) {
    startButton.addEventListener("click", () =>
      lesson.scrollIntoView({ behavior: "smooth" })
    );
  }

  audioButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (currentAudio) currentAudio.pause();
      audioButtons.forEach((item) => item.classList.remove("playing"));
      button.classList.add("playing");
      button.closest(".sign-card").classList.add("learned");
      completed.add(index);

      const percentage = Math.round(
        (completed.size / audioButtons.length) * 100
      );
      if (progressLabel) progressLabel.textContent = `${percentage}% complete`;
      if (progressFill) progressFill.style.width = `${percentage}%`;

      if (completed.size === audioButtons.length) {
        completeButton.disabled = false;
        completeButton.classList.add("completed");
        completeButton.innerHTML =
          `<span aria-hidden="true">⭐</span><span>${translations[currentLanguage].completeBtn}</span><span aria-hidden="true">✓</span>`;
        completeHint.textContent = translations[currentLanguage].completeHintDone;
      }

      currentAudio = new Audio(button.dataset.audio);
      const reset = () => button.classList.remove("playing");
      currentAudio
        .play()
        .then(() =>
          currentAudio.addEventListener("ended", reset, { once: true })
        )
        .catch(reset);
    });
  });

  if (completeButton) {
    completeButton.addEventListener("click", () => {
      if (!completeButton.disabled) {
        completeButton.textContent = translations[currentLanguage].completeDoneText;
        window.location.href = "../level2/l2c1.html";
      }
    });
  }
}