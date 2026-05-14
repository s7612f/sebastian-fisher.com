// Retro Theme Audio Logic
const musicMap = {
    '/home.html': 'media/audio/music/your-song-melon.mp3',
    '/projects.html': 'media/audio/music/CHIPHOUSE.mp3',
    '/links.html': 'media/audio/music/johnny_ripper-atthesea.mp3',
    '/homelab.html': 'media/audio/music/nothing-is-left.mp3',
    '/library.html': 'media/audio/music/last-arp.mp3',
    '/giphy-gallery.html': 'media/audio/music/flogging.mp3',
    '/design.html': 'media/audio/music/your-song-melon.mp3'
};

const honk = new Audio('media/audio/music/honk.mp3');
let bgMusic = new Audio();

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const musicSrc = musicMap[path] || 'media/audio/music/your-song-melon.mp3';
    
    // Resume music from saved time
    const savedTime = sessionStorage.getItem('musicTime');
    const savedSrc = sessionStorage.getItem('musicSrc');

    if (savedSrc === musicSrc) {
        bgMusic.src = musicSrc;
        bgMusic.currentTime = savedTime || 0;
    } else {
        bgMusic.src = musicSrc;
    }
    
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    // Play music on first click
    document.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(() => {});
        }
    }, { once: true });

    // Honk on nav clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-center a')) {
            honk.currentTime = 0;
            honk.play().catch(() => {});
        }
    });

    // Save time before unloading
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('musicTime', bgMusic.currentTime);
        sessionStorage.setItem('musicSrc', bgMusic.src);
    });
});
