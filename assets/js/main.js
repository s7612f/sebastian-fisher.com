/* ============ Hard Film Studios ============ */

const PACKAGES = [
  {
    id: "brand-video", name: "Brand Video Ad", from: 850, to: 1500,
    desc: "60-90 second brand or product film. Full production: concept, shoot, edit, colour grade, sound mix.",
    features: ["All formats: web, social and broadcast", "Concept & shot list included", "7 working day turnaround"],
    featured: true, tag: "Most popular"
  },
  {
    id: "single-reel", name: "Single Reel", from: 150,
    desc: "One 15-30 second vertical reel, shot in a two hour session and edited to platform standard. The easiest way to try us out.",
    features: ["Two hour shoot", "Vertical, square and story exports", "48 hour delivery"],
    tag: "Social"
  },
  {
    id: "social-pack", name: "Social Media Content Pack", from: 550, to: 900,
    desc: "3-5 short-form videos (15-30s) optimised for Reels, TikTok and Facebook. A month of content in one shoot day.",
    features: ["Shot in one day", "Vertical + square exports", "Delivered within 5 days"],
    tag: "Social"
  },
  {
    id: "content-day", name: "Social Content Day", from: 850, to: 1100,
    desc: "A full day of shooting across your business, edited into 8-10 platform-ready reels. Six weeks of posting from one booking.",
    features: ["8-10 edited reels", "Captions and cover frames included", "Delivered within 7 days"],
    tag: "Social"
  },
  {
    id: "social-retainer", name: "Social Retainer", from: 650, per: "/month",
    desc: "A half-day shoot every month plus 4-6 edited reels, planned around your offers and events. Consistent presence without the admin.",
    features: ["Monthly half-day shoot", "4-6 reels per month", "Content calendar included"],
    tag: "Social"
  },
  {
    id: "event-video", name: "Event & Launch Video", from: 650, to: 1200,
    desc: "Full event coverage with multi-camera setup. Corporate events, product launches, venue openings.",
    features: ["Multi-camera coverage", "Highlight reel + full edit", "Delivered within 5 days"]
  },
  {
    id: "testimonial", name: "Testimonial Package", from: 450, to: 700,
    desc: "2-3 professionally shot customer testimonials. The highest-converting video content for most businesses.",
    features: ["Single session shoot", "Pro lighting & clean audio", "Colour graded"]
  },
  {
    id: "retainer", name: "Monthly Retainer", from: 850, to: 1500, per: "/month",
    desc: "2 dedicated shoot days per month plus editing. Consistent output without a full-time hire.",
    features: ["2 shoot days every month", "Priority scheduling", "Rolling social content"]
  },
  {
    id: "photo-half", name: "Event Photography (Half Day)", from: 275,
    desc: "Up to 4 hours coverage. Corporate events, launches, parties, competitions.",
    features: ["150+ edited photos", "Online gallery", "48 hour delivery"]
  },
  {
    id: "photo-full", name: "Event Photography (Full Day)", from: 475,
    desc: "Up to 8 hours coverage, from setup to send-off.",
    features: ["300+ edited photos", "Online gallery", "48 hour delivery"]
  }
];

const SECTORS = [
  {
    id: "gym-starter", name: "Gym Starter Pack", price: 795, video: "assets/media/52088.mp4", poster: "assets/media/52088.jpg",
    desc: "One shoot day: a 60s brand film for your site and ads, 3 vertical reels for socials, and 10 edited stills. Everything a gym needs to look serious online."
  },
  {
    id: "restaurant-showcase", name: "Restaurant Showcase", price: 795, video: "assets/media/13258.mp4", poster: "assets/media/13258.jpg",
    desc: "One evening shoot: venue film, food b-roll, 3 social reels and 10 edited stills. Shot around service without disrupting it."
  }
];

const ADDONS = [
  { id: "drone", name: "Drone footage", price: 150, desc: "Licensed aerial establishing shots." },
  { id: "rush", name: "Rush 72-hour delivery", price: 200, desc: "Jump the edit queue." },
  { id: "cutdown", name: "Extra social cutdowns", price: 75, desc: "Additional 15-30s edits from your footage.", qty: true },
  { id: "second-op", name: "Second camera operator", price: 250, desc: "Dual-angle coverage for events & interviews." },
  { id: "photos-addon", name: "Stills alongside video", price: 150, desc: "20+ edited photos captured on your video shoot day." },
  { id: "extra-location", name: "Additional location", price: 100, desc: "Second venue or outdoor location on the same day." },
  { id: "voiceover", name: "Professional voiceover", price: 120, desc: "Voice casting, direction and licensing." },
  { id: "script", name: "Scripting & storyboard", price: 150, desc: "Full pre-production written for you." },
  { id: "captions", name: "Subtitles & captions", price: 40, desc: "Burned-in or sidecar files for accessibility & sound-off viewing." },
  { id: "raw", name: "Raw footage delivery", price: 100, desc: "Every frame we shoot, handed over." }
];

