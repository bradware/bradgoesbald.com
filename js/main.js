// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBhbOCKpKiEzNnYW29ps0iAQa5x6_6mN9E",
  authDomain: "bradgoesbald.firebaseapp.com",
  databaseURL: "https://bradgoesbald-default-rtdb.firebaseio.com",
  projectId: "bradgoesbald",
  storageBucket: "bradgoesbald.appspot.com",
  messagingSenderId: "692506818966",
  appId: "1:692506818966:web:b4e9efb47e1f9fed2e05b7",
  measurementId: "G-R4NMYXYDJH"
};

// Use compat version to match script tags in index.html
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
  const countdownEl = document.getElementById("countdown");
  const mainEl = document.querySelector("main");
  const eventDate = new Date("September 19, 2025 21:00:00 EDT").getTime();

  // Countdown
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = eventDate - now;

    if (diff <= 0) {
      if (countdownEl) countdownEl.style.display = "none";
      if (mainEl) {
        mainEl.style.justifyContent = "center";
        mainEl.style.minHeight = "calc(100vh - 120px)";
      }
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent    = String(days).padStart(2, '0');
    document.getElementById("hours").textContent   = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

  // Voting
  const poisonCountEl = document.getElementById("poison-count");
  const baldCountEl   = document.getElementById("bald-count");

  // Database references for each option
  const poisonRef = database.ref("votes/poison");
  const baldRef   = database.ref("votes/bald");

  // Helper to set count and fade it in the first time
  function setCount(el, value) {
    el.textContent = value;
    if (!el.classList.contains('visible')) {
      // trigger CSS fade-in on first load
      requestAnimationFrame(() => el.classList.add('visible'));
    }
  }

  // Load and stay synced in real time
  poisonRef.on("value", (snapshot) => {
    setCount(poisonCountEl, snapshot.exists() ? snapshot.val() : 0);
  });

  baldRef.on("value", (snapshot) => {
    setCount(baldCountEl, snapshot.exists() ? snapshot.val() : 0);
  });

  // Increment atomically on click
  document.querySelectorAll(".vote-column").forEach(col => {
    col.addEventListener("click", () => {
      const ref = col.dataset.option === "poison" ? poisonRef : baldRef;

      ref.transaction(current => (current || 0) + 1);

      // subtle pop animation when clicked
      col.classList.remove("voted");
      void col.offsetWidth; // force reflow to restart animation
      col.classList.add("voted");
    });
  });
});
