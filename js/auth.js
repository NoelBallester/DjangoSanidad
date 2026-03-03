/**
 * PHH Sanidad - Authentication Guard
 * This script ensures that the user is logged in before accessing protected pages.
 */

(function () {
    // Check if the current page is the login page
    const isLoginPage = window.location.pathname.endsWith('registro.html');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn && !isLoginPage) {
        // Redirect to login if not logged in and not on the login page
        window.location.href = './registro.html';
    } else if (isLoggedIn && isLoginPage) {
        // Redirect to home if already logged in and trying to access the login page
        window.location.href = './index.html';
    }

    // After DOM is loaded, check if we need to show the admin menu
    document.addEventListener("DOMContentLoaded", () => {
        const userRole = sessionStorage.getItem('rol');
        const navUsuariosContainer = document.getElementById('nav-usuarios-container');
        if (userRole === 'admin' && navUsuariosContainer) {
            navUsuariosContainer.style.display = 'block';
        }
    });
})();

/**
 * Log out the user and redirect to the login page.
 */
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('method');
    sessionStorage.removeItem('rol');
    window.location.href = './registro.html';
}
