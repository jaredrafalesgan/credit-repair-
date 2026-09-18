(function(){
  "use strict";

  // Sticky header shadow on scroll
  var header = document.getElementById('site-header');
  function onScroll(){
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', function(){
    var isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll-triggered reveal animations
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ observer.observe(el); });
  }

  // Hero background video: respect reduced motion, and fall back gracefully
  // to the dark gradient background if autoplay/decoding is blocked.
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    if (reduceMotion) {
      heroVideo.pause();
    } else {
      heroVideo.play().catch(function(){
        heroVideo.style.display = 'none';
      });
      heroVideo.addEventListener('error', function(){
        heroVideo.style.display = 'none';
      });
    }
  }

  // Subtle hero video parallax on scroll
  if (heroVideo && !reduceMotion) {
    var heroSection = document.getElementById('top');
    window.addEventListener('scroll', function(){
      var offset = Math.min(window.scrollY * 0.15, 60);
      if (heroSection && window.scrollY < heroSection.offsetHeight) {
        heroVideo.style.transform = 'translateY(' + offset + 'px)';
      }
    }, { passive: true });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form (no backend wired up yet — placeholder confirmation only)
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      status.textContent = "Thanks — your request was received. We'll be in touch soon.";
      form.reset();
    });
  }
})();
