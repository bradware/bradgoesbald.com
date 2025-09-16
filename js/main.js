document.addEventListener("DOMContentLoaded", function () {
  const countdownEl = document.getElementById("countdown");
  const mainEl = document.querySelector("main");
  const eventDate = new Date("September 19, 2025 21:00:00 EDT").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = eventDate - now;

    // Hide countdown and recenter content if event has started
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

    document.getElementById("days").textContent = String(days).padStart(2, '0');
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

  // Voting counters (front-end only)
  const voteColumns = document.querySelectorAll(".vote-column");
  voteColumns.forEach(col => {
    col.addEventListener("click", () => {
      const countSpan = col.querySelector(".vote-count");
      let current = parseInt(countSpan.textContent);
      countSpan.textContent = current + 1;

      col.classList.remove("voted");
      void col.offsetWidth;
      col.classList.add("voted");
    });
  });
});
