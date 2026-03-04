/**
 * Dark Mode Toggle Logic
 * The initial theme is applied immediately via an inline script in <head>
 * (see each HTML page). This file only handles the toggle button interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const root = document.documentElement;
    const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    // Sync icon with current theme (already applied by inline script in <head>)
    if (root.classList.contains('dark-theme') && icon) updateIcon(true);

    // Toggle button click handler
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            root.classList.toggle('dark-theme');
            const isDark = root.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (icon) updateIcon(isDark);
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
