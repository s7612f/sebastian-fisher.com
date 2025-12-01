const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('nav-list');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navList.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
