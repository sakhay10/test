// Global Variables
let currentFeedbackIndex = 0;
let feedbacks = [];
let isAutoRotating = true;
let autoRotateInterval;
let currentTextIndex = 0;

// Text Animation Variables
const texts = ["Front-End Developer", "Web Developer"];

// DOM Elements
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const backToTopBtn = document.getElementById("backToTop");
const feedbackForm = document.getElementById("feedbackForm");
const contactForm = document.getElementById("contactForm");
const preloader = document.getElementById("preloader");

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// Initialize Application
function initializeApp() {
  showPreloader();

  setTimeout(() => {
    hidePreloader();
  }, 4000);

  setTimeout(() => {
    setupNavigation();
    setupScrollAnimations();
    setupBackToTop();
    setupTextAnimation();
    setupSkillBars();
    setupForms();
    loadFeedbacks();
    startAutoRotation();
    setupActiveNavigation();
    setupSmoothResize();
  }, 4500);
}

// Preloader Functions
function showPreloader() {
  if (preloader) {
    preloader.style.display = "flex";
    preloader.style.opacity = "1";
    preloader.style.visibility = "visible";
    document.body.style.overflow = "hidden";
  }
}

function hidePreloader() {
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
      preloader.style.visibility = "hidden";
      document.body.style.overflow = "auto";
    }, 500);
  }
}

// Navigation Setup
function setupNavigation() {
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  document.querySelectorAll(".mobile-link, .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target.getAttribute("href");
      if (target && target.startsWith("#")) {
        scrollToSection(target.substring(1));
        closeMobileMenu();
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar")) {
      closeMobileMenu();
    }
  });
}

function toggleMobileMenu() {
  if (hamburger && mobileMenu) {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  }
}

function closeMobileMenu() {
  if (hamburger && mobileMenu) {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  }
}

// Active Navigation Setup
function setupActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function updateActiveNav() {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    // Update desktop nav links
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });

    // Update mobile nav links
    mobileLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav(); // Initial call
}

// Smooth Resize Animation
function setupSmoothResize() {
  let resizeTimer;

  window.addEventListener("resize", () => {
    document.body.style.transition = "all 0.3s ease";

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.style.transition = "";
    }, 300);
  });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

// Scroll Animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 100);

        if (entry.target.closest(".skills-section")) {
          setTimeout(() => {
            animateSkillBars();
          }, 300);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

// Back to Top Button
function setupBackToTop() {
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > window.innerHeight / 2) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// Text Animation Setup
function setupTextAnimation() {
  updateAnimatedText();
  setInterval(() => {
    currentTextIndex = (currentTextIndex + 1) % texts.length;
    updateAnimatedText();
  }, 3000);
}

function updateAnimatedText() {
  const animatedTextElement = document.getElementById("animatedText");
  if (animatedTextElement) {
    animatedTextElement.style.opacity = "0";
    setTimeout(() => {
      animatedTextElement.textContent = texts[currentTextIndex];
      animatedTextElement.style.opacity = "1";
    }, 250);
  }
}

// Skill Bars Animation
function setupSkillBars() {
  // This will be triggered by scroll animation
}

function animateSkillBars() {
  const skillFills = document.querySelectorAll(".skill-fill");
  skillFills.forEach((fill, index) => {
    if (!fill.classList.contains("animated")) {
      const percentage = fill.getAttribute("data-percentage");
      setTimeout(() => {
        fill.style.width = percentage + "%";
        fill.classList.add("animated");
      }, index * 200);
    }
  });
}

// Forms Setup
function setupForms() {
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", handleFeedbackSubmit);

    const nameInput = document.getElementById("feedbackName");
    const messageInput = document.getElementById("feedbackMessageInput");

    if (nameInput) {
      nameInput.addEventListener("input", validateName);
    }

    if (messageInput) {
      messageInput.addEventListener("input", validateMessage);
    }
  }

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);

    // Add real-time validation for contact form
    const contactNameInput = document.getElementById("contactName");
    const contactEmailInput = document.getElementById("contactEmail");
    const contactSubjectInput = document.getElementById("contactSubject");
    const contactMessageInput = document.getElementById("contactMessage");

    if (contactNameInput) {
      contactNameInput.addEventListener("input", validateContactName);
    }

    if (contactEmailInput) {
      contactEmailInput.addEventListener("input", validateContactEmail);
    }

    if (contactSubjectInput) {
      contactSubjectInput.addEventListener("input", validateContactSubject);
    }

    if (contactMessageInput) {
      contactMessageInput.addEventListener("input", validateContactMessage);
    }
  }
}

