// ============================================================
// TNI STORE — app.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Footer year ────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ── Navbar scroll shrink + hide on scroll down ──────────────
  const navbar = document.getElementById('mainNavbar');
  const siteHeader = navbar ? navbar.closest('header') : null;

  // Because header is position:fixed, offset body so content isn't hidden under it
  function setHeaderOffset() {
    if (siteHeader) {
      const h = siteHeader.getBoundingClientRect().height;
      document.body.style.paddingTop = h + 'px';
    }
  }
  setHeaderOffset();
  window.addEventListener('resize', setHeaderOffset, { passive: true });

  if (navbar && siteHeader) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      // Compact navbar when past 60px
      navbar.classList.toggle('scrolled', currentScrollY > 60);

      // Hide on scroll DOWN (past 120px), show on scroll UP
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY) {
          siteHeader.classList.add('navbar--hidden');    // scrolling down → hide
        } else {
          siteHeader.classList.remove('navbar--hidden'); // scrolling up → show
        }
      } else {
        siteHeader.classList.remove('navbar--hidden');   // near top → always show
      }

      lastScrollY = currentScrollY;
    }, { passive: true });
  }


  // ── Dropdown Menu Toggle ────────────────────────────────────
  const catBtn = document.getElementById('categoriesDropdown');
  if (catBtn) {
    catBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = document.getElementById('catDropdownPanel');
      if (menu) {
        const isShown = menu.classList.contains('show');
        if (isShown) {
          menu.classList.remove('show');
          catBtn.setAttribute('aria-expanded', 'false');
        } else {
          menu.classList.add('show');
          catBtn.setAttribute('aria-expanded', 'true');
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!catBtn.contains(e.target)) {
        const menu = document.getElementById('catDropdownPanel');
        if (menu && menu.classList.contains('show')) {
          menu.classList.remove('show');
          catBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }


  // ── Hero Section Swiper ─────────────────────────────────────
  if (typeof Swiper !== 'undefined' && document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.hero-swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '#heroNextBtn',
        prevEl: '#heroPrevBtn',
      },
      effect: 'slide',
    });
  }


  // ── Brands Swiper (Continuous Marquee, pause on hover) ─────────
  if (typeof Swiper !== 'undefined' && document.querySelector('.brands-swiper')) {
    new Swiper('.brands-swiper', {
      loop: true,
      speed: 4500,
      slidesPerView: 2,
      spaceBetween: 20,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      allowTouchMove: true,
      grabCursor: true,
      breakpoints: {
        480: { slidesPerView: 3, spaceBetween: 25 },
        768: { slidesPerView: 4, spaceBetween: 35 },
        992: { slidesPerView: 5, spaceBetween: 45 },
        1200: { slidesPerView: 6, spaceBetween: 50 },
      },
    });
  }


  // ── Testimonials Swiper ─────────────────────────────────────
  if (typeof Swiper !== 'undefined' && document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      loop: true,
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '#testiNextBtn',
        prevEl: '#testiPrevBtn',
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 30 },
        992: { slidesPerView: 3, spaceBetween: 30 },
      }
    });
  }


  // ── Deals of the Day — Countdown Timer ─────────────────────
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  if (hoursEl && minutesEl && secondsEl) {
    const now = new Date();
    const dealEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59, 0
    );

    if (now >= dealEnd) {
      dealEnd.setDate(dealEnd.getDate() + 1);
    }

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    function updateCountdown() {
      const diff = dealEnd - Date.now();
      if (diff <= 0) {
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }


  // ── Cart button feedback ────────────────────────────────────
  const cartButtons = document.querySelectorAll('.add-to-cart-btn, [id^="cart-deal"]');
  cartButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const originalHTML = this.innerHTML;
      this.innerHTML = '<i class="ri-check-line"></i> Added!';
      this.disabled = true;
      this.classList.add('btn-success');
      this.classList.remove('btn-primary', 'btn-secondary');
      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.disabled = false;
        this.classList.remove('btn-success');
        const isPrimary = this.classList.contains('add-to-cart-btn');
        this.classList.add(isPrimary ? 'btn-primary' : 'btn-secondary');
      }, 2000);
    });
  });


  // ── Wishlist button toggle ──────────────────────────────────
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const icon = this.querySelector('i');
      if (this.classList.contains('liked')) {
        this.classList.remove('liked');
        if (icon) icon.className = 'ri-heart-line';
      } else {
        this.classList.add('liked');
        if (icon) icon.className = 'ri-heart-fill';
      }
    });
  });


  // ── Newsletter form ─────────────────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const btn = document.getElementById('newsletterBtn');
      if (emailInput && emailInput.value.includes('@')) {
        btn.innerHTML = '<i class="ri-checkbox-circle-line"></i> Subscribed!';
        btn.disabled = true;
        emailInput.disabled = true;
        emailInput.value = '';
      } else {
        emailInput.style.outline = '2px solid #ef4444';
        emailInput.placeholder = 'Please enter a valid email…';
        setTimeout(() => {
          emailInput.style.outline = '';
          emailInput.placeholder = 'Enter your email address…';
        }, 2500);
      }
    });
  }


  // ── Smooth scroll for anchor links ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetStr = this.getAttribute('href');
      if (targetStr === '#') return;
      const target = document.querySelector(targetStr);
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetY = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

}); // end DOMContentLoaded


// ── Footer: Toggle More Categories (global function) ─────────
function toggleFooterCats() {
  const hiddenItems = document.querySelectorAll('.footer-more-cats');
  const btn = document.getElementById('footerMoreCatsBtn');
  if (!hiddenItems.length) return;
  const isExpanded = !hiddenItems[0].classList.contains('d-none');
  hiddenItems.forEach(el => el.classList.toggle('d-none', isExpanded));
  if (btn) {
    btn.innerHTML = isExpanded
      ? '<i class="ri-add-line me-1"></i>More Categories'
      : '<i class="ri-subtract-line me-1"></i>Show Less';
  }
}
