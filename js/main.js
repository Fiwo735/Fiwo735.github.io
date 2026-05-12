/* ---------------------------------------------------------------
 * Personal website — minimal client-side enhancements:
 *   1. Highlight the currently visible section in the top nav.
 *   2. Inject the current year into the footer.
 *   3. Close any "active" highlight if the user scrolls above all sections.
 * No frameworks, no build step.
 * --------------------------------------------------------------- */

(function () {
  "use strict";

  // ------- Footer year -------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ------- Dark / light mode toggle -------
  // The initial theme is applied by an inline script in <head> to avoid FOUC;
  // here we just wire up the button click + sync ARIA state.
  var rootEl = document.documentElement;
  var themeToggle = document.querySelector(".theme-toggle");

  function isDark() {
    return rootEl.getAttribute("data-theme") === "dark";
  }

  function syncToggleState() {
    if (!themeToggle) return;
    var dark = isDark();
    themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
    themeToggle.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      rootEl.setAttribute("data-theme", "dark");
    } else {
      rootEl.removeAttribute("data-theme");
    }
    syncToggleState();
  }

  syncToggleState();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
    });
  }

  // ------- Scrollspy: highlight active section in top nav -------
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".topnav a")
  );

  if (!navLinks.length || !("IntersectionObserver" in window)) return;

  // Map: section id -> nav link
  var linkById = {};
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace(/^#/, "");
      var section = document.getElementById(id);
      if (section) linkById[id] = link;
      return section;
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("active", match);
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  // Track section visibility ratios. The section with the largest visible
  // area "wins" and gets marked active.
  var ratios = {};
  sections.forEach(function (s) { ratios[s.id] = 0; });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        ratios[entry.target.id] = entry.intersectionRatio;
      });

      var bestId = null;
      var bestRatio = 0;
      Object.keys(ratios).forEach(function (id) {
        if (ratios[id] > bestRatio) {
          bestRatio = ratios[id];
          bestId = id;
        }
      });

      if (bestId && bestRatio > 0) {
        setActive(bestId);
      }
    },
    {
      // Trigger when sections cross roughly the middle band of the viewport,
      // accounting for the sticky top nav.
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  sections.forEach(function (section) { observer.observe(section); });
})();
