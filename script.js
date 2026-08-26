/**
 * ==========================================================================
 * PORTFOLIO SCRIPT (script.js)
 * A clean, modern, and teaching-oriented JavaScript reference for first-year students.
 * ==========================================================================
 */

// Global in-memory state variable for theme management (as requested, in-memory only)
let currentTheme = 'dark';

// Wait for DOM content to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCustomCursor();
  initMagneticButtons();
  initCardSpotlights();
  initTypingEffect();
  initProjectFilters();
  initScrollProgress();
  initScrollReveal();
  initActiveNavHighlight();
  initSkillBarAnimation();
  initStatsCounter();
  initButtonRipples();
  initContactForm();
  initBackToTop();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE
   WHAT: Switches between dark and light themes using an in-memory variable.
   WHY: Demonstrates DOM attribute manipulation and custom property changes.
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    // Toggle in-memory variable
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply data-theme attribute to <html> tag
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update aria-label for accessibility
    toggleBtn.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
  });
}

/* --------------------------------------------------------------------------
   2. CUSTOM MOUSE CURSOR
   WHAT: Tracks mouse coordinates and animates a center dot + lagging smooth ring.
   WHY: Introduces requestAnimationFrame linear interpolation (lerp) for smooth motion.
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  
  if (!cursorDot || !cursorRing) return;

  // Track target mouse position and smoothed ring position
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  // Listen for mousemove to update target coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot snaps immediately to the exact cursor position
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth lagging ring loop using requestAnimationFrame
  const renderCursor = () => {
    // Linear interpolation: move 18% of the distance each frame
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Add scale-up class when hovering interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .filter-btn, .project-card');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   3. MAGNETIC BUTTONS
   WHAT: Pulls buttons slightly towards the mouse pointer during hover.
   WHY: Enhances tactile feedback using getBoundingClientRect calculations.
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      // Calculate cursor position relative to the button center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Apply subtle translation (18% damping)
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      // Reset position smoothly
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   4. CARD SPOTLIGHT EFFECT
   WHAT: Updates CSS custom variables (--mouse-x, --mouse-y) on project cards.
   WHY: Creates a flashlight-style radial gradient border glow following the cursor.
   -------------------------------------------------------------------------- */
function initCardSpotlights() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   5. HERO TYPING EFFECT
   WHAT: Continuously types and deletes rotating professional titles.
   WHY: Teaches asynchronous string manipulation and setTimeout scheduling.
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typedTextElement = document.getElementById('typed-text');
  if (!typedTextElement) return;

  const phrases = [
    'CSE Student @ FIEM',
    'Tech Entrepreneur',
    'Full-Stack Developer',
    'AI & Web3 Innovator',
    'Founder @ AIVEXA'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  const typeLoop = () => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove characters
      typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      // Add characters
      typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    // Finished typing the entire word
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length; // Next word in array
      typingSpeed = 350; // Pause before typing next word
    }

    setTimeout(typeLoop, typingSpeed);
  };

  typeLoop();
}

/* --------------------------------------------------------------------------
   6. PROJECTS FILTER
   WHAT: Shows/hides project cards based on category button selection.
   WHY: Teaches dataset attribute filtering and conditional class toggling.
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active filter button style
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedFilter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        
        // Show if category matches or 'all' is selected
        if (selectedFilter === 'all' || cardCategory.includes(selectedFilter)) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. SCROLL PROGRESS BAR
   WHAT: Calculates percentage of page scrolled and scales the top progress bar.
   WHY: Demonstrates window scroll measurements (scrollTop, scrollHeight).
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${scrollPercentage}%`;
    }
  });
}

/* --------------------------------------------------------------------------
   8. SCROLL REVEAL (INTERSECTION OBSERVER)
   WHAT: Fades elements into view as they cross the viewport threshold.
   WHY: Modern, performant alternative to heavy scroll event handlers.
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after revealing to save browser resources
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   9. ACTIVE NAV LINK HIGHLIGHTING
   WHAT: Updates active underline state on navbar links based on current section.
   WHY: Informs users of their exact location on the single-page document.
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. SKILL BAR ANIMATION
   WHAT: Fills skill progress bars only when scrolled into the viewport.
   WHY: Prevents off-screen animations and delivers satisfying entry dynamics.
   -------------------------------------------------------------------------- */
function initSkillBarAnimation() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillBars.length) return;

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fillTarget = entry.target.getAttribute('data-fill');
        entry.target.style.width = fillTarget;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach((bar) => skillObserver.observe(bar));
}

/* --------------------------------------------------------------------------
   11. STATS COUNTER ANIMATION
   WHAT: Counts numbers upward from 0 to their target value upon viewport entry.
   WHY: Teaches easing intervals and integer formatting in JavaScript.
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const counterElements = document.querySelectorAll('.counter-number');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        const duration = 1400; // ms
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Smooth easeOutQuad mathematical curve
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const currentVal = Math.floor(easeProgress * target);

          entry.target.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            entry.target.textContent = target;
          }
        };

        requestAnimationFrame(updateCount);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach((counter) => counterObserver.observe(counter));
}

/* --------------------------------------------------------------------------
   12. BUTTON CLICK RIPPLE EFFECT
   WHAT: Creates a expanding radial light wave expanding from the cursor click point.
   WHY: Provides visual confirmation of button presses (Material design principle).
   -------------------------------------------------------------------------- */
function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      // Calculate coordinates relative to the button
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create a span element for the ripple
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      // Remove after animation completes (600ms)
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* --------------------------------------------------------------------------
   13. CONTACT FORM VALIDATION
   WHAT: Performs client-side validation, toggles error states, and shows success notice.
   WHY: Demonstrates event.preventDefault(), RegEx pattern matching, and feedback UX.
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-alert');
  if (!form) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop default form submission/reload

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('has-error');
      isValid = false;
    } else {
      nameInput.classList.remove('has-error');
    }

    // Validate Email
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('has-error');
      isValid = false;
    } else {
      emailInput.classList.remove('has-error');
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectInput.classList.add('has-error');
      isValid = false;
    } else {
      subjectInput.classList.remove('has-error');
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.classList.add('has-error');
      isValid = false;
    } else {
      messageInput.classList.remove('has-error');
    }

    // If valid, display success confirmation and reset form
    if (isValid) {
      if (alertBox) {
        alertBox.classList.add('is-success');
        alertBox.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Thank you, <strong>${nameInput.value.trim()}</strong>! Your message has been sent successfully.</span>
        `;
      }
      form.reset();

      // Clear success notification after 6 seconds
      setTimeout(() => {
        if (alertBox) {
          alertBox.classList.remove('is-success');
          alertBox.innerHTML = '';
        }
      }, 6000);
    }
  });

  // Remove error class as the user types
  const inputs = form.querySelectorAll('.form-control');
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('has-error');
    });
  });
}

/* --------------------------------------------------------------------------
   14. BACK TO TOP BUTTON
   WHAT: Shows floating action button after scrolling 400px; scrolls smoothly to top.
   WHY: Improves long-page navigation efficiency for users.
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   15. MOBILE MENU & HAMBURGER
   WHAT: Toggles navigation drawer and transforms hamburger bars into an 'X'.
   WHY: Standard responsive navigation pattern for touch screens.
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('is-active');
    navMenu.classList.toggle('is-open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile drawer when any link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('is-active');
      navMenu.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