// Form Validation Functions
function validateName() {
  const nameInput = document.getElementById("feedbackName");
  const nameError = document.getElementById("nameError");

  if (!nameInput || !nameError) return false;

  const name = nameInput.value.trim();

  if (name.length < 4) {
    nameError.textContent = "Name must be at least 4 characters";
    return false;
  } else if (name.length > 25) {
    nameError.textContent = "Name must be less than 25 characters";
    return false;
  } else {
    nameError.textContent = "";
    return true;
  }
}

function validateMessage() {
  const messageInput = document.getElementById("feedbackMessageInput");
  const messageError = document.getElementById("messageError");

  if (!messageInput || !messageError) return false;

  const message = messageInput.value.trim();

  if (message.length < 10) {
    messageError.textContent = "Message must be at least 10 characters";
    return false;
  } else if (message.length > 100) {
    messageError.textContent = "Message must be less than 100 characters";
    return false;
  } else {
    messageError.textContent = "";
    return true;
  }
}

function validateContactName() {
  const nameInput = document.getElementById("contactName");
  const nameError = document.getElementById("contactNameError");

  if (!nameInput || !nameError) return false;

  const name = nameInput.value.trim();

  if (name.length < 2) {
    nameError.textContent = "Name must be at least 2 characters";
    return false;
  } else if (name.length > 50) {
    nameError.textContent = "Name must be less than 50 characters";
    return false;
  } else {
    nameError.textContent = "";
    return true;
  }
}

function validateContactEmail() {
  const emailInput = document.getElementById("contactEmail");
  const emailError = document.getElementById("contactEmailError");

  if (!emailInput || !emailError) return false;

  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    emailError.textContent = "Email is required";
    return false;
  } else if (!emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email address";
    return false;
  } else {
    emailError.textContent = "";
    return true;
  }
}

function validateContactSubject() {
  const subjectInput = document.getElementById("contactSubject");
  const subjectError = document.getElementById("contactSubjectError");

  if (!subjectInput || !subjectError) return false;

  const subject = subjectInput.value.trim();

  if (subject.length < 3) {
    subjectError.textContent = "Subject must be at least 3 characters";
    return false;
  } else if (subject.length > 100) {
    subjectError.textContent = "Subject must be less than 100 characters";
    return false;
  } else {
    subjectError.textContent = "";
    return true;
  }
}

function validateContactMessage() {
  const messageInput = document.getElementById("contactMessage");
  const messageError = document.getElementById("contactMessageError");

  if (!messageInput || !messageError) return false;

  const message = messageInput.value.trim();

  if (message.length < 10) {
    messageError.textContent = "Message must be at least 10 characters";
    return false;
  } else if (message.length > 500) {
    messageError.textContent = "Message must be less than 500 characters";
    return false;
  } else {
    messageError.textContent = "";
    return true;
  }
}

function clearContactErrors() {
  const errors = [
    "contactNameError",
    "contactEmailError",
    "contactSubjectError",
    "contactMessageError",
  ];
  errors.forEach((errorId) => {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = "";
    }
  });
}

// Handle Feedback Form Submission
async function handleFeedbackSubmit(e) {
  e.preventDefault();

  const isNameValid = validateName();
  const isMessageValid = validateMessage();

  if (!isNameValid || !isMessageValid) {
    return;
  }

  const formData = new FormData(e.target);
  const feedbackData = {
    name: formData.get("name"),
    message: formData.get("message"),
    timestamp: new Date()
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", ""),
  };

  try {
    const existingFeedbacks = JSON.parse(
      localStorage.getItem("feedbacks") || "[]"
    );
    existingFeedbacks.push(feedbackData);
    localStorage.setItem("feedbacks", JSON.stringify(existingFeedbacks));

    alert("Feedback submitted successfully! Thank you for your feedback.");
    e.target.reset();

    const nameError = document.getElementById("nameError");
    const messageError = document.getElementById("messageError");
    if (nameError) nameError.textContent = "";
    if (messageError) messageError.textContent = "";

    setTimeout(() => {
      loadFeedbacks();
    }, 1000);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    alert("Error submitting feedback. Please try again.");
  }
}

