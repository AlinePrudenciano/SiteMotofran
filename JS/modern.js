// ============================================
// MotoFran Express — Modern JS
// Minimal, performant interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');

  function getPreferredTheme() {
    const saved = localStorage.getItem('motofran-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('motofran-theme', theme);
  }

  // Init theme
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('motofran-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // Scroll animations (IntersectionObserver)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  // Observe elements for fade-in animation
  const animateElements = document.querySelectorAll(
    '.service-card, .feature, .about-content, .contact-grid, .cta-content, .section__header, .stats-grid, .team-card, .stat'
  );

  animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Nav scroll effect (transparent → solid with blur)
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Contact form AJAX submit
  const contactForm = document.getElementById('contactForm');
  const contactBtn = document.getElementById('contactBtn');

  if (contactForm && contactBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Disable button and show sending state
      contactBtn.disabled = true;
      contactBtn.textContent = 'Enviando...';

      const formData = new FormData(contactForm);

      fetch('https://formsubmit.co/ajax/motofranexpress@hotmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
      .then(response => {
        if (response.ok) {
          contactBtn.textContent = 'Enviado!';
          contactBtn.style.backgroundColor = '#25d366';
          contactForm.reset();

          // Reset button after 4 seconds
          setTimeout(() => {
            contactBtn.disabled = false;
            contactBtn.textContent = 'Enviar mensagem';
            contactBtn.style.backgroundColor = '';
          }, 4000);
        } else {
          throw new Error('Erro no envio');
        }
      })
      .catch(() => {
        contactBtn.textContent = 'Erro. Tente novamente.';
        contactBtn.style.backgroundColor = '#e53e3e';

        setTimeout(() => {
          contactBtn.disabled = false;
          contactBtn.textContent = 'Enviar mensagem';
          contactBtn.style.backgroundColor = '';
        }, 3000);
      });
    });
  }
});
