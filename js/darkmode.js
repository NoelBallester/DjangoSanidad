/**
 * Dark Mode Toggle Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    // Check for saved user preference in localStorage
    const currentTheme = localStorage.getItem('theme');

    // If a preference is saved, apply it
    if (currentTheme) {
        if (currentTheme === 'dark') {
            body.classList.add('dark-theme');
            if (icon) updateIcon(true);
        }
    } else {
        // If no preference is saved, check OS preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDarkScheme.matches) {
            body.classList.add('dark-theme');
            if (icon) updateIcon(true);
        }
    }

    // Toggle button click handler
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if it's an <a> tag
            body.classList.toggle('dark-theme');
            let theme = 'light';

            if (body.classList.contains('dark-theme')) {
                theme = 'dark';
                updateIcon(true);
            } else {
                updateIcon(false);
            }

            // Save the user's preference
            localStorage.setItem('theme', theme);
        });
    }

    // Helper function to swap icons between moon and sun
    function updateIcon(isDark) {
        if (!icon) return;
        if (isDark) {
            icon.classList.remove('bx-moon');
            icon.classList.add('bx-sun');
        } else {
            icon.classList.remove('bx-sun');
            icon.classList.add('bx-moon');
        }
    }
});
