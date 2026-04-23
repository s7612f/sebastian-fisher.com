// Smooth scroll with header offset
(function () {
  const header = document.querySelector('.site-header');
  const headerHeight = () => (header ? header.offsetHeight : 0);

  function smoothScrollTo(target) {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const top = window.pageYOffset + rect.top - headerHeight() - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id.length === 1) return; // just '#'
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      smoothScrollTo(target);
    }
  });

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  // Placeholder enquiry submission
  const form = document.getElementById('enquire-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = /** @type {HTMLInputElement} */ (form.querySelector('#name'))?.value?.trim();
      form.reset();
      const msg = name ? `Thanks${name ? ", " + name : ''}. I’ll reply shortly.` : 'Thanks. I’ll reply shortly.';
      // Lightweight toast
      const toast = document.createElement('div');
      toast.textContent = msg;
      toast.style.position = 'fixed';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.bottom = '24px';
      toast.style.padding = '12px 16px';
      toast.style.borderRadius = '12px';
      toast.style.background = 'rgba(43,43,43,0.95)';
      toast.style.color = 'white';
      toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      toast.style.zIndex = '999';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2600);
    });
  }
})();

