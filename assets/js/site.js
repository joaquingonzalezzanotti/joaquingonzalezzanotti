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

    const stackStage = document.querySelector(".stack-stage");

    if (stackStage) {
      const stackFilters = stackStage.querySelectorAll("[data-stack-filter]");
      const stackNodes = stackStage.querySelectorAll(".stack-node");
      const stackLayers = stackStage.querySelectorAll(".stack-layer");
      const stackSummary = stackStage.querySelector("[data-stack-summary]");
      const defaultSummary = stackSummary ? stackSummary.getAttribute("data-default-summary") : "";
      let lockedFilter = null;

      function containsContext(element, context) {
        return (element.getAttribute("data-used") || "").split(" ").includes(context);
      }

      function showContext(filter) {
        const context = filter ? filter.getAttribute("data-stack-filter") : "";
        stackStage.classList.toggle("has-context", Boolean(context));

        stackNodes.forEach(function (node) {
          node.classList.toggle("is-context-match", Boolean(context) && containsContext(node, context));
        });

        stackLayers.forEach(function (layer, index) {
          const nextLayer = stackLayers[index + 1];
          const isMatch = Boolean(context) && containsContext(layer, context);
          const continuesToNextLayer = isMatch && nextLayer && containsContext(nextLayer, context);

          layer.classList.toggle("is-context-match", isMatch);
          layer.classList.toggle("is-context-path", Boolean(continuesToNextLayer));
        });

        if (stackSummary) {
          stackSummary.textContent = filter ? filter.getAttribute("data-stack-summary") : defaultSummary;
        }
      }

      function restoreLockedContext() {
        showContext(lockedFilter);
      }

      stackFilters.forEach(function (filter) {
        filter.addEventListener("mouseenter", function () {
          if (!lockedFilter) showContext(filter);
        });

        filter.addEventListener("mouseleave", function () {
          if (!lockedFilter) restoreLockedContext();
        });

        filter.addEventListener("focus", function () {
          if (!lockedFilter) showContext(filter);
        });

        filter.addEventListener("blur", function () {
          if (!lockedFilter) restoreLockedContext();
        });

        filter.addEventListener("click", function () {
          const wasLocked = lockedFilter === filter;
          lockedFilter = wasLocked ? null : filter;

          stackFilters.forEach(function (item) {
            item.setAttribute("aria-pressed", String(item === lockedFilter));
          });

          restoreLockedContext();
        });
      });

      stackStage.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && lockedFilter) {
          lockedFilter = null;
          stackFilters.forEach(function (item) {
            item.setAttribute("aria-pressed", "false");
          });
          restoreLockedContext();
        }
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
