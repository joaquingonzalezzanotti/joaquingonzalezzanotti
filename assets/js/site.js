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
  });
})();
