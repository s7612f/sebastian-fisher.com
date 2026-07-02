(function () {
    'use strict';

    var ROOT = '/media/audio/music/';

    var PAGE_TRACKS = {
        'home.html':          'your-song-melon.mp3',
        'links.html':         'johnny_ripper-atthesea.mp3',
        'projects.html':      'CHIPHOUSE.mp3',
        'homelab.html':       'nothing-is-left-chip-me-hard.mp3',
        'library.html':       'The-Last-Arp-Fades-At-Dawn.mp3',
        'giphy-gallery.html': 'Flogging-A-dead-Chip.mp3',
    };

    function currentPage() {
        return window.location.pathname.split('/').pop() || 'home.html';
    }

    function getTrack() {
        return PAGE_TRACKS[currentPage()] || 'your-song-melon.mp3';
    }

    var bg = null;
    var started = false;

    function startMusic() {
        if (started) return;
        started = true;

        var track = getTrack();
        var savedTrack = sessionStorage.getItem('sf_track');
        var savedTime  = parseFloat(sessionStorage.getItem('sf_time') || '0');

        bg = new Audio(ROOT + track);
        bg.volume = 0.32;
        bg.loop = true;
        if (savedTrack === track && savedTime > 0) bg.currentTime = savedTime;
        bg.play().catch(function(){});
        sessionStorage.setItem('sf_track', track);

        setInterval(function() {
            if (bg && !bg.paused) sessionStorage.setItem('sf_time', bg.currentTime);
        }, 2000);
    }

    function honk() {
        var a = new Audio(ROOT + 'honk.mp3');
        a.volume = 0.65;
        a.play().catch(function(){});
    }

    function wireHonks() {
        document.querySelectorAll('.nav-center a').forEach(function(link) {
            link.addEventListener('click', honk);
        });
    }

    function onFirst() {
        startMusic();
        document.removeEventListener('click', onFirst);
        document.removeEventListener('keydown', onFirst);
    }

    document.addEventListener('DOMContentLoaded', function () {
        wireHonks();
        document.addEventListener('click', onFirst);
        document.addEventListener('keydown', onFirst);
    });
})();