const gbp = n => "£" + n.toLocaleString("en-GB");

/* ---------- render packages ---------- */
const pkgGrid = document.getElementById("packagesGrid");
pkgGrid.innerHTML = PACKAGES.map(p => `
  <article class="pkg ${p.featured ? "pkg--featured" : ""}">
    ${p.tag ? `<span class="pkg__tag">${p.tag}</span>` : ""}
    <h3>${p.name}</h3>
    <div class="pkg__price">from ${gbp(p.from)}${p.per || ""} ${p.to ? `<small>typical range ${gbp(p.from)} to ${gbp(p.to)}</small>` : ""}</div>
    <p class="pkg__desc">${p.desc}</p>
    <ul>${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
    <button class="btn btn--primary" data-add="${p.id}">Add to basket</button>
  </article>`).join("");

/* ---------- render sectors ---------- */
document.getElementById("sectorsGrid").innerHTML = SECTORS.map(s => `
  <article class="sector">
    <video muted loop playsinline autoplay preload="metadata" poster="${s.poster}"><source src="${s.video}" type="video/mp4"></video>
    <div class="sector__body">
      <h3>${s.name}</h3>
      <div class="sector__price">${gbp(s.price)} <small style="font-size:.8rem;color:var(--muted)">one shoot day, launch rate</small></div>
      <p>${s.desc}</p>
      <button class="btn btn--primary" data-add="${s.id}">Add to basket</button>
    </div>
  </article>`).join("");

/* every addable item, unified */
const CATALOGUE = {};
PACKAGES.forEach(p => CATALOGUE[p.id] = { name: p.name, price: p.from, note: p.per ? `${gbp(p.from)}${p.per}` : (p.to ? `from ${gbp(p.from)}` : "fixed price") });
SECTORS.forEach(s => CATALOGUE[s.id] = { name: s.name, price: s.price, note: "launch rate" });

/* ---------- basket ---------- */
const KEY = "hfs-basket";
let basket = [];
try { basket = JSON.parse(localStorage.getItem(KEY)) || []; } catch { basket = []; }

const basketCount = document.getElementById("basketCount");
const basketItems = document.getElementById("basketItems");
const basketTotal = document.getElementById("basketTotal");
const basketEnquire = document.getElementById("basketEnquire");

function saveBasket() { localStorage.setItem(KEY, JSON.stringify(basket)); renderBasket(); }

function basketSummaryText() {
  const lines = basket.map(i => `• ${i.name}${i.detail ? ", " + i.detail : ""} (${gbp(i.price)})`);
  const total = basket.reduce((s, i) => s + i.price, 0);
  return `Hi Sebastian,\n\nI'd like to enquire about the following:\n\n${lines.join("\n")}\n\nEstimated total: ${gbp(total)}\n\nMy name:\nMy business:\nBest time to call:\n`;
}

function renderBasket() {
  basketCount.textContent = basket.length;
  const total = basket.reduce((s, i) => s + i.price, 0);
  basketTotal.textContent = gbp(total);
  basketItems.innerHTML = basket.length
    ? basket.map((i, idx) => `
        <li><div><strong>${i.name}</strong>${i.detail ? `<em>${i.detail}</em>` : ""}<em>${gbp(i.price)}</em></div>
        <button class="rm" data-rm="${idx}" aria-label="Remove">✕</button></li>`).join("")
    : `<li style="border:none;background:none;color:var(--muted)">Your basket is empty. Add a package or build a quote.</li>`;
  basketEnquire.href = "mailto:contact@sebastian-fisher.com?subject=" +
    encodeURIComponent("Booking enquiry: Hard Film Studios") +
    "&body=" + encodeURIComponent(basketSummaryText());
}

function addToBasket(item) {
  basket.push(item);
  saveBasket();
  toast(`Added: ${item.name}`);
}

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) {
    const c = CATALOGUE[add.dataset.add];
    addToBasket({ name: c.name, price: c.price, detail: c.note });
  }
  const rm = e.target.closest("[data-rm]");
  if (rm) { basket.splice(+rm.dataset.rm, 1); saveBasket(); }
});

/* drawer */
const openDrawer = () => document.body.classList.add("drawer-open");
const closeDrawer = () => document.body.classList.remove("drawer-open");
document.getElementById("basketOpen").addEventListener("click", openDrawer);
document.getElementById("basketOpen2").addEventListener("click", openDrawer);
document.getElementById("basketClose").addEventListener("click", closeDrawer);
document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);
document.getElementById("basketClear").addEventListener("click", () => { basket = []; saveBasket(); });
document.getElementById("basketCopy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(basketSummaryText());
  toast("Basket summary copied. Paste it anywhere.");
});

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("toast--show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("toast--show"), 2200);
}

/* ---------- quote builder ---------- */
const qServices = document.getElementById("quoteServices");
const qAddons = document.getElementById("quoteAddons");

qServices.innerHTML = [...PACKAGES.map(p => ({ id: p.id, name: p.name, price: p.from, desc: p.desc, suffix: p.per })),
  ...SECTORS.map(s => ({ id: s.id, name: s.name, price: s.price, desc: s.desc }))].map(p => `
  <label class="opt" data-opt="${p.id}">
    <input type="checkbox" data-qsvc="${p.id}" data-price="${p.price}">
    <div class="opt__body"><strong>${p.name}</strong><span>${p.desc}</span></div>
    <span class="opt__price">from ${gbp(p.price)}${p.suffix || ""}</span>
  </label>`).join("");

qAddons.innerHTML = ADDONS.map(a => `
  <label class="opt" data-opt="${a.id}">
    <input type="checkbox" data-qadd="${a.id}" data-price="${a.price}">
    <div class="opt__body"><strong>${a.name}</strong><span>${a.desc}</span>
      ${a.qty ? `<div class="opt__qty" hidden><button type="button" data-minus>−</button><span data-qty>1</span><button type="button" data-plus>+</button></div>` : ""}
    </div>
    <span class="opt__price">+${gbp(a.price)}${a.qty ? " each" : ""}</span>
  </label>`).join("");

const quoteLines = document.getElementById("quoteLines");
const quoteTotal = document.getElementById("quoteTotal");
const quoteToBasket = document.getElementById("quoteToBasket");

function quoteState() {
  const lines = [];
  document.querySelectorAll("[data-qsvc]:checked").forEach(cb => {
    const opt = cb.closest(".opt");
    lines.push({ name: opt.querySelector("strong").textContent, price: +cb.dataset.price });
  });
  document.querySelectorAll("[data-qadd]:checked").forEach(cb => {
    const opt = cb.closest(".opt");
    const qtyEl = opt.querySelector("[data-qty]");
    const qty = qtyEl ? +qtyEl.textContent : 1;
    lines.push({ name: opt.querySelector("strong").textContent + (qty > 1 ? ` ×${qty}` : ""), price: +cb.dataset.price * qty });
  });
  return lines;
}

function renderQuote() {
  const lines = quoteState();
  document.querySelectorAll(".opt").forEach(o => {
    const cb = o.querySelector("input");
    o.classList.toggle("opt--on", cb.checked);
    const qty = o.querySelector(".opt__qty");
    if (qty) qty.hidden = !cb.checked;
  });
  const total = lines.reduce((s, l) => s + l.price, 0);
  quoteLines.innerHTML = lines.length
    ? lines.map(l => `<li><span>${l.name}</span><span>${gbp(l.price)}</span></li>`).join("")
    : `<li class="quote__empty">Nothing selected yet. Tick a package to start.</li>`;
  quoteTotal.textContent = gbp(total);
  quoteToBasket.disabled = !lines.length;
}

document.getElementById("quote").addEventListener("change", renderQuote);
document.getElementById("quote").addEventListener("click", e => {
  if (e.target.matches("[data-plus],[data-minus]")) {
    e.preventDefault();
    const qtyEl = e.target.closest(".opt__qty").querySelector("[data-qty]");
    let q = +qtyEl.textContent + (e.target.matches("[data-plus]") ? 1 : -1);
    qtyEl.textContent = Math.max(1, Math.min(10, q));
    renderQuote();
  }
});

quoteToBasket.addEventListener("click", () => {
  const lines = quoteState();
  const total = lines.reduce((s, l) => s + l.price, 0);
  addToBasket({ name: "Custom quote", price: total, detail: lines.map(l => l.name).join(" + ") });
  document.querySelectorAll("#quote input:checked").forEach(cb => (cb.checked = false));
  renderQuote();
  openDrawer();
});

/* ---------- work grid: filters + hover play ---------- */
document.getElementById("workFilters").addEventListener("click", e => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  document.querySelectorAll("#workFilters .chip").forEach(c => c.classList.remove("chip--active"));
  btn.classList.add("chip--active");
  const f = btn.dataset.filter;
  document.querySelectorAll(".work__item").forEach(item => {
    item.classList.toggle("work__item--hidden", f !== "all" && !item.dataset.cat.split(" ").includes(f));
  });
});

document.querySelectorAll(".work__item").forEach(item => {
  const v = item.querySelector("video");
  item.addEventListener("mouseenter", () => { v.play().catch(() => {}); });
  item.addEventListener("mouseleave", () => { v.pause(); });
  item.addEventListener("click", () => { v.paused ? v.play().catch(() => {}) : v.pause(); });
});

/* ---------- mobile nav ---------- */
const navLinks = document.getElementById("navLinks");
document.getElementById("navToggle").addEventListener("click", () => navLinks.classList.toggle("nav__links--open"));
navLinks.addEventListener("click", () => navLinks.classList.remove("nav__links--open"));

renderBasket();
renderQuote();
