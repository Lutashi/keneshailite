// Core UI functionality
// Star creation functions moved outside event handlers
function createStars() {
  const starsContainer = document.querySelector(".stars");
  if (!starsContainer) return;
  
  const starCount = 150;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // Random size (small stars look better)
    const size = Math.random() * 2 + 1;

    // Random movement speed and distance
    const moveSpeed = Math.random() * 10 + 5; // Between 5-15 seconds
    const moveDistance = Math.random() * 20 + 10; // Between 10-30 pixels

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animation = `starMove ${moveSpeed}s ease-in-out infinite`;
    star.style.animationDelay = `${Math.random() * 5}s`; // Random delay for more natural movement

    // Add the star to the container
    starsContainer.appendChild(star);
  }
}

function createStarLayers() {
  const starsContainer = document.querySelector(".stars");
  if (!starsContainer) return;
  
  const layers = 3;
  for (let layer = 1; layer <= layers; layer++) {
    const layerElement = document.createElement("div");
    layerElement.className = `star-layer star-layer-${layer}`;
    starsContainer.appendChild(layerElement);
  }
}

window.addEventListener("load", () => {
  // Remove loading class from HTML
  document.documentElement.classList.remove("loading");

  // Remove preloader after minimum display time
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    const minimumLoadingTime = 0;
    const startTime = Date.now();
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(minimumLoadingTime - elapsedTime, 0);
    
    setTimeout(() => {
      preloader.classList.add("hiding");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }, remainingTime);
  }

  // Create stars and layers
  createStarLayers();
  createStars();

  // Scroll animations for sections
  const sections = document.querySelectorAll("section");
  const options = {
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, options);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Enhanced FAQ
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const isActive = answer.classList.contains("active");

      document.querySelectorAll(".faq-answer").forEach((item) => {
        item.classList.remove("active");
      });

      if (!isActive) {
        answer.classList.add("active");
      }
    });
  });
  
  // Read More functionality for review cards
  initReadMoreButtons();
});

// Function to initialize Read More buttons
function initReadMoreButtons() {
  const readMoreButtons = document.querySelectorAll(".read-more-btn");
  
  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default button behavior
      
      const reviewContent = this.previousElementSibling;
      const isExpanded = reviewContent.classList.contains("expanded");
      const buttonText = this.querySelector("span");

      if (!isExpanded) {
        reviewContent.classList.add("expanded");
        buttonText.textContent = "Свернуть";
        this.classList.add("expanded");
      } else {
        reviewContent.classList.remove("expanded");
        buttonText.textContent = "Читать далее";
        this.classList.remove("expanded");
        
        // Scroll back to the top of the review card
        const reviewCard = this.closest('.review-card');
        if (reviewCard) {
          reviewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });
}

// Mentor Hover Animation
document.querySelectorAll(".mentor").forEach((mentor) => {
  mentor.addEventListener("mousemove", (e) => {
    const rect = mentor.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mentor.style.transform = `
      perspective(1000px)
      rotateX(${(y - rect.height / 2) / 10}deg)
      rotateY(${-(x - rect.width / 2) / 10}deg)
      translateY(-10px)
    `;
  });

  mentor.addEventListener("mouseleave", () => {
    mentor.style.transform = "translateY(-10px)";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  /*** Typed Text Animation ***/
  const typedTextSpan = document.querySelector(".typed-text");
  if (typedTextSpan) {
    const textArray = ["начинается здесь", "только с нами", "ждет вас"];
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent +=
          textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
      } else {
        setTimeout(erase, 1000);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(
          0,
          charIndex - 1
        );
        charIndex--;
        setTimeout(erase, 50);
      } else {
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, 500);
      }
    }

    if (textArray.length) {
      setTimeout(type, 1000);
    }
  }

  /*** Smooth Scroll for CTA Button ***/
  document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener("click", function (e) {
      const href = this.getAttribute('href');
      // Only prevent default for internal links (those starting with #)
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  /*** Starry Background Functions ***/
  // Create stars immediately when DOM is ready
  createStars();

  // Initialize read more buttons
  initReadMoreButtons();

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 100; // Adjust this value based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
  
  // Initialize burger menu functionality
  initBurgerMenu();

  // Horizontal scroll for reviews
  const reviewsGrid = document.querySelector('.reviews-grid');
  const scrollLeftBtn = document.querySelector('.scroll-arrow.scroll-left');
  const scrollRightBtn = document.querySelector('.scroll-arrow.scroll-right');
  
  if (reviewsGrid && scrollLeftBtn && scrollRightBtn) {
    // Calculate scroll distance (one review card + margin)
    const scrollDistance = 420; // Approximate width of card + gap
    
    // Scroll left button click
    scrollLeftBtn.addEventListener('click', function() {
      reviewsGrid.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
      });
    });
    
    // Scroll right button click
    scrollRightBtn.addEventListener('click', function() {
      reviewsGrid.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      });
    });
    
    // Highlight active navigation arrows based on scroll position
    reviewsGrid.addEventListener('scroll', function() {
      // Show/hide left arrow based on scroll position
      if (reviewsGrid.scrollLeft <= 10) {
        scrollLeftBtn.classList.add('disabled');
      } else {
        scrollLeftBtn.classList.remove('disabled');
      }
      
      // Show/hide right arrow based on whether we can scroll further right
      const maxScrollLeft = reviewsGrid.scrollWidth - reviewsGrid.clientWidth - 10;
      if (reviewsGrid.scrollLeft >= maxScrollLeft) {
        scrollRightBtn.classList.add('disabled');
      } else {
        scrollRightBtn.classList.remove('disabled');
      }
    });
    
    // Initialize arrow states
    reviewsGrid.dispatchEvent(new Event('scroll'));
    
    // Add drag scrolling for mobile
    let isDown = false;
    let startX;
    let scrollLeft;
    
    reviewsGrid.addEventListener('mousedown', (e) => {
      isDown = true;
      reviewsGrid.classList.add('active');
      startX = e.pageX - reviewsGrid.offsetLeft;
      scrollLeft = reviewsGrid.scrollLeft;
    });
    
    reviewsGrid.addEventListener('mouseleave', () => {
      isDown = false;
      reviewsGrid.classList.remove('active');
    });
    
    reviewsGrid.addEventListener('mouseup', () => {
      isDown = false;
      reviewsGrid.classList.remove('active');
    });
    
    reviewsGrid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - reviewsGrid.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      reviewsGrid.scrollLeft = scrollLeft - walk;
    });
  }
});

