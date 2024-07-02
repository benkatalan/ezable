let map;
let markers = [];
let userMarker;
let userLocation;

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const stationInfo = document.getElementById('stationInfo');
    const openGoogleMapsBtn = document.getElementById('openGoogleMaps');
    const openWazeBtn = document.getElementById('openWaze');
    const locationButton = document.getElementById('location-button');
    const closeButton = document.getElementById('closePopup');
    const reserveButton = document.getElementById('reserveStation');

    initMap();

    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target) && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
        }
    });

    openGoogleMapsBtn.addEventListener('click', () => {
        const address = document.getElementById('stationAddress').textContent;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(mapsUrl, '_blank');
    });

    openWazeBtn.addEventListener('click', () => {
        const address = document.getElementById('stationAddress').textContent;
        const wazeUrl = `https://www.waze.com/ul?q=${encodeURIComponent(address)}`;
        window.open(wazeUrl, '_blank');
    });

    locationButton.addEventListener('click', getUserLocation);
    closeButton.addEventListener('click', () => {
        stationInfo.classList.remove('visible');
        stationInfo.classList.add('hidden');
    });

    reserveButton.addEventListener('click', () => {
        alert('Reservation functionality coming soon!');
    });
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.0853, lng: 34.7818 }, // Tel Aviv coordinates
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    const searchBox = new google.maps.places.SearchBox(searchInput);

    map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
    });

    searchButton.addEventListener('click', () => {
        performSearch(searchBox, searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchBox, searchInput.value);
        }
    });

    // Add charging stations
    chargingStations.forEach(station => {
        addChargingStation(station.position, station.name, station.address, station.operator, station.price, station.connectionTypes);
    });

    // Get user's location automatically
    getUserLocation();
}

function performSearch(searchBox, query) {
    const places = searchBox.getPlaces();
    if (places && places.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (place.geometry && place.geometry.location) {
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            }
        });
        map.fitBounds(bounds);
    } else {
        // If no places found, use Geocoding service
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: query }, (results, status) => {
            if (status === 'OK' && results[0]) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
            } else {
                console.warn('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}

function addChargingStation(position, name, address, operator, price, connectionTypes) {
    const iconUrl = getOperatorIcon(operator);
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: name,
        icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(24, 24)
        }
    });

    marker.addListener('click', () => {
        showStationInfo(name, address, operator, price, connectionTypes);
    });

    markers.push(marker);
}

function showStationInfo(name, address, operator, price, connectionTypes) {
    const stationInfo = document.getElementById('stationInfo');
    const stationName = document.getElementById('stationName');
    const stationAddress = document.getElementById('stationAddress');
    const stationOperator = document.getElementById('stationOperator');
    const arrivalTime = document.getElementById('arrivalTime');
    const stationPrice = document.getElementById('stationPrice');
    const connectionTypesElem = document.getElementById('connectionTypes');

    stationName.textContent = name;
    stationAddress.textContent = address;
    stationOperator.textContent = `Operator: ${operator}`;
    stationPrice.textContent = `Price: ${price}`; // Display price of charging
    connectionTypesElem.textContent = `Connection Types: ${connectionTypes.join(', ')}`; // Display connection types

    // Calculate and display estimated arrival time
    if (userLocation) {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [userLocation],
            destinations: [address],
            travelMode: google.maps.TravelMode.DRIVING,
        }, (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK) {
                const duration = response.rows[0].elements[0].duration.text;
                arrivalTime.textContent = `Estimated arrival time: ${duration}`;
            } else {
                arrivalTime.textContent = 'Estimated arrival time: N/A';
            }
        });
    } else {
        arrivalTime.textContent = 'Estimated arrival time: N/A';
    }

    stationInfo.classList.remove('hidden');
    stationInfo.classList.add('visible');
}

