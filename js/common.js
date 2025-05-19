// Educational popup
window.addEventListener('DOMContentLoaded', function () {
    const isInternalNavigation =
        document.referrer && location.hostname === new URL(document.referrer).hostname;

    const hasSeenPopup = sessionStorage.getItem('educationalPopupShown');

    if (!isInternalNavigation && !hasSeenPopup) {
        alert("All assets used here are for educational purposes only! Click OK to close the popup");
        sessionStorage.setItem('educationalPopupShown', 'true');
    }
});

// Asset Preloader
const assetsToPreload = {
    images: [
        'assets/maison_shop_interior.jpg',
        'assets/scentll-co-oxzQiQ8ucSM-unsplash.jpg',
        'assets/ittar-store-Ek2ESu2lJDQ-unsplash.jpg',
        'assets/atelier.jpg',
        'assets/aesop_lab.avif',
        'assets/col_hero.jpg',
        'assets/collection_hero.jpg'
    ],
    videos: [
        'assets/index_hero.mp4',
        'assets/master-perfumer.mp4',
        'assets/philosophy.mp4'
    ]
};

function preloadAssets() {
    // Preload images
    assetsToPreload.images.forEach(imageUrl => {
        const img = new Image();
        img.src = imageUrl;
    });

    // Preload videos
    assetsToPreload.videos.forEach(videoUrl => {
        const video = document.createElement('video');
        const source = document.createElement('source');
        
        video.style.display = 'none'; // Hide the video element
        source.type = 'video/mp4';
        source.src = videoUrl;
        
        video.appendChild(source);
        video.load(); // Start loading the video
        
        // Remove the video element once loaded
        video.onloadeddata = () => {
            if (video.parentNode) {
                video.parentNode.removeChild(video);
            }
        };
        
        document.body.appendChild(video);
    });
}

// Start preloading assets after a short delay to not block initial page load
setTimeout(preloadAssets, 1000);

// Navbar scroll behavior
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            const navbar = document.querySelector('nav');
            const currentScrollY = window.scrollY;
            const scrollDiff = currentScrollY - lastScrollY;
            
            // Show/hide navbar based on scroll direction with a small threshold
            if (scrollDiff > 2) { // Scrolling down
                navbar.classList.add('nav-hidden');
            } else if (scrollDiff < -2) { // Scrolling up
                navbar.classList.remove('nav-hidden');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
            
            // Scroll Progress Bar
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (currentScrollY / docHeight) * 100;
            document.getElementById('scroll-progress-bar').style.width = scrolled + '%';
            
            // Show/hide scroll to top button
            const scrollButton = document.getElementById('scroll-to-top');
            if (currentScrollY > 500) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });
        
        ticking = true;
    }
});

window.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('scroll-progress-bar')) {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress-bar';
        document.body.appendChild(bar);
    }
    
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    document.body.appendChild(scrollButton);

    // Add smooth scroll functionality to all elements with onclick="document.getElementById('...').scrollIntoView"
    document.querySelectorAll('[onclick*="scrollIntoView"]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
}); 