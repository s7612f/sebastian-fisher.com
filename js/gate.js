/* ============================================================
   LOGIN GATE — redirects to coming-soon.html if not logged in.
   To remove: delete this file + remove <script src="js/gate.js">
   from all HTML pages. That's it.
   ============================================================ */
(function () {
  if (sessionStorage.getItem('sf_auth') !== '1') {
    // Work from both root pages and subdirectory pages
    var path = window.location.pathname;
    var prefix = path.indexOf('/blog/') !== -1 || path.indexOf('/forum/') !== -1 ? '../' : '';
    window.location.replace(prefix + 'coming-soon.html');
  }
})();
