(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.getElementById("mobile-menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");

    if (navToggle && mobileNav) {
      navToggle.addEventListener("click", function () {
        const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!isExpanded));
        mobileNav.classList.toggle("is-open", !isExpanded);
      });

      // Close menu when clicking nav links
      const mobileLinks = mobileNav.querySelectorAll("a");
      mobileLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          navToggle.setAttribute("aria-expanded", "false");
          mobileNav.classList.remove("is-open");
        });
      });
    }

    const stackSection = document.querySelector(".stack-section");
    const stackFilters = document.querySelectorAll("[data-stack-filter]");

    if (stackSection && stackFilters.length) {
      stackFilters.forEach(function (filter) {
        filter.addEventListener("click", function () {
          const context = filter.getAttribute("data-stack-filter");
          const isActive = filter.getAttribute("aria-pressed") === "true";

          stackFilters.forEach(function (item) {
            item.setAttribute("aria-pressed", "false");
          });

          if (isActive) {
            stackSection.removeAttribute("data-active-context");
          } else {
            filter.setAttribute("aria-pressed", "true");
            stackSection.setAttribute("data-active-context", context);
          }
        });
      });
    }

    const copyButtons = document.querySelectorAll("[data-copy-email]");

    function fallbackCopy(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!copied) throw new Error("Copy command failed");
    }

    copyButtons.forEach(function (button) {
      button.hidden = false;
      button.addEventListener("click", async function () {
        const email = button.getAttribute("data-copy-email");
        const status = button.querySelector("[data-copy-status]");
        const copyLabel = button.getAttribute("data-copy-label");
        const copiedLabel = button.getAttribute("data-copied-label");

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
          } else {
            fallbackCopy(email);
          }
          status.textContent = copiedLabel;
          window.setTimeout(function () {
            status.textContent = copyLabel;
          }, 2000);
        } catch (error) {
          status.textContent = copyLabel;
        }
      });
    });
  });
})();
