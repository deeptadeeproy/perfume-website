// Initialize Flatpickr
window.addEventListener('DOMContentLoaded', function() {
    flatpickr("#datetime", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        maxDate: new Date().fp_incr(60), // Allow booking up to 60 days in advance
        minTime: "10:00",
        maxTime: "18:00",
        disable: [
            function(date) {
                // Disable Sundays and Saturdays
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        locale: {
            firstDayOfWeek: 1 // Start week on Monday
        }
    });
}); 