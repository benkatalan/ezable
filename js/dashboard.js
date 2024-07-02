// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const userName = document.getElementById('userName');
    const settingsBtn = document.getElementById('settingsBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');

    // Load user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        userName.textContent = `Welcome, ${currentUser.fullName}`;
    }

    // Settings button
    settingsBtn.addEventListener('click', () => {
        alert('Settings page not implemented yet');
    });

    // Logout button
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Menu toggle
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target) && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
        }
    });

    // You can add more functionality here, such as:
    // - Fetching and displaying real-time news
    // - Loading and updating charging history
    // - Handling navigation to other pages (chargers, spoofer, payment)
});