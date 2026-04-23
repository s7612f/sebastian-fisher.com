// GSAP ScrollTrigger Animations
// Professional scroll-triggered animations for sebastian-fisher.com

(function () {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Configuration
  const config = {
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15,
  };

  // Hero animations - immediate on load
  gsap.to('.hero .animate-fade-in', {
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out',
    delay: 0.2,
  });

  // Section headers - slide up on scroll
  gsap.utils.toArray('.section-head.animate-slide-up').forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: config.duration,
      ease: config.ease,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Cards - scale up with stagger
  gsap.utils.toArray('.card.animate-scale').forEach((card, index) => {
    gsap.to(card, {
      opacity: 1,
      scale: 1,
      duration: config.duration,
      ease: config.ease,
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      delay: index * config.stagger,
    });
  });

  // About section
  gsap.to('.about-copy.animate-slide-up', {
    opacity: 1,
    y: 0,
    duration: config.duration,
    ease: config.ease,
    scrollTrigger: {
      trigger: '.about-copy.animate-slide-up',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });

  gsap.to('.about-aside.animate-fade-in', {
    opacity: 1,
    duration: config.duration,
    ease: config.ease,
    scrollTrigger: {
      trigger: '.about-aside.animate-fade-in',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    delay: 0.2,
  });

  // Enquire form
  gsap.to('.enquire.animate-scale', {
    opacity: 1,
    scale: 1,
    duration: config.duration,
    ease: config.ease,
    scrollTrigger: {
      trigger: '.enquire.animate-scale',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });

  // Optional: Add parallax effect to hero texture (subtle)
  gsap.to('.hero-texture', {
    y: 100,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Optional: Header background fade on scroll
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { className: 'scrolled', targets: '.site-header' },
  });
})();
