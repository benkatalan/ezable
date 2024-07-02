// js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerLink = document.getElementById('registerLink');
    const registerModal = document.getElementById('registerModal');
    const closeModal = document.getElementById('closeModal');
    const registerForm = document.getElementById('registerForm');
    const container = document.querySelector('.container');
    const welcomePopup = document.getElementById('welcomePopup');
    const welcomeName = document.getElementById('welcomeName');
    const continueButton = document.getElementById('continueButton');

// Add this at the beginning of your login.js file
const demoUser = {
    email: 'demo@example.com',
    password: 'demo123',
    fullName: 'Ben Katalan'
};

// Modify the login form submission handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === demoUser.email && password === demoUser.password) {
        // Demo user login successful
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        window.location.href = 'dashboard.html';
    } else {
        // Here you would normally check against your backend
        console.log('Login attempt:', { email, password });
        alert('Invalid credentials. Use demo@example.com and demo123 for demo access.');
    }
});    

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const registerData = Object.fromEntries(formData.entries());
    console.log('Register attempt:', registerData);
    
    // Show welcome popup
    welcomeName.textContent = registerData.fullName;
    welcomePopup.classList.add('show');
    
    // Close register modal
    fadeOut(registerModal, () => {
        registerModal.style.display = 'none';
        registerForm.reset();
    });
});

continueButton.addEventListener('click', () => {
    // Close welcome popup and navigate to dashboard
    fadeOut(welcomePopup, () => {
        welcomePopup.classList.remove('show');
        // Navigate to dashboard
        window.location.href = 'dashboard.html';
    });
});

function fadeOut(element, callback) {
    element.classList.remove('fade-in');
    element.style.opacity = 0;
    setTimeout(() => {
        if (callback) callback();
    }, 500);
}

    // Fade in the login form
    setTimeout(() => {
        container.classList.add('fade-in');
    }, 100);

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Login attempt:', { email, password });
        alert('Login attempt registered');
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'block';
        setTimeout(() => {
            registerModal.classList.add('fade-in');
        }, 10);
    });

    closeModal.addEventListener('click', () => {
        fadeOut(registerModal, () => {
            registerModal.style.display = 'none';
        });
    });

    function fadeOut(element, callback) {
        element.classList.remove('fade-in');
        setTimeout(() => {
            if (callback) callback();
        }, 500);
    }
});