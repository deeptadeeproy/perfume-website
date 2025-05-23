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
        // Hero and Background Images
        'assets/journal_banner.png',
        'assets/collection_hero.jpg',
        'assets/about_hero.jpg',
        'assets/bespoke_hero.jpg',
        'assets/bespoke_hero_final.jpg',
        
        // Collection Page Images
        'assets/left_col.jpeg',
        'assets/centre_col.jpeg',
        'assets/right_col.jpeg',
        
        // Feature Images
        'assets/feature-content-olfactory.jpg',
        'assets/Aesop_Aurner_Eau_de_Parfum_Web_Category_Page_Secondary_Full_Width_Tablet_1536x1230px.avif',
        'assets/9708950_20250415212502735-1024.png',
        
        // Favicon
        'assets/favicon.ico'
    ],
    videos: [
        'assets/index_hero.mp4',
        'assets/master-perfumer.mp4',
        'assets/philosophy.mp4'
    ]
};

// Initialize AssetManager
const assetManager = new AssetManager();

async function preloadAssets() {
    // Preload images with priority
    const priorityImages = [
        'assets/maison_shop_interior.jpg',
        'assets/col_hero.jpg',
        'assets/collection_hero.jpg',
        'assets/about_hero.jpg'
    ];

    // First load priority images
    for (const imageUrl of priorityImages) {
        try {
            const cachedUrl = await assetManager.getCachedAsset(imageUrl);
            const img = new Image();
            img.importance = 'high';
            img.src = cachedUrl;
        } catch (error) {
            console.warn(`Failed to load priority image ${imageUrl}:`, error);
        }
    }

    // Then load remaining images
    const remainingImages = assetsToPreload.images.filter(img => !priorityImages.includes(img));
    for (const imageUrl of remainingImages) {
        try {
            const cachedUrl = await assetManager.getCachedAsset(imageUrl);
            const img = new Image();
            img.loading = 'lazy';
            img.src = cachedUrl;
        } catch (error) {
            console.warn(`Failed to load image ${imageUrl}:`, error);
        }
    }

    // Preload videos with reduced priority
    for (const videoUrl of assetsToPreload.videos) {
        try {
            const cachedUrl = await assetManager.getCachedAsset(videoUrl);
            const video = document.createElement('video');
            const source = document.createElement('source');
            
            video.style.display = 'none';
            video.preload = 'metadata'; // Start with metadata only
            source.type = 'video/mp4';
            source.src = cachedUrl;
            
            video.appendChild(source);
            
            // Once metadata is loaded, start loading the full video
            video.onloadedmetadata = () => {
                video.preload = 'auto';
            };
            
            // Remove the video element once loaded
            video.onloadeddata = () => {
                if (video.parentNode) {
                    video.parentNode.removeChild(video);
                }
            };
            
            document.body.appendChild(video);
        } catch (error) {
            console.warn(`Failed to load video ${videoUrl}:`, error);
        }
    }
}

// Start preloading assets after a short delay to not block initial page load
setTimeout(preloadAssets, 1000);

// Create and initialize back to top button
function createBackToTop() {
    if (document.getElementById('scroll-to-top')) return;
    
    const backToTop = document.createElement('div');
    backToTop.id = 'scroll-to-top';
    backToTop.setAttribute('data-page', 'Back to Top');
    backToTop.innerHTML = '↑';
    
    // Add click event to back to top button
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTop);
    return backToTop;
}

// Initialize scroll handling
function initScrollHandling(backToTop) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const navbar = document.querySelector('nav');
                const currentScrollY = window.scrollY;
                const scrollDiff = currentScrollY - lastScrollY;
                
                // Always show navbar at top of page, otherwise show/hide based on scroll direction
                if (currentScrollY === 0) {
                    navbar.classList.remove('nav-hidden');
                } else if (scrollDiff > 2) { // Scrolling down
                    navbar.classList.add('nav-hidden');
                } else if (scrollDiff < -2) { // Scrolling up
                    navbar.classList.remove('nav-hidden');
                }
                
                lastScrollY = currentScrollY;
                
                // Show/hide back to top button
                if (currentScrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Initialize everything
function init() {
    const backToTop = createBackToTop();
    initScrollHandling(backToTop);
}

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add smooth scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[onclick*="scrollIntoView"]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
}); 