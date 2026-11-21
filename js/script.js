document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  const backToTop = document.querySelector(".back-to-top");
  const toast = document.getElementById("toast");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const whatsappNumber = "919946326888";
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4200);
  }

  function closeNav() {
    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("click", function (event) {
      if (body.classList.contains("nav-open") && !header.contains(event.target)) closeNav();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      closeNav();
      if (navToggle) navToggle.focus();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeNav();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  });

  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const navSections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && navSections.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    navSections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  function handleScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  const faqButtons = Array.from(document.querySelectorAll(".faq-question"));
  faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const wasExpanded = button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach(function (otherButton) {
        otherButton.setAttribute("aria-expanded", "false");
        const otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
        if (otherPanel) otherPanel.hidden = true;
      });

      if (!wasExpanded) {
        button.setAttribute("aria-expanded", "true");
        const panel = document.getElementById(button.getAttribute("aria-controls"));
        if (panel) panel.hidden = false;
      }
    });
  });

  const carousel = document.querySelector(".testimonial-carousel");
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".testimonial-slide"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    let currentSlide = 0;
    let carouselTimer;

    function showSlide(index) {
      if (!slides.length) return;
      currentSlide = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === currentSlide;
        slide.hidden = !isActive;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach(function (dot, dotIndex) {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
        dot.tabIndex = isActive ? 0 : -1;
      });
    }

    function stopCarousel() {
      if (carouselTimer) window.clearInterval(carouselTimer);
      carouselTimer = undefined;
    }

    function startCarousel() {
      stopCarousel();
      if (reducedMotion || slides.length < 2) return;
      carouselTimer = window.setInterval(function () {
        showSlide(currentSlide + 1);
      }, 7000);
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        showSlide(currentSlide - 1);
        startCarousel();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        showSlide(currentSlide + 1);
        startCarousel();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.dataset.carouselDot));
        startCarousel();
      });
    });

    carousel.addEventListener("mouseenter", stopCarousel);
    carousel.addEventListener("mouseleave", startCarousel);
    carousel.addEventListener("focusin", stopCarousel);
    carousel.addEventListener("focusout", function (event) {
      if (!carousel.contains(event.relatedTarget)) startCarousel();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopCarousel();
      else startCarousel();
    });

    showSlide(0);
    startCarousel();
  }

  document.querySelectorAll("[data-whatsapp-cta]").forEach(function (link) {
    const message = link.dataset.whatsappMessage || "Hello Futura Labs, I am interested in the Digital Marketing Training in Kochi. Please share the course details, syllabus, fees, and upcoming batch information.";
    link.href = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);
  });

  document.querySelectorAll("[data-download-syllabus]").forEach(function (link) {
    link.addEventListener("click", function () {
      showToast("Syllabus preview downloading. Replace this placeholder PDF with the official file before launch.");
    });
  });

  const form = document.getElementById("enquiry-form");

  if (form) {
    const APPS_SCRIPT_URL = "";

    const errorIds = {
      fullName: "full-name-error",
      mobile: "mobile-number-error",
      email: "email-address-error",
      learningMode: "learning-mode-error",
      courseInterest: "course-interest-error"
    };

    const rules = {
      fullName: function (value) {
        return value.trim().length >= 2 || "Please enter your full name.";
      },
      mobile: function (value) {
        const digits = value.replace(/\D/g, "");
        const localNumber = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
        return /^[6-9]\d{9}$/.test(localNumber) || "Enter a valid 10-digit Indian mobile number.";
      },
      email: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) || "Enter a valid email address.";
      },
      learningMode: function (value) {
        return value !== "" || "Select a preferred learning mode.";
      },
      courseInterest: function (value) {
        return value !== "" || "Select a course interest.";
      }
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonContent = submitButton ? submitButton.innerHTML : "";

    function normalizeMobile(value) {
      const digits = value.replace(/\D/g, "");
      return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
    }

    function setFieldState(input, message) {
      const errorElement = document.getElementById(errorIds[input.name]);
      if (errorElement) errorElement.textContent = message || "";

      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }

    function validateField(input) {
      const rule = rules[input.name];
      if (!rule) return true;

      const result = rule(input.value);
      if (result === true) {
        setFieldState(input, "");
        return true;
      }

      setFieldState(input, result);
      return false;
    }

    function showFormMessage(type, message) {
      const messageElement = document.getElementById("form-message");
      if (!messageElement) return;
      messageElement.className = "form-message" + (type ? " " + type : "");
      messageElement.textContent = message;
    }

    function setSubmitting(isSubmitting) {
      if (!submitButton) return;
      submitButton.disabled = isSubmitting;
      submitButton.innerHTML = isSubmitting ? "Sending..." : originalButtonContent;
    }

    function createSubmissionFrame() {
      let frame = document.getElementById("futura-enquiry-frame");
      if (!frame) {
        frame = document.createElement("iframe");
        frame.id = "futura-enquiry-frame";
        frame.name = "futura-enquiry-frame";
        frame.setAttribute("aria-hidden", "true");
        frame.style.position = "absolute";
        frame.style.left = "-9999px";
        frame.style.width = "1px";
        frame.style.height = "1px";
        frame.style.border = "0";
        document.body.appendChild(frame);
      }
      return frame;
    }

    function createHiddenForm(payload, submissionId, targetName) {
      const hiddenForm = document.createElement("form");
      hiddenForm.method = "POST";
      hiddenForm.action = APPS_SCRIPT_URL;
      hiddenForm.target = targetName;
      hiddenForm.style.display = "none";

      const values = {
        submissionId: submissionId,
        fullName: payload.fullName,
        mobile: payload.mobile,
        email: payload.email,
        learningMode: payload.learningMode,
        courseInterest: payload.courseInterest,
        message: payload.message,
        source: payload.source,
        submittedAt: payload.submittedAt
      };

      Object.keys(values).forEach(function (name) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = values[name] || "";
        hiddenForm.appendChild(input);
      });

      document.body.appendChild(hiddenForm);
      return hiddenForm;
    }

    function submitToGoogleSheet(payload) {
      return new Promise(function (resolve, reject) {
        const frame = createSubmissionFrame();
        const submissionId = window.crypto && typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : "futura-" + Date.now() + "-" + Math.random().toString(36).slice(2);
        const hiddenForm = createHiddenForm(payload, submissionId, frame.name);
        let settled = false;

        function finish(callback, value) {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          window.removeEventListener("message", handleMessage);
          if (hiddenForm.parentNode) hiddenForm.parentNode.removeChild(hiddenForm);
          callback(value);
        }

        function handleMessage(event) {
          if (event.source !== frame.contentWindow) return;

          let response;
          try {
            response = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          } catch (error) {
            return;
          }

          if (!response || response.submissionId !== submissionId) return;

          if (response.status === "success") finish(resolve, response);
          else finish(reject, response);
        }

        const timeoutId = window.setTimeout(function () {
          finish(reject, new Error("Submission timed out"));
        }, 12000);

        window.addEventListener("message", handleMessage);
        hiddenForm.submit();
      });
    }

    Object.keys(rules).forEach(function (fieldName) {
      const input = form.elements[fieldName];
      if (!input) return;

      input.addEventListener("blur", function () {
        validateField(input);
      });

      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateField(input);
      });

      input.addEventListener("change", function () {
        validateField(input);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const fields = Object.keys(rules)
        .map(function (fieldName) {
          return form.elements[fieldName];
        })
        .filter(Boolean);

      let isValid = true;
      let firstInvalid = null;

      fields.forEach(function (input) {
        const fieldIsValid = validateField(input);
        if (!fieldIsValid) {
          isValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!isValid) {
        showFormMessage("error", "Please correct the highlighted fields before sending.");
        if (firstInvalid) firstInvalid.focus();
        showToast("Please check the highlighted fields.");
        return;
      }

      if (!APPS_SCRIPT_URL.trim()) {
        showFormMessage(
          "error",
          "The enquiry service is not connected yet. Please call +91 977 80 430 02 or use WhatsApp to reach our team."
        );
        showToast("Enquiry service not connected. Please call or WhatsApp us.");
        return;
      }

      const payload = {
        fullName: form.elements.fullName.value.trim(),
        mobile: normalizeMobile(form.elements.mobile.value),
        email: form.elements.email.value.trim(),
        learningMode: form.elements.learningMode.value,
        courseInterest: form.elements.courseInterest.value,
        message: form.elements.message.value.trim(),
        source: "Futura Labs Kochi digital marketing landing page",
        submittedAt: new Date().toISOString()
      };

      setSubmitting(true);
      showFormMessage("", "Sending your enquiry...");

      submitToGoogleSheet(payload)
        .then(function () {
          showFormMessage("success", "Thank you. Your enquiry has been received and our team will contact you.");
          form.reset();
          fields.forEach(function (input) {
            setFieldState(input, "");
          });
          showToast("Enquiry sent successfully.");
        })
        .catch(function () {
          showFormMessage(
            "error",
            "We could not send your enquiry right now. Please try again or call +91 977 80 430 02."
          );
          showToast("Enquiry could not be sent. Please try again or call us.");
        })
        .finally(function () {
          setSubmitting(false);
        });
    });
  }

  document.querySelectorAll("[data-cta]").forEach(function (element) {
    element.addEventListener("click", function () {
      element.classList.add("is-pressed");
      window.setTimeout(function () {
        element.classList.remove("is-pressed");
      }, 180);
    });
  });
});
