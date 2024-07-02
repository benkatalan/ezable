// js/chargers.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const powerRange = document.getElementById('power-range');
    const powerValue = document.getElementById('power-value');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const showResultsBtn = document.getElementById('show-results');
    const resetFiltersBtn = document.getElementById('reset-filters');

    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });

    powerRange.addEventListener('input', () => {
        powerValue.textContent = powerRange.value;
    });

    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
    });

    showResultsBtn.addEventListener('click', () => {
        // Collect all filter values
        const filters = {
            power: powerRange.value,
            availability: Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(el => el.value),
            connectionTypes: Array.from(document.querySelectorAll('.connection-type.selected')).map(el => el.textContent),
            operator: document.getElementById('operator-select').value,
            price: priceRange.value
        };

        console.log('Filters applied:', filters);
        // Here you would typically send these filters to your backend or filter local data
        alert('Results would be shown based on the applied filters');
    });

    resetFiltersBtn.addEventListener('click', () => {
        powerRange.value = 0;
        powerValue.textContent = '0';
        priceRange.value = 0;
        priceValue.textContent = '0';
        document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
        document.getElementById('operator-select').value = '';
        document.querySelectorAll('.connection-type').forEach(el => el.classList.remove('selected'));
    });
});

const connectionTypes = document.querySelectorAll('.connection-type');

connectionTypes.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('selected');
    });
});