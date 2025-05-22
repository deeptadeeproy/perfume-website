// Navigation configuration
const pageNames = {
    'index.html': 'Home',
    'about.html': 'Our Story',
    'craftsmanship.html': 'Craftsmanship',
    'collections.html': 'Collections',
    'bespoke.html': 'Bespoke',
    'visit.html': 'Salon Invitations',
    'journal.html': 'Scent Journal',
    'collector.html': 'For the Collector'
};

class Navbar {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        
        const text = document.createElement('div');
        text.className = 'loading-text';
        text.textContent = "Maison de L'Âme";
        
        // Add span for bottom and left borders
        const span = document.createElement('span');
        text.appendChild(span);
        
        overlay.appendChild(text);
        document.body.appendChild(overlay);
        return overlay;
    }

    handleNavigation() {
        const links = document.querySelectorAll('nav a');
        const overlay = this.createLoadingOverlay();

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const isExternalLink = link.getAttribute('href').startsWith('http');
                const isCurrentPage = link.getAttribute('href') === this.currentPage;
                
                if (isCurrentPage) {
                    e.preventDefault(); // Prevent navigation if it's the current page
                    return;
                }
                
                if (!isExternalLink) {
                    e.preventDefault();
                    overlay.classList.add('active');
                    
                    // Navigate to the new page after animation
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 2000); // Adjust timing to match animation duration
                }
            });
        });
    }

    getNavHTML() {
        return `
            <nav class="shadow-md">
                <div class="container mx-auto px-6 pr-3 py-4">
                    <div class="flex items-center">
                        <a href="index.html" class="text-black hover:text-brand-taupe transition-colors duration-200 brand-link" style="font-size: 2rem;">
                            Maison de L'Âme
                        </a>
                        <div class="space-x-8">
                            ${Object.entries(pageNames).map(([page, name]) => `
                                <a href="${page}" 
                                   class="text-black text-brand-font-nav hover:text-brand-taupe nav-link${page === this.currentPage ? ' active' : ''}">${name}</a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    // Method to handle scroll behavior
    initScrollBehavior() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
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
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }

    // Initialize the navbar
    init() {
        // Insert the navbar at the start of the body
        document.body.insertAdjacentHTML('afterbegin', this.getNavHTML());
        this.initScrollBehavior();
        this.handleNavigation();
    }
}

// Create and initialize the navbar when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navbar = new Navbar();
    navbar.init();
}); 