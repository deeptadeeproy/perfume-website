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