// Navigation arrows functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation order with display names
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

    const pages = Object.keys(pageNames);

    // Get current page
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const currentIndex = pages.indexOf(currentPage);

    // Create navigation arrows
    const createArrow = (direction, href) => {
        const arrow = document.createElement('a');
        arrow.href = href;
        arrow.className = `nav-arrow ${direction}`;
        arrow.setAttribute('aria-label', `${direction === 'prev' ? 'Previous' : 'Next'} page`);
        arrow.setAttribute('data-page', pageNames[href]);
        document.body.appendChild(arrow);
        return arrow;
    };

    // Add arrows based on current page
    if (currentPage !== 'index.html') {
        const prevPage = pages[currentIndex - 1];
        createArrow('prev', prevPage);
    }

    if (currentPage !== 'collector.html') {
        const nextPage = pages[currentIndex + 1];
        createArrow('next', nextPage);
    }

    // Show arrows on page load with a slight delay
    setTimeout(() => {
        document.querySelectorAll('.nav-arrow').forEach(arrow => {
            arrow.classList.add('visible');
        });
    }, 500);

    // Edge detection for hover
    const EDGE_THRESHOLD = 100; // pixels from edge
    let timeout;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const width = window.innerWidth;

        clearTimeout(timeout);

        // Remove existing edge hover classes
        document.body.classList.remove('edge-hover-left', 'edge-hover-right');

        // Add appropriate edge hover class
        if (x < EDGE_THRESHOLD) {
            document.body.classList.add('edge-hover-left');
        } else if (x > width - EDGE_THRESHOLD) {
            document.body.classList.add('edge-hover-right');
        }

        // Set timeout to remove classes
        timeout = setTimeout(() => {
            document.body.classList.remove('edge-hover-left', 'edge-hover-right');
        }, 500);
    });

    // Add appropriate body class based on current page
    if (currentPath === '/' || currentPath === '/index.html') {
        document.body.classList.add('home');
    } else if (currentPath === '/collector') {
        document.body.classList.add('collector');
    }
}); 