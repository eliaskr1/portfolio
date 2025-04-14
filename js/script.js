// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll animations
  const sections = document.querySelectorAll('section:not(.hero)');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideUp 0.8s forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    observer.observe(section);
  });

  // Add wave animation to the hand emoji
  const wave = document.querySelector('.wave');
  if (wave) {
    setInterval(() => {
      wave.classList.add('waving');
      setTimeout(() => {
        wave.classList.remove('waving');
      }, 1000);
    }, 3000);
  }

  // Theme toggle functionality
  createThemeToggle();
  
  // Project modals functionality
  setupProjectModals();
});

// Function to create and add the theme toggle button
function createThemeToggle() {
  // Create the theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '🌓';
  themeToggle.setAttribute('aria-label', 'Toggle light/dark mode');
  document.body.appendChild(themeToggle);
  
  // Check for saved user preference or system preference
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.add('light-mode');
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
      document.body.classList.replace('dark-mode', 'light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.replace('light-mode', 'dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// Function to setup project modals
function setupProjectModals() {
  // Get all project cards
  const projectCards = document.querySelectorAll('.project-card');
  
  // Get all modals and close buttons
  const modalContainers = document.querySelectorAll('.modal-container');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  // Add click event to each project card
  projectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const modalId = `project${index + 1}-modal`;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Initialize slideshow for this modal
        initSlideshow(modal);
      }
    });
  });
  
  // Add click event to close buttons
  closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = button.closest('.modal-container');
      if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  });
  
  // Close modal when clicking outside
  modalContainers.forEach(container => {
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        container.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalContainers.forEach(container => {
        container.classList.remove('active');
      });
      document.body.classList.remove('modal-open');
    }
  });
}

// Initialize slideshow functionality for a modal
function initSlideshow(modal) {
  const slides = modal.querySelectorAll('.slide');
  const dots = modal.querySelectorAll('.dot');
  const prevBtn = modal.querySelector('.prev');
  const nextBtn = modal.querySelector('.next');
  
  let slideIndex = 0;
  
  // Initialize first slide and dot
  if (slides.length > 0) {
    slides[0].classList.add('active');
  }
  if (dots.length > 0) {
    dots[0].classList.add('active-dot');
  }
  
  // Set click handlers for prev/next buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      changeSlide(-1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      changeSlide(1);
    });
  }
  
  // Set click handlers for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide(index);
    });
  });
  
  // Function to change slides
  function changeSlide(n) {
    showSlide(slideIndex += n);
  }
  
  // Function to set current slide
  function currentSlide(n) {
    showSlide(slideIndex = n);
  }
  
  // Function to show the slide
  function showSlide(n) {
    // Reset to first slide if past the end
    if (n >= slides.length) {
      slideIndex = 0;
    }
    
    // Go to last slide if before the beginning
    if (n < 0) {
      slideIndex = slides.length - 1;
    }
    
    // Remove active class from all slides and dots
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    dots.forEach(dot => {
      dot.classList.remove('active-dot');
    });
    
    // Add active class to current slide and dot
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active-dot');
  }
  
  // Auto advance slides every 5 seconds
  let slideInterval = setInterval(() => {
    changeSlide(1);
  }, 5000);
  
  // Pause auto-advance when hovering over slideshow
  const slideshowContainer = modal.querySelector('.slideshow-container');
  if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    slideshowContainer.addEventListener('mouseleave', () => {
      slideInterval = setInterval(() => {
        changeSlide(1);
      }, 5000);
    });
  }
}