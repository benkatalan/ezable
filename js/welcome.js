// js/welcome.js
document.addEventListener('DOMContentLoaded', () => {
    const getStartedButton = document.getElementById('getStarted');
    
    getStartedButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});