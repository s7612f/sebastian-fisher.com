/* ============================================================
   SEBASTIAN FISHER — main.js
   No frameworks. No dependencies. Just iron.
   ============================================================ */

/* --- HIT COUNTER ---
   Starts at 1101, increments once per session via localStorage.
   Grows naturally with each unique visitor session.
   ---------------------------------------------------------------- */
(function () {
  var SEED = 1101;
  var stored = parseInt(localStorage.getItem('ig_hits') || '0', 10);
  if (!stored || stored < SEED) stored = SEED;
  if (!sessionStorage.getItem('ig_counted')) {
    stored += 1;
    localStorage.setItem('ig_hits', stored);
    sessionStorage.setItem('ig_counted', '1');
  }
  var el = document.getElementById('hit-counter');
  if (el) el.textContent = String(stored).padStart(6, '0');
})();


/* --- PEOPLE ONLINE WIDGET ---
   Floor of 19, grows naturally with small random variation.
   ---------------------------------------------------------------- */
(function () {
  var count = 19 + Math.floor(Math.random() * 5);
  var el = document.getElementById('people-online');
  if (el) el.textContent = count;
})();


/* --- DARK / LIGHT MODE TOGGLE ---
   Follows system preference by default (via CSS prefers-color-scheme).
   Manual toggle overrides system setting and persists in localStorage.
   ---------------------------------------------------------------- */
function toggleMagMode() {
  var body = document.body;
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var isDark = body.classList.contains('mag-mode') || (systemDark && !body.classList.contains('force-light'));

  if (isDark) {
    body.classList.remove('mag-mode');
    body.classList.add('force-light');
    localStorage.setItem('ig_magmode', 'light');
  } else {
    body.classList.remove('force-light');
    body.classList.add('mag-mode');
    localStorage.setItem('ig_magmode', 'dark');
  }

  var btn = document.getElementById('mag-toggle');
  var nowDark = body.classList.contains('mag-mode') || (systemDark && !body.classList.contains('force-light'));
  if (btn) btn.textContent = nowDark ? '[ LIGHT MODE ]' : '[ DARK MODE ]';
}

// Restore saved preference on load
(function () {
  var saved = localStorage.getItem('ig_magmode');
  var btn = document.getElementById('mag-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'dark') {
    document.body.classList.add('mag-mode');
    if (btn) btn.textContent = '[ LIGHT MODE ]';
  } else if (saved === 'light') {
    document.body.classList.add('force-light');
    if (btn) btn.textContent = '[ DARK MODE ]';
  } else {
    // No saved preference — follow system
    if (btn) btn.textContent = systemDark ? '[ LIGHT MODE ]' : '[ DARK MODE ]';
  }
})();


/* --- IRON WISDOM QUOTE ROTATOR ---
   Rotates quotes in any element with id="iron-wisdom-quote".
   ---------------------------------------------------------------- */
(function () {
  var quotes = [
    { q: 'The mind is the limit. As long as the mind can envision the fact that you can do something, you can do it.', a: 'Arnold Schwarzenegger' },
    { q: 'It never gets easier. You just get stronger.', a: 'Unknown' },
    { q: 'The last three or four reps is what makes the muscle grow.', a: 'Arnold Schwarzenegger' },
    { q: 'Pain is temporary. Quitting lasts forever.', a: 'Lance Armstrong' },
    { q: 'The iron never lies to you.', a: 'Henry Rollins' },
    { q: 'Strength does not come from winning. Your struggles develop your strengths.', a: 'Arnold Schwarzenegger' },
    { q: 'There are no shortcuts. Everything is reps, reps, reps.', a: 'Arnold Schwarzenegger' },
    { q: 'A champion is someone who gets up when they can\'t.', a: 'Jack Dempsey' },
    { q: 'To be a champion, you must act like one.', a: 'Lou Ferrigno' },
    { q: 'Blood, sweat, and respect. First two you give. Last one you earn.', a: 'Dwayne Johnson' },
    { q: 'Success is usually the culmination of controlling failure.', a: 'Sylvester Stallone' },
    { q: 'Train insane or remain the same.', a: 'Unknown' },
    { q: 'I don\'t count my sit-ups. I only start counting when it starts hurting.', a: 'Muhammad Ali' },
    { q: 'Bodybuilding is much like any other sport. To be successful, you must dedicate yourself 100% to your training, diet and mental approach.', a: 'Arnold Schwarzenegger' },
    { q: 'You must expect great things of yourself before you can do them.', a: 'Michael Jordan' },
    { q: 'If it doesn\'t challenge you, it won\'t change you.', a: 'Fred DeVito' },
  ];

  var el = document.getElementById('iron-wisdom-quote');
  if (!el) return;

  var idx = Math.floor(Math.random() * quotes.length);
  var q = quotes[idx];
  el.innerHTML = '&ldquo;' + q.q + '&rdquo;<div style="font-size:0.7em;color:var(--fg-dim);text-align:right;margin-top:4px;">— ' + q.a + '</div>';
})();


/* --- GLITCH EFFECT ---
   Applied to any element with class="glitch" and data-text attribute.
   Flickers the text randomly for a CRT feel.
   ---------------------------------------------------------------- */
(function () {
  var glitches = document.querySelectorAll('.glitch');
  if (!glitches.length) return;

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function glitchElement(el) {
    var original = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', original);
    var len = original.length;
    var steps = 0;
    var maxSteps = 8;
    var interval = setInterval(function () {
      if (steps >= maxSteps) {
        el.textContent = original;
        clearInterval(interval);
        return;
      }
      var scrambled = '';
      for (var i = 0; i < len; i++) {
        if (original[i] === ' ') { scrambled += ' '; continue; }
        scrambled += Math.random() < 0.3 ? randomChar() : original[i];
      }
      el.textContent = scrambled;
      steps++;
    }, 60);
  }

  glitches.forEach(function (el) {
    el.addEventListener('mouseenter', function () { glitchElement(el); });
    // Also fire on page load once for main title
    if (el.closest('.site-header')) {
      setTimeout(function () { glitchElement(el); }, 800);
    }
  });
})();


/* --- SIDEBAR QUICK CALC (index.html) ---
   Inline TDEE estimate for sidebar widget.
   ---------------------------------------------------------------- */
function quickCalc() {
  var weightEl = document.getElementById('q-weight');
  var goalEl   = document.getElementById('q-goal');
  var resultEl = document.getElementById('q-result');
  if (!weightEl || !goalEl || !resultEl) return;

  var weight = parseFloat(weightEl.value);
  if (!weight || weight < 30 || weight > 300) {
    resultEl.textContent = 'Enter a valid weight.';
    return;
  }

  // Very rough estimate: bodyweight × multiplier
  var multipliers = { cut: 27, maintain: 32, bulk: 37 };
  var goal = goalEl.value || 'maintain';
  var kcal = Math.round(weight * (multipliers[goal] || 32));
  var protein = Math.round(weight * 2.2);

  resultEl.innerHTML =
    'CALORIES: <strong>' + kcal + ' kcal</strong><br>' +
    'PROTEIN:  <strong>' + protein + 'g</strong><br>' +
    '<a href="calculator.html" style="font-size:0.8em;">Full calc &rarr;</a>';
}


/* --- VAULT: JUKEBOX ---
   Injects a YouTube iframe into #jukebox-player on track click.
   ---------------------------------------------------------------- */
var jukeboxTracks = [
  { title: 'Eye of the Tiger',        artist: 'Survivor',          yt: 'btPJPFnesV4' },
  { title: 'Back in Black',           artist: 'AC/DC',             yt: 'pAgnJDJN4VA' },
  { title: 'TNT',                     artist: 'AC/DC',             yt: 'TNHGRkn3hYo' },
  { title: 'Gonna Fly Now (Rocky)',   artist: 'Bill Conti',        yt: 'I_3YWBiEjTg' },
  { title: 'Born to Be Wild',         artist: 'Steppenwolf',       yt: 'p-W4FVZH-hI' },
  { title: 'Welcome to the Jungle',   artist: 'Guns N\' Roses',    yt: 'o1tj2zJ2Wvg' },
  { title: 'Hell\'s Bells',           artist: 'AC/DC',             yt: 'etAIpkdhU9Q' },
  { title: 'Thunderstruck',           artist: 'AC/DC',             yt: 'v2AC41dglnM' },
  { title: 'We Will Rock You',        artist: 'Queen',             yt: '-tJYN-eG1zk' },
  { title: 'Gonna Fly Now (Full)',     artist: 'Rocky Soundtrack',  yt: 'I_3YWBiEjTg' },
];

function playTrack(idx) {
  var player = document.getElementById('jukebox-player');
  if (!player) return;
  var track = jukeboxTracks[idx];
  if (!track) return;

  // Highlight active track
  var items = document.querySelectorAll('.track-item');
  items.forEach(function (el) { el.classList.remove('active'); });
  var active = document.querySelector('.track-item[data-idx="' + idx + '"]');
  if (active) active.classList.add('active');

  // Inject iframe
  player.innerHTML =
    '<div style="font-size:0.8em;color:var(--fg-dim);margin-bottom:6px;">NOW PLAYING: ' +
    track.title.toUpperCase() + ' — ' + track.artist.toUpperCase() + '</div>' +
    '<iframe width="100%" height="80" src="https://www.youtube.com/embed/' + track.yt +
    '?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
}


/* --- VAULT: ARTICLE TOGGLE ---
   Expand/collapse article sections.
   ---------------------------------------------------------------- */
function toggleArticle(id) {
  var body = document.getElementById('article-' + id);
  var btn  = document.getElementById('toggle-' + id);
  if (!body) return;

  var open = body.style.display !== 'none' && body.style.display !== '';

  if (open) {
    body.style.display = 'none';
    if (btn) btn.textContent = '[ READ MORE ]';
  } else {
    body.style.display = 'block';
    if (btn) btn.textContent = '[ COLLAPSE ]';
  }
}

// Collapse all on load
(function () {
  var bodies = document.querySelectorAll('[id^="article-"]');
  bodies.forEach(function (el) { el.style.display = 'none'; });
})();


/* --- NUTRITION: TAB SWITCHER ---
   ---------------------------------------------------------------- */
function showTab(name) {
  var tabs = document.querySelectorAll('.diet-tab');
  var btns = document.querySelectorAll('.tab-btn');

  tabs.forEach(function (t) {
    t.style.display = t.id === 'tab-' + name ? 'block' : 'none';
  });
  btns.forEach(function (b) {
    b.classList.toggle('active', b.getAttribute('data-tab') === name);
  });
}

// Init first tab
(function () {
  var first = document.querySelector('.tab-btn');
  if (first) showTab(first.getAttribute('data-tab'));
})();


/* --- CALCULATOR PAGE ---
   Calculator functions are defined inline in calculator.html
   (they reference page-specific element IDs).
   ---------------------------------------------------------------- */


/* --- THE STACK: SHUFFLE CATEGORY SECTIONS ON LOAD ---
   Shuffles .stack-section divs inside #stack-shuffle-wrap each page load.
   Category headers stay with their products — only section order changes.
   ---------------------------------------------------------------- */
(function () {
  var wrap = document.getElementById('stack-shuffle-wrap');
  if (!wrap) return;
  var sections = Array.from(wrap.querySelectorAll('.stack-section'));
  if (sections.length < 2) return;
  // Fisher-Yates shuffle — swap sections in DOM
  for (var i = sections.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    // insertBefore handles both cases (i > j and i < j) correctly
    var a = sections[i], b = sections[j];
    var aNext = a.nextSibling;
    wrap.insertBefore(a, b);
    wrap.insertBefore(b, aNext);
    // Swap references in array
    sections[i] = b; sections[j] = a;
  }
})();


/* --- STACK PRODUCTS (shared by sidebar + right gutter widgets) ---
   ---------------------------------------------------------------- */
var STACK_PRODUCTS = [
  { name: 'Creatine Gummies',         tag: 'DAILY USE',      icon: 'SUPPL', url: 'https://amzn.to/4b2CQUx', desc: '5g every day. The most evidence-backed supplement on the market. No loading phase.' },
  { name: 'Protein Powder',            tag: 'DAILY USE',      icon: 'SUPPL', url: 'https://amzn.to/4uj4CUt', desc: 'Food first — shake fills the gap when hitting 180g+ protein per day.' },
  { name: 'Vitamin D3 + K2',           tag: 'DAILY USE',      icon: 'SUPPL', url: 'https://amzn.to/3NwkRg8', desc: 'Most UK lifters are deficient. D3 affects testosterone, mood, and immune function.' },
  { name: 'Pre-Workout (Menace V2)',    tag: 'HEAVY DAYS',     icon: 'SUPPL', url: 'https://amzn.to/4umrzpH', desc: 'Properly dosed. CDP-Choline for focus. Used on squat and deadlift days only.' },
  { name: 'Maca Root',                 tag: 'SITUATIONAL',    icon: 'SUPPL', url: 'https://amzn.to/4biw2kx', desc: 'Adaptogen. Used during heavy training blocks for energy and stress management.' },
  { name: 'Turkesterone',              tag: 'SITUATIONAL',    icon: 'SUPPL', url: 'https://amzn.to/3OZcPgk', desc: 'Ecdysteroid. Worth considering once food, sleep, and training are properly sorted.' },
  { name: 'Berberine',                 tag: 'CUTTING',        icon: 'SUPPL', url: 'https://amzn.to/4roJyJm', desc: 'Insulin sensitiser. Cycles during a cut. Particularly useful with carb-heavy meals.' },
  { name: 'Gym Workbook',              tag: 'READS',          icon: 'BOOK',  url: 'https://amzn.to/4s5OPqs', desc: 'Paper training logs outlast every app. Track every session. Never forget a number.' },
  { name: "Arnold's Encyclopedia",     tag: 'ESSENTIAL READ', icon: 'BOOK',  url: 'https://amzn.to/40ZkXQs', desc: 'The best single reference on bodybuilding. If you own one book, make it this.' },
  { name: 'Apple Watch',               tag: 'GEAR',           icon: 'GEAR',  url: 'https://amzn.to/40ZvjQm', desc: 'Rest timing, HR monitoring, session tracking. Earns its place in the gym bag.' },
];


/* --- SIDEBAR STACK PICK ---
   Renders a randomly chosen product from the stack into any element
   with id="stack-pick-widget". New pick on every page load.
   ---------------------------------------------------------------- */
(function () {
  var el = document.getElementById('stack-pick-widget');
  if (!el) return;

  var pick = STACK_PRODUCTS[Math.floor(Math.random() * STACK_PRODUCTS.length)];

  el.innerHTML =
    '<div style="font-size:0.68em;letter-spacing:3px;color:var(--fg-dim);margin-bottom:5px;">&#9658; FROM THE STACK</div>' +
    '<div style="display:flex;gap:10px;align-items:flex-start;">' +
    '<a href="' + pick.url + '" target="_blank" rel="nofollow noopener" class="product-img-frame" style="text-decoration:none;">' + pick.icon + '</a>' +
    '<div class="stack-widget-inner" style="flex:1;">' +
    '<a href="' + pick.url + '" target="_blank" rel="nofollow noopener" style="display:block;text-decoration:none;">' +
    '<div style="font-size:0.9em;font-weight:bold;color:var(--fg);margin-bottom:3px;">' + pick.name + '</div>' +
    '</a>' +
    '<div style="display:inline-block;font-size:0.65em;letter-spacing:2px;padding:1px 6px;border:1px solid var(--accent);color:var(--accent);margin-bottom:7px;">' + pick.tag + '</div>' +
    '<p style="font-size:0.78em;color:var(--fg-dim);line-height:1.5;margin-bottom:9px;">' + pick.desc + '</p>' +
    '<a href="' + pick.url + '" target="_blank" rel="nofollow noopener" style="display:inline-block;font-size:0.72em;letter-spacing:2px;color:#fff;background:var(--accent);text-decoration:none;padding:4px 12px;border:1px solid var(--accent);">GET IT &rarr;</a>' +
    '&nbsp;&nbsp;<a href="stack.html" style="font-size:0.72em;color:var(--fg-dim);">full stack &raquo;</a>' +
    '</div></div>';
})();


/* --- RIGHT GUTTER STACK WIDGET ---
   Same product pool as sidebar pick — different pick on each load.
   Targets #right-stack-widget (fixed CSS, visible ≥ 1600px viewport).
   ---------------------------------------------------------------- */
(function () {
  var el = document.getElementById('right-stack-widget');
  if (!el) return;

  var pick = STACK_PRODUCTS[Math.floor(Math.random() * STACK_PRODUCTS.length)];

  el.innerHTML =
    '<div style="font-size:0.65em;letter-spacing:3px;color:var(--fg-dim);margin-bottom:6px;">&#9658; FROM THE STACK</div>' +
    '<a href="' + pick.url + '" target="_blank" rel="nofollow noopener" style="display:flex;align-items:center;justify-content:center;border:1px solid var(--border2);background:var(--bg3);height:80px;font-size:0.55em;letter-spacing:2px;color:var(--fg-dim);text-decoration:none;margin-bottom:8px;">' + pick.icon + '</a>' +
    '<a href="' + pick.url + '" target="_blank" rel="nofollow noopener" style="display:block;text-decoration:none;">' +
    '<div style="font-size:0.88em;font-weight:bold;color:var(--fg);margin-bottom:3px;">' + pick.name + '</div>' +
    '</a>' +
    '<div style="display:inline-block;font-size:0.62em;letter-spacing:2px;padding:1px 5px;border:1px solid var(--accent);color:var(--accent);margin-bottom:6px;">' + pick.tag + '</div>' +
    '<p style="font-size:0.75em;color:var(--fg-dim);line-height:1.5;margin-bottom:8px;">' + pick.desc + '</p>' +
    '<a href="' + pick.url + '" target="_blank" rel="nofollow noopener" style="display:inline-block;font-size:0.7em;letter-spacing:2px;color:#fff;background:var(--accent);text-decoration:none;padding:4px 10px;border:1px solid var(--accent);">GET IT &rarr;</a>' +
    '&nbsp;&nbsp;<a href="stack.html" style="font-size:0.7em;color:var(--fg-dim);">full stack &raquo;</a>';
})();


/* --- MODAL SYSTEM ---
   openModal(id) — opens .modal-overlay with that id
   closeModal()  — closes all open modals
   Keyboard Escape + click-outside both close.
   ---------------------------------------------------------------- */
function openModal(id) {
  var m = document.getElementById('modal-' + id);
  if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function closeModal() {
  document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
    m.classList.remove('active');
  });
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) closeModal();
});


/* --- BLOG FILTER ---
   filterPosts(query)  — search by title/tag
   filterByTag(tag)    — filter by tag button
   ---------------------------------------------------------------- */
function filterPosts(query) {
  var q = (query || '').toLowerCase();
  document.querySelectorAll('.blog-card').forEach(function (card) {
    var t  = (card.dataset.title || '').toLowerCase();
    var tg = (card.dataset.tag   || '').toLowerCase();
    card.style.display = (!q || t.includes(q) || tg.includes(q)) ? '' : 'none';
  });
}

function filterByTag(tag) {
  document.querySelectorAll('.blog-card').forEach(function (card) {
    card.style.display = (!tag || tag === 'all' || card.dataset.tag === tag) ? '' : 'none';
  });
  document.querySelectorAll('.tag-filter-btn').forEach(function (b) {
    b.classList.toggle('active', b.dataset.tag === tag || (!tag && b.dataset.tag === 'all'));
  });
}


/* --- RESEARCH FILTER ---
   filterResearch(cat) — filter study cards by category
   ---------------------------------------------------------------- */
function filterResearch(cat) {
  document.querySelectorAll('.research-card').forEach(function (card) {
    card.style.display = (!cat || cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
  document.querySelectorAll('.research-filter-col button').forEach(function (b) {
    b.classList.toggle('active', b.dataset.cat === cat || (!cat && b.dataset.cat === 'all'));
  });
}
