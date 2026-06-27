// Shared JavaScript utilities and navigation controllers

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupThemeToggle();
  setupScrollEffects();
  highlightActiveRoute();
});

// Setup Mobile Navigation Menu
function setupNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    // Toggle menu
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

// Setup Theme Toggle
function setupThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  const htmlElement = document.documentElement;
  
  // Get saved theme preference or default to 'dark'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeButtons(savedTheme);
  
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-theme');
      htmlElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeButtons(theme);
    });
  });
}

// Update theme button active states
function updateThemeButtons(theme) {
  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach(btn => {
    if (btn.getAttribute('data-theme') === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Header scroll transitions
function setupScrollEffects() {
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// Highlight the current page link in navbar
function highlightActiveRoute() {
  const path = window.location.pathname;
  const pageName = path.split('/').pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && href === './') || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
 // Subtitle Typing Animation specific to index.html
    const typedTextSpan = document.getElementById("typed-text");
    const phrases = ["Cybersecurity student", "Aspiring Security Analyst", "Tech Enthusiast"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 1500; // Pause at full phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before typing next phrase
      }

      setTimeout(type, typeSpeed);
    }

    document.addEventListener("DOMContentLoaded", () => {
      if (typedTextSpan) setTimeout(type, 1000);
    });

    // Trigger animation for skill bars upon load
    window.addEventListener('load', () => {
      const bars = document.querySelectorAll('.skill-bar-fill');
      setTimeout(() => {
        bars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          if (width) bar.style.width = width;
        });
      }, 300);
    });

    // Project filter interaction
    document.addEventListener('DOMContentLoaded', () => {
      const filters = document.querySelectorAll('.filter-btn');
      const cards = document.querySelectorAll('.project-card');

      filters.forEach(filter => {
        filter.addEventListener('click', () => {
          // Toggle active class
          filters.forEach(f => f.classList.remove('active'));
          filter.classList.add('active');

          const category = filter.getAttribute('data-filter');

          // Hide / Show matching cards
          cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
              card.style.display = 'flex';
              card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    });