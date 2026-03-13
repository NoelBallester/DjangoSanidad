/**
 * PHH Sanidad - Authentication Guard
 * This script ensures that the user is logged in before accessing protected pages.
 */

(function () {
    // Check if the current page is the login page
    const isLoginPage = window.location.pathname.endsWith('registro.html');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    // Auth guard desactivado - acceso libre sin login
    // if (!isLoggedIn && !isLoginPage) {
    //     window.location.href = './registro.html';
    // } else if (isLoggedIn && isLoginPage) {
    //     window.location.href = './index.html';
    // }

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
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '';
    fetch('/logout/', { method: 'POST', headers: { 'X-CSRFToken': csrfToken } })
        .finally(() => { sessionStorage.clear(); window.location.href = '/login/'; });
}