// Handle Contact Form Submission
async function handleContactSubmit(e) {
  e.preventDefault();

  // Validate contact form
  const isNameValid = validateContactName();
  const isEmailValid = validateContactEmail();
  const isSubjectValid = validateContactSubject();
  const isMessageValid = validateContactMessage();

  if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
    return;
  }

  const formData = new FormData(e.target);
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    timestamp: new Date()
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", ""),
  };

  console.log("Contact form submitted:", contactData);
  alert("Message sent successfully! I will get back to you soon.");
  e.target.reset();

  // Clear error messages
  clearContactErrors();
}

// Load Feedbacks
async function loadFeedbacks() {
  try {
    const localFeedbacks = JSON.parse(
      localStorage.getItem("feedbacks") || "[]"
    );

    if (localFeedbacks.length === 0) {
      feedbacks = [
        {
          name: "Alex Johnson",
          message: "Amazing work! Very professional and delivered on time.",
          timestamp: "2025-01-15 10:30",
        },
      ];
    } else {
      feedbacks = [...localFeedbacks].reverse();
    }
  } catch (error) {
    console.error("Error loading feedbacks:", error);
    feedbacks = [
      {
        name: "Alex Johnson",
        message: "Amazing work! Very professional and delivered on time.",
        timestamp: "2025-01-15 10:30",
      },
    ];
  }

  updateFeedbackDisplay();
  createCarouselIndicators();
}

// Feedback Carousel Functions
function updateFeedbackDisplay() {
  if (feedbacks.length === 0) return;

  const messageEl = document.getElementById("feedbackMessage");
  const authorEl = document.getElementById("feedbackAuthor");
  const timeEl = document.getElementById("feedbackTime");

  const currentFeedback = feedbacks[currentFeedbackIndex];

  if (messageEl && authorEl && timeEl && currentFeedback) {
    messageEl.textContent = `"${currentFeedback.message}"`;
    authorEl.textContent = `- ${currentFeedback.name}`;
    timeEl.textContent = currentFeedback.timestamp;
  }

  updateCarouselIndicators();
}

function createCarouselIndicators() {
  const indicatorsContainer = document.getElementById("carouselIndicators");
  if (!indicatorsContainer) return;

  indicatorsContainer.innerHTML = "";

  feedbacks.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.className = `indicator ${
      index === currentFeedbackIndex ? "active" : ""
    }`;
    indicator.addEventListener("click", () => {
      currentFeedbackIndex = index;
      updateFeedbackDisplay();
      resetAutoRotation();
    });
    indicatorsContainer.appendChild(indicator);
  });
}

function updateCarouselIndicators() {
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentFeedbackIndex);
  });
}

function nextFeedback() {
  if (feedbacks.length === 0) return;
  currentFeedbackIndex = (currentFeedbackIndex + 1) % feedbacks.length;
  updateFeedbackDisplay();
  resetAutoRotation();
}

function prevFeedback() {
  if (feedbacks.length === 0) return;
  currentFeedbackIndex =
    (currentFeedbackIndex - 1 + feedbacks.length) % feedbacks.length;
  updateFeedbackDisplay();
  resetAutoRotation();
}

function startAutoRotation() {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
  }

  autoRotateInterval = setInterval(() => {
    if (isAutoRotating && feedbacks.length > 1) {
      nextFeedback();
    }
  }, 4000);
}

function resetAutoRotation() {
  isAutoRotating = false;
  setTimeout(() => {
    isAutoRotating = true;
  }, 5000);
}

// Pause auto-rotation on hover
document.addEventListener("DOMContentLoaded", () => {
  const feedbackCard = document.getElementById("feedbackCard");
  if (feedbackCard) {
    feedbackCard.addEventListener("mouseenter", () => {
      isAutoRotating = false;
    });

    feedbackCard.addEventListener("mouseleave", () => {
      setTimeout(() => {
        isAutoRotating = true;
      }, 1000);
    });
  }
});

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimization
const debouncedScroll = debounce(() => {
  // Scroll operations are handled by other functions
}, 100);

window.addEventListener("scroll", debouncedScroll);

console.log("Portfolio script loaded successfully!");
