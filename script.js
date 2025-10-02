/*
  Sebastian Fisher JavaScript
  Purpose: Enhance accessibility, interactivity, and performance with minimal footprint.
  Guidelines: Vanilla JS only, no external dependencies.
*/

// Utility: helper to throttle focus outlines for keyboard users (for accessibility)
(function manageFocusOutlines() {
  const body = document.body;
  function handleFirstTab(e) {
    if (e.key === "Tab") {
      body.classList.add("user-is-tabbing");
      window.removeEventListener("keydown", handleFirstTab);
      window.addEventListener("mousedown", handleMouseDownOnce);
    }
  }
  function handleMouseDownOnce() {
    body.classList.remove("user-is-tabbing");
    window.removeEventListener("mousedown", handleMouseDownOnce);
    window.addEventListener("keydown", handleFirstTab);
  }
  window.addEventListener("keydown", handleFirstTab);
})();

// Smooth scroll for anchor links within the page
(function enableSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();

// Navigation toggle for mobile view
(function handleNavigationToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggle || !navLinks) return;
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("is-open");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      toggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    }
  });
})();

// Intersection Observer to reveal elements with fade-in animation
(function revealOnScroll() {
  const observedElements = document.querySelectorAll("[data-observe], .timeline__item, .journey__note, .hero__content");
  if (!("IntersectionObserver" in window)) {
    observedElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  observedElements.forEach((element) => observer.observe(element));
})();

// Carousel functionality for testimonials
(function initiateCarousel() {
  const slides = Array.from(document.querySelectorAll(".carousel__slide"));
  const prev = document.querySelector(".carousel__control--prev");
  const next = document.querySelector(".carousel__control--next");
  if (!slides.length || !prev || !next) return;

  let index = 0;
  let intervalId;

  function showSlide(newIndex) {
    slides[index].classList.remove("is-active");
    index = (newIndex + slides.length) % slides.length;
    slides[index].classList.add("is-active");
  }

  function startAutoRotate() {
    intervalId = window.setInterval(() => {
      showSlide(index + 1);
    }, 6000);
  }

  function resetAutoRotate() {
    if (intervalId) {
      window.clearInterval(intervalId);
    }
    startAutoRotate();
  }

  prev.addEventListener("click", () => {
    showSlide(index - 1);
    resetAutoRotate();
  });

  next.addEventListener("click", () => {
    showSlide(index + 1);
    resetAutoRotate();
  });

  startAutoRotate();
})();

// Modal handling for privacy content
(function manageModal() {
  const modal = document.getElementById("privacy-modal");
  const triggers = document.querySelectorAll('[data-modal-target="privacy-modal"]');
  if (!modal || !triggers.length) return;
  const closeButton = modal.querySelector(".modal__close");

  function openModal() {
    modal.hidden = false;
    modal.querySelector(".modal__content").focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  triggers.forEach((trigger) => trigger.addEventListener("click", openModal));
  closeButton?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();

// Form persistence using localStorage and validation feedback
(function handleInquiryForm() {
  const form = document.querySelector(".inquiry-form");
  if (!form) return;

  const fields = ["name", "email", "locale", "ambition"];
  const storageKey = "sebastian-fisher-inquiry";

  function loadStoredValues() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (!stored) return;
      fields.forEach((fieldName) => {
        if (stored[fieldName]) {
          const field = form.elements[fieldName];
          if (field) {
            field.value = stored[fieldName];
          }
        }
      });
    } catch (error) {
      console.error("Unable to load stored inquiry.", error);
    }
  }

  function persistValues() {
    const data = {};
    fields.forEach((fieldName) => {
      data[fieldName] = form.elements[fieldName]?.value || "";
    });
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function validateField(field, errorId) {
    const errorElement = document.getElementById(errorId);
    if (field.validity.valid) {
      errorElement.textContent = "";
      return true;
    }
    if (field.validity.valueMissing) {
      errorElement.textContent = "This field is required.";
    } else if (field.type === "email" && field.validity.typeMismatch) {
      errorElement.textContent = "Please provide a valid email address.";
    } else {
      errorElement.textContent = "Please review this entry.";
    }
    return false;
  }

  loadStoredValues();

  fields.forEach((fieldName) => {
    const field = form.elements[fieldName];
    if (!field) return;
    field.addEventListener("input", () => {
      validateField(field, `${fieldName}-error`);
      persistValues();
    });
    field.addEventListener("blur", () => validateField(field, `${fieldName}-error`));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;
    fields.forEach((fieldName) => {
      const field = form.elements[fieldName];
      if (field) {
        const valid = validateField(field, `${fieldName}-error`);
        if (!valid) {
          isValid = false;
        }
      }
    });

    if (!isValid) {
      form.reportValidity();
      return;
    }

    persistValues();
    console.log("Inquiry submitted", Object.fromEntries(new FormData(form)));
    alert("Inquiry submitted. Response within 24h.");
    form.reset();
    localStorage.removeItem(storageKey);
  });
})();
