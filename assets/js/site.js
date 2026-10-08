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

    const projectCarousels = document.querySelectorAll("[data-projects-carousel]");

    projectCarousels.forEach(function (carousel) {
      const section = carousel.closest(".projects-section");
      const track = carousel.querySelector("[data-carousel-track]");
      const previousButton = section ? section.querySelector("[data-carousel-previous]") : null;
      const nextButton = section ? section.querySelector("[data-carousel-next]") : null;
      const status = section ? section.querySelector("[data-carousel-status]") : null;
      const cards = track ? track.querySelectorAll(".project-card-v2") : [];
      let updateFrame = null;

      if (!section || !track || !previousButton || !nextButton || !status || !cards.length) return;

      section.classList.add("is-carousel-enhanced");

      function getMetrics() {
        const styles = window.getComputedStyle(track);
        const cardsPerView = Math.max(1, Number.parseInt(styles.getPropertyValue("--cards-per-view"), 10) || 1);
        const gap = Number.parseFloat(styles.columnGap) || 0;
        const cardWidth = cards[0].getBoundingClientRect().width;

        return { cardsPerView: cardsPerView, step: cardWidth + gap };
      }

      function updateCarousel() {
        const metrics = getMetrics();
        const firstVisibleIndex = Math.min(
          cards.length - 1,
          Math.max(0, Math.round(track.scrollLeft / metrics.step)),
        );
        const lastVisibleIndex = Math.min(cards.length, firstVisibleIndex + metrics.cardsPerView);
        const statusTemplate = carousel.getAttribute("data-status-template") || "{start}–{end} / {total}";
        const atStart = track.scrollLeft <= 2;
        const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;

        previousButton.disabled = atStart;
        nextButton.disabled = atEnd;
        const nextStatus = statusTemplate
          .replace("{start}", String(firstVisibleIndex + 1))
          .replace("{end}", String(lastVisibleIndex))
          .replace("{total}", String(cards.length));

        if (status.textContent !== nextStatus) status.textContent = nextStatus;
      }

      function scheduleUpdate() {
        if (updateFrame !== null) return;
        updateFrame = window.requestAnimationFrame(function () {
          updateFrame = null;
          updateCarousel();
        });
      }

      function moveCarousel(direction) {
        const metrics = getMetrics();
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        track.scrollBy({
          left: direction * metrics.step * metrics.cardsPerView,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }

      previousButton.addEventListener("click", function () {
        moveCarousel(-1);
      });

      nextButton.addEventListener("click", function () {
        moveCarousel(1);
      });

      track.addEventListener("scroll", scheduleUpdate, { passive: true });
      track.addEventListener("keydown", function (event) {
        if (event.target === track && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
          event.preventDefault();
          moveCarousel(event.key === "ArrowLeft" ? -1 : 1);
        }
      });

      if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(track);
      } else {
        window.addEventListener("resize", scheduleUpdate);
      }

      updateCarousel();
    });

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

    const contactDialog = document.querySelector("[data-contact-dialog]");

    if (contactDialog && typeof contactDialog.showModal === "function") {
      const contactOpeners = document.querySelectorAll("[data-contact-modal-open]");
      const contactCloseButton = contactDialog.querySelector("[data-contact-modal-close]");
      const contactForm = contactDialog.querySelector("[data-contact-form]");
      const contactStatus = contactDialog.querySelector("[data-contact-form-status]");
      const contactSubmitButton = contactDialog.querySelector("[data-contact-submit]");
      let lastContactOpener = null;

      function openContactDialog(event) {
        event.preventDefault();
        lastContactOpener = event.currentTarget;

        if (contactStatus) {
          contactStatus.textContent = "";
          contactStatus.removeAttribute("data-state");
        }

        contactDialog.showModal();
        document.body.classList.add("modal-open");

        const firstField = contactDialog.querySelector('input[name="name"]');
        if (firstField) window.setTimeout(function () { firstField.focus(); }, 0);
      }

      contactOpeners.forEach(function (opener) {
        opener.addEventListener("click", openContactDialog);
      });

      if (contactCloseButton) {
        contactCloseButton.addEventListener("click", function () {
          contactDialog.close();
        });
      }

      contactDialog.addEventListener("click", function (event) {
        if (event.target === contactDialog) contactDialog.close();
      });

      contactDialog.addEventListener("close", function () {
        document.body.classList.remove("modal-open");
        if (lastContactOpener) lastContactOpener.focus();
      });

      if (contactForm && contactStatus && contactSubmitButton) {
        contactForm.addEventListener("submit", async function (event) {
          event.preventDefault();
          if (!contactForm.reportValidity()) return;

          const originalSubmitLabel = contactSubmitButton.textContent;
          contactSubmitButton.disabled = true;
          contactSubmitButton.textContent = contactForm.getAttribute("data-sending-label");
          contactStatus.textContent = "";
          contactStatus.removeAttribute("data-state");

          try {
            const response = await fetch(contactForm.action, {
              method: "POST",
              body: new FormData(contactForm),
              headers: { Accept: "application/json" },
            });

            if (!response.ok) throw new Error("Contact form request failed");

            contactForm.reset();
            contactStatus.textContent = contactForm.getAttribute("data-success-message");
            contactStatus.setAttribute("data-state", "success");
          } catch (error) {
            contactStatus.textContent = contactForm.getAttribute("data-error-message");
            contactStatus.setAttribute("data-state", "error");
          } finally {
            contactSubmitButton.disabled = false;
            contactSubmitButton.textContent = originalSubmitLabel;
          }
        });
      }
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
