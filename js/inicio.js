document.addEventListener('DOMContentLoaded', function() {
      const slides = document.querySelectorAll('.carousel-slide');
      const dots = document.querySelectorAll('.dot');
      const prevBtn = document.querySelector('.carousel-arrow.prev');
      const nextBtn = document.querySelector('.carousel-arrow.next');
      let currentSlide = 0;
      let autoSlideInterval;
      const autoSlideDelay = 5000; // 5 seconds

      // Function to show a specific slide
      function showSlide(index) {
        // Handle wrap around
        if (index >= slides.length) {
          currentSlide = 0;
        } else if (index < 0) {
          currentSlide = slides.length - 1;
        } else {
          currentSlide = index;
        }

        // Update slides
        slides.forEach((slide, i) => {
          slide.classList.remove('active');
          if (i === currentSlide) {
            slide.classList.add('active');
          }
        });

        // Update dots
        dots.forEach((dot, i) => {
          dot.classList.remove('active');
          if (i === currentSlide) {
            dot.classList.add('active');
          }
        });
      }

      // Next slide
      function nextSlide() {
        showSlide(currentSlide + 1);
      }

      // Previous slide
      function prevSlide() {
        showSlide(currentSlide - 1);
      }

      // Start auto sliding
      function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
      }

      // Stop auto sliding
      function stopAutoSlide() {
        clearInterval(autoSlideInterval);
      }

      // Reset auto slide timer
      function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
      }

      // Event listeners for arrows
      nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoSlide();
      });

      prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoSlide();
      });

      // Event listeners for dots
      dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
          showSlide(index);
          resetAutoSlide();
        });
      });

      // Pause on hover
      const carousel = document.querySelector('.carousel');
      carousel.addEventListener('mouseenter', stopAutoSlide);
      carousel.addEventListener('mouseleave', startAutoSlide);

      // Touch/swipe support for mobile
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
      }, { passive: true });

      carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
      }, { passive: true });

      function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
          } else {
            // Swipe right - previous slide
            prevSlide();
          }
        }
      }

      // Keyboard navigation
      document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          resetAutoSlide();
        }
      });

      // Start auto sliding
      startAutoSlide();
    });

(function () {
      const menuToggle = document.getElementById('menuToggle');
      const menuOverlay = document.getElementById('menuOverlay');
      const menuDrawer = menuOverlay.querySelector('.menu-drawer');
      const drawerClose = document.getElementById('drawerClose');
      const drawerLogout = document.getElementById('drawerLogout');
      const bipPersonasLink = document.getElementById('bipPersonasLink');

      function openMenu() {
        menuOverlay.classList.add('open');
        menuOverlay.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
      }

      function closeMenu() {
        menuOverlay.classList.remove('open');
        menuOverlay.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }

      menuToggle.addEventListener('click', function () {
        if (menuOverlay.classList.contains('open')) {
          closeMenu();
          return;
        }

        openMenu();
      });

      drawerClose.addEventListener('click', closeMenu);

      menuOverlay.addEventListener('click', function (event) {
        if (!menuDrawer.contains(event.target)) {
          closeMenu();
        }
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          closeMenu();
        }
      });

      fetch('session_status.php', { credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('No se pudo verificar la sesion');
          }
          return response.json();
        })
        .then(function (data) {
          if (!data.authenticated) {
            return;
          }

          drawerLogout.classList.add('visible');

          if (bipPersonasLink) {
            bipPersonasLink.classList.add('is-hidden');
          }
        })
        .catch(function () {
          // La home funciona igual aunque PHP o la sesion no esten disponibles.
        });
    })();