// Burger menu functionality
function initBurgerMenu() {
  const burgerButton = document.getElementById('open-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  let isMenuOpen = false;

  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent the click from reaching the document
      isMenuOpen = !isMenuOpen;
      
      if (isMenuOpen) {
        mobileMenu.classList.add('active');
        burgerButton.classList.add('active');
        mobileMenu.setAttribute('open', ''); // Add attribute for alternative style
      } else {
        mobileMenu.classList.remove('active');
        burgerButton.classList.remove('active');
        mobileMenu.removeAttribute('open'); // Remove attribute
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (isMenuOpen && !mobileMenu.contains(event.target) && !burgerButton.contains(event.target)) {
        mobileMenu.classList.remove('active');
        burgerButton.classList.remove('active');
        mobileMenu.removeAttribute('open');
        isMenuOpen = false;
      }
    });
  }

  // Close menu on orientation change
  window.addEventListener("orientationchange", function () {
    if (mobileMenu && (mobileMenu.classList.contains("active") || mobileMenu.hasAttribute('open'))) {
      burgerButton.classList.remove("active");
      mobileMenu.classList.remove("active");
      mobileMenu.removeAttribute('open');
      isMenuOpen = false;
    }
  });
}

// Call initBurgerMenu function outside DOMContentLoaded to ensure it runs on all pages
initBurgerMenu();

// Simplified notification system (useful for UI feedback)
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);
  notification.offsetHeight; // Trigger reflow
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add notification styles
const style = document.createElement("style");
style.textContent = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    background: rgba(26, 26, 46, 0.95);
    color: #E0E0E0;
    font-size: 1rem;
    transform: translateX(120%);
    transition: transform 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 0, 0.2);
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification.success {
    border-left: 4px solid #4CAF50;
  }
  
  .notification.error {
    border-left: 4px solid #f44336;
  }

  .notification.info {
    border-left: 4px solid #2196F3;
  }
`;
document.head.appendChild(style);

// WhatsApp Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const dots = Array.from(dotsNav.children);

    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange the slides next to one another
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('active');
        targetSlide.classList.add('active');
    }

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('active');
        targetDot.classList.add('active');
    }

    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (targetIndex === slides.length - 1) {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.remove('is-hidden');
        }
    }

    // Click handlers for next/prev buttons
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.active');
        const nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.active');
        const nextDot = currentDot.nextElementSibling;
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
    });

    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.active');
        const prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.active');
        const prevDot = currentDot.previousElementSibling;
        const prevIndex = slides.findIndex(slide => slide === prevSlide);

        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
        hideShowArrows(slides, prevButton, nextButton, prevIndex);
    });

    // Click handlers for dots
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const currentSlide = track.querySelector('.active');
        const currentDot = dotsNav.querySelector('.active');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
    });

    // Auto-advance carousel every 5 seconds
    let carouselInterval = setInterval(() => {
        const currentSlide = track.querySelector('.active');
        const nextSlide = currentSlide.nextElementSibling || slides[0];
        const currentDot = dotsNav.querySelector('.active');
        const nextDot = currentDot.nextElementSibling || dots[0];
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
    }, 5000);

    // Pause auto-advance on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    track.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            const currentSlide = track.querySelector('.active');
            const nextSlide = currentSlide.nextElementSibling || slides[0];
            const currentDot = dotsNav.querySelector('.active');
            const nextDot = currentDot.nextElementSibling || dots[0];
            const nextIndex = slides.findIndex(slide => slide === nextSlide);

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        }, 5000);
    });
});

// Read More Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reviewContent = this.previousElementSibling;
            const isExpanded = reviewContent.classList.contains('expanded');
            
            if (isExpanded) {
                reviewContent.classList.remove('expanded');
                this.querySelector('span').textContent = 'Читать далее';
            } else {
                reviewContent.classList.add('expanded');
                this.querySelector('span').textContent = 'Скрыть';
            }
        });
    });
});
