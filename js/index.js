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

// Scroll Progress Bar
window.addEventListener('scroll', function() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    document.getElementById('scroll-progress-bar').style.width = scrolled + '%';
    
    // Show/hide scroll to top button
    const scrollButton = document.getElementById('scroll-to-top');
    if (window.scrollY > 500) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
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
}); 