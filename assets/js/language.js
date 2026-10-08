(function () {
  const STORAGE_KEY = "portfolio-language";

  function getSavedLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setSavedLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // Ignored if storage is blocked
    }
  }

  function getBrowserLanguage() {
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (let i = 0; i < langs.length; i++) {
      const l = (langs[i] || "").toLowerCase();
      if (l.startsWith("en")) return "en";
      if (l.startsWith("es")) return "es";
    }
    return "es";
  }

  const currentPath = window.location.pathname;
  const isEnPage = currentPath.startsWith("/en") || currentPath.includes("/en/");
  const savedLang = getSavedLanguage();

  // Root redirect logic
  if (!isEnPage) {
    // We are on Spanish root '/'
    if (savedLang === "en") {
      const target = "/en/" + window.location.hash;
      window.location.replace(target);
      return;
    } else if (!savedLang) {
      const browserLang = getBrowserLanguage();
      if (browserLang === "en") {
        const target = "/en/" + window.location.hash;
        window.location.replace(target);
        return;
      }
    }
  } else {
    // We are on English page '/en/'
    if (savedLang === "es") {
      const target = "/" + window.location.hash;
      window.location.replace(target);
      return;
    }
  }

  // Bind click handlers after DOM is loaded
  document.addEventListener("DOMContentLoaded", function () {
    const langButtons = document.querySelectorAll("[data-lang-switch]");
    langButtons.forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        const targetLang = btn.getAttribute("data-lang-switch");
        setSavedLanguage(targetLang);
        const targetPath = targetLang === "en" ? "/en/" : "/";

        if (window.location.pathname === targetPath && !window.location.search) {
          window.history.replaceState(null, "", targetPath);
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          return;
        }

        window.location.assign(targetPath);
      });
    });
  });
})();
