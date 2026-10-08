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
  });
})();