function getOperatorIcon(operator) {
    // Replace these with actual icon URLs for each operator
    const icons = {
        'EV Edge': 'images/charging-station.png',
        'Electra': 'images/charging-station.png',
        'Better Place': 'images/charging-station.png',
        'Gnrgy': 'images/charging-station.png',
        'Sonol': 'images/charging-station.png',
        'Afcon': 'images/charging-station.png',
        'Dor Alon': 'images/charging-station.png',
        'EV Smart': 'images/charging-station.png',
        'Char.ger': 'images/charging-station.png',
        'default': 'images/charging-station.png'
    };
    return icons[operator] || icons['default'];
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                userLocation = new google.maps.LatLng(pos.lat, pos.lng);

                if (userMarker) {
                    userMarker.setPosition(pos);
                } else {
                    userMarker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: "Your Location",
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        }
                    });
                }

                map.setCenter(pos);
                map.setZoom(15);
            },
            (error) => {
                console.error('Error getting user location:', error);
                handleLocationError(true, map.getCenter());
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    console.warn(browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.");
    // Don't show an alert, just log to console
}

// List of charging stations in Israel
const chargingStations = [
    {
        position: { lat: 32.0853, lng: 34.7818 },
        name: "Dizengoff Center EV Charging",
        address: "Dizengoff St 50, Tel Aviv-Yafo",
        operator: "EV Edge",
        price: "5.00 ILS/kWh",
        connectionTypes: ["Type 2", "CCS"]
    },
    {
        position: { lat: 32.0734, lng: 34.7925 },
        name: "Tel Aviv Port Charging Station",
        address: "Yordan St, Tel Aviv-Yafo",
        operator: "Electra",
        price: "5.50 ILS/kWh",
        connectionTypes: ["Type 2", "CHAdeMO"]
    },
    {
        position: { lat: 31.7784, lng: 35.2066 },
        name: "Jerusalem Central Station EV Charging",
        address: "Jaffa St 224, Jerusalem",
        operator: "Better Place",
        price: "4.75 ILS/kWh",
        connectionTypes: ["Type 2", "CCS"]
    },
    {
        position: { lat: 32.7940, lng: 34.9896 },
        name: "Haifa Grand Canyon Mall Charging",
        address: "Simcha Golan St 54, Haifa",
        operator: "Gnrgy",
        price: "5.25 ILS/kWh",
        connectionTypes: ["Type 2", "CHAdeMO"]
    },
    {
        position: { lat: 31.2516, lng: 34.7915 },
        name: "Beer Sheva EV Charging Station",
        address: "Yitzhak Rager Blvd 21, Beer Sheva",
        operator: "Sonol",
        price: "5.00 ILS/kWh",
        connectionTypes: ["Type 2", "CCS"]
    },
    {
        position: { lat: 32.1840, lng: 34.8697 },
        name: "Ra'anana Park EV Charging",
        address: "Ahuza St 241, Ra'anana",
        operator: "Afcon",
        price: "4.90 ILS/kWh",
        connectionTypes: ["Type 2", "CHAdeMO"]
    },
    {
        position: { lat: 32.3259, lng: 34.8550 },
        name: "Netanya EV Charging Point",
        address: "Herzl St 1, Netanya",
        operator: "Dor Alon",
        price: "5.10 ILS/kWh",
        connectionTypes: ["Type 2", "CCS"]
    },
    {
        position: { lat: 31.9634, lng: 34.8046 },
        name: "Rishon LeZion Charging Station",
        address: "Moshe Dayan Blvd 3, Rishon LeZion",
        operator: "EV Smart",
        price: "5.20 ILS/kWh",
        connectionTypes: ["Type 2", "CHAdeMO"]
    },
    {
        position: { lat: 32.0173, lng: 34.7464 },
        name: "Holon Charging Point",
        address: "Sokolov St 48, Holon",
        operator: "Char.ger",
        price: "4.95 ILS/kWh",
        connectionTypes: ["Type 2", "CCS"]
    },
    {
        position: { lat: 32.4340, lng: 34.9197 },
        name: "Hadera EV Charging",
        address: "Herbert Samuel St 85, Hadera",
        operator: "EV Edge",
        price: "5.00 ILS/kWh",
        connectionTypes: ["Type 2", "CHAdeMO"]
    }
    // Add more stations here...
];

function updatePrices() {
    fetch('https://api.example.com/charging-stations')
        .then(response => response.json())
        .then(data => {
            data.forEach(station => {
                const existingStation = chargingStations.find(s => s.name === station.name);
                if (existingStation) {
                    existingStation.price = station.price;
                }
            });
        })
        .catch(error => console.error('Error fetching prices:', error));
}

// Call the function to update prices when the map initializes
document.addEventListener('DOMContentLoaded', () => {
    updatePrices();
});