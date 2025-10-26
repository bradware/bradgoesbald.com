// Bald Brad Night™ — FINAL VOTE COUNT (No Firebase)
// Final counts (edit these if your final tallies change)
const FINAL_COUNTS = {
  poison: 824,
  bald: 1438
};

// Easing: easeOutQuad
function easeOutQuad(t) { return 1 - (1 - t) * (1 - t); }

// Count-up tween
function animateCount({ el, to, duration = 900, delay = 0, formatter = n => n.toLocaleString() }) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startTime = performance.now() + (reduced ? 0 : delay);
  const from = 0;
  const delta = to - from;

  // If reduced motion, jump to final immediately
  if (reduced || duration === 0) {
    el.textContent = formatter(to);
    el.classList.add("visible");
    return;
  }

  function frame(now) {
    if (now < startTime) { requestAnimationFrame(frame); return; }
    const t = Math.min(1, (now - startTime) / duration);
    const v = Math.round(from + delta * easeOutQuad(t));
    el.textContent = formatter(v);
    if (!el.classList.contains("visible")) el.classList.add("visible");
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function startReveal() {
  const poisonEl = document.getElementById("poison-count");
  const baldEl   = document.getElementById("bald-count");
  if (!poisonEl || !baldEl) return;

  // Reset to zero on load (in case HTML ships with some value)
  poisonEl.textContent = "0";
  baldEl.textContent   = "0";

  // Stagger them a bit for drama
  animateCount({ el: poisonEl, to: FINAL_COUNTS.poison, duration: 1000, delay: 0 });
  animateCount({ el: baldEl,   to: FINAL_COUNTS.bald,   duration: 1000, delay: 150 });
}

document.addEventListener("DOMContentLoaded", function () {
  // Remove any click behavior / cursor from old voting UI
  document.querySelectorAll(".vote-column").forEach(col => {
    col.style.cursor = "default";
    col.replaceWith(col.cloneNode(true)); // removes old listeners if any
  });

  const section = document.getElementById("vote-section");
  if (!section) { startReveal(); return; }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // If above the fold or reduced motion, start immediately
  const rect = section.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;

  if (inView || reduced) {
    startReveal();
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      if (entries.some(e => e.isIntersecting)) {
        startReveal();
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(section);
  }
});


// EVERYTHING BELOW IS OLD FEATURES - COUNTDOWN & VOTING
// JUST KEEPING FOR RECORDS AND DOCUMENTATION


// UPDATE: VOTING IS OVER!
// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyBhbOCKpKiEzNnYW29ps0iAQa5x6_6mN9E",
//   authDomain: "bradgoesbald.firebaseapp.com",
//   databaseURL: "https://bradgoesbald-default-rtdb.firebaseio.com",
//   projectId: "bradgoesbald",
//   storageBucket: "bradgoesbald.appspot.com",
//   messagingSenderId: "692506818966",
//   appId: "1:692506818966:web:b4e9efb47e1f9fed2e05b7",
//   measurementId: "G-R4NMYXYDJH"
// };

// // Use compat version to match script tags in index.html
// firebase.initializeApp(firebaseConfig);
// const database = firebase.database();


// document.addEventListener("DOMContentLoaded", function () {
//   UPDATE: COUNTDOWN IS OVER!
//   const countdownEl = document.getElementById("countdown");
//   const mainEl = document.querySelector("main");
//   const eventDate = new Date("September 20, 2025 21:00:00 EDT").getTime();

//   // Countdown
//   function updateCountdown() {
//     const now = new Date().getTime();
//     const diff = eventDate - now;

//     if (diff <= 0) {
//       if (countdownEl) countdownEl.style.display = "none";
//       if (mainEl) {
//         mainEl.style.justifyContent = "center";
//         mainEl.style.minHeight = "calc(100vh - 120px)";
//       }
//       clearInterval(timer);
//       return;
//     }

//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//     const minutes = Math.floor((diff / (1000 * 60)) % 60);
//     const seconds = Math.floor((diff / 1000) % 60);

//     document.getElementById("days").textContent    = String(days).padStart(2, '0');
//     document.getElementById("hours").textContent   = String(hours).padStart(2, '0');
//     document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
//     document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
//   }

// updateCountdown();
// const timer = setInterval(updateCountdown, 1000);

// UPDATE: VOTING IS OVER!
// Voting
// const poisonCountEl = document.getElementById("poison-count");
// const baldCountEl   = document.getElementById("bald-count");

// // Database references for each option
// const poisonRef = database.ref("votes/poison");
// const baldRef   = database.ref("votes/bald");

// // Helper to set count and fade it in the first time
// function setCount(el, value) {
//   el.textContent = value;
//   if (!el.classList.contains('visible')) {
//     // trigger CSS fade-in on first load
//     requestAnimationFrame(() => el.classList.add('visible'));
//   }
// }

// // Load and stay synced in real time
// poisonRef.on("value", (snapshot) => {
//   setCount(poisonCountEl, snapshot.exists() ? snapshot.val() : 824); // Final vote count from Firebase
// });

// baldRef.on("value", (snapshot) => {
//   setCount(baldCountEl, snapshot.exists() ? snapshot.val() : 1438); // Final vote count from Firebase
// });

// // Increment atomically on click
// document.querySelectorAll(".vote-column").forEach(col => {
//   col.addEventListener("click", () => {
//     const ref = col.dataset.option === "poison" ? poisonRef : baldRef;

//     ref.transaction(current => (current || 0) + 1);

//     // subtle pop animation when clicked
//     col.classList.remove("voted");
//     void col.offsetWidth; // force reflow to restart animation
//     col.classList.add("voted");
//   });
// });
// });