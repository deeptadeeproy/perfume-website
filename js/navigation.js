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

    // Website color palette
    const colorPalette = {
        light: '#f0ece2',
        cream: '#dfd3c3',
        taupe: '#c7b198',
        gray: '#596e79'
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
        arrow.innerHTML = direction === 'prev' ? '←' : '→';
        document.body.appendChild(arrow);
        return arrow;
    };

    // Add arrows based on current page
    let prevArrow, nextArrow;
    if (currentPage !== 'index.html') {
        const prevPage = pages[currentIndex - 1];
        prevArrow = createArrow('prev', prevPage);
    }

    if (currentPage !== 'collector.html') {
        const nextPage = pages[currentIndex + 1];
        nextArrow = createArrow('next', nextPage);
    }

    // Function to get the brightness of a color
    function getBrightness(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    // Function to convert rgb string to brightness
    function getRGBBrightness(rgb) {
        const matches = rgb.match(/\d+/g);
        if (matches && matches.length >= 3) {
            return getBrightness(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]));
        }
        return 0;
    }

    // Function to get background color at point
    function getBackgroundColorAtPoint(x, y) {
        const elements = document.elementsFromPoint(x, y);
        let bgColor = 'rgb(240, 236, 226)'; // Default to brand-light

        for (const element of elements) {
            if (element === document.body) continue;
            if (element.classList.contains('nav-arrow')) continue;

            const computedStyle = window.getComputedStyle(element);
            const backgroundColor = computedStyle.backgroundColor;
            const backgroundImage = computedStyle.backgroundImage;

            if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
                bgColor = backgroundColor;
                break;
            }
            
            if (backgroundImage && backgroundImage !== 'none') {
                // If there's a background image, use a darker color for better visibility
                return 'rgb(89, 110, 121)'; // brand-gray
            }
        }

        return bgColor;
    }

    // Function to update arrow colors
    function updateArrowColors() {
        if (prevArrow) {
            const rect = prevArrow.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const bgColor = getBackgroundColorAtPoint(centerX, centerY);
            const brightness = getRGBBrightness(bgColor);
            prevArrow.style.color = brightness > 128 ? colorPalette.gray : colorPalette.light;
        }

        if (nextArrow) {
            const rect = nextArrow.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const bgColor = getBackgroundColorAtPoint(centerX, centerY);
            const brightness = getRGBBrightness(bgColor);
            nextArrow.style.color = brightness > 128 ? colorPalette.gray : colorPalette.light;
        }
    }

    // Show arrows on page load with a slight delay
    setTimeout(() => {
        document.querySelectorAll('.nav-arrow').forEach(arrow => {
            arrow.classList.add('visible');
        });
        updateArrowColors();
    }, 500);

    // Update colors frequently during scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(updateArrowColors);
    });

    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            cancelAnimationFrame(resizeTimeout);
        }
        resizeTimeout = requestAnimationFrame(updateArrowColors);
    });

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

        // Update arrow colors on mousemove
        updateArrowColors();
    });

    // Add appropriate body class based on current page
    if (currentPath === '/' || currentPath === '/index.html') {
        document.body.classList.add('home');
    } else if (currentPath === '/collector') {
        document.body.classList.add('collector');
    }

    // Update colors when images load
    window.addEventListener('load', updateArrowColors);
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', updateArrowColors);
    });

    // Set up a mutation observer to watch for changes in the DOM
    const observer = new MutationObserver(updateArrowColors);
    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    });

    // Update colors periodically to catch any missed changes
    setInterval(updateArrowColors, 100);
}); 