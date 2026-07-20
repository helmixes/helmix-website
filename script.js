// ==============================
// HELMIX INTERACTIVE MAP
// ==============================

// Создаем карту
const map = L.map("map-container").setView(
    [38.3452, -0.4810],
    9
);


// Подключаем OpenStreetMap
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }
).addTo(map);


// Тестовые точки HELMIX
const locations = [

    {
        name: "HELMIX — Alicante",
        city: "Alicante",
        address: "Alicante, España",
        coordinates: [38.3452, -0.4810]
    },

    {
        name: "HELMIX — Benidorm",
        city: "Benidorm",
        address: "Benidorm, España",
        coordinates: [38.5411, -0.1225]
    },

    {
        name: "HELMIX — Valencia",
        city: "Valencia",
        address: "Valencia, España",
        coordinates: [39.4699, -0.3763]
    }

];


// Создаем маркеры
locations.forEach(function(location) {

    const marker = L.marker(
        location.coordinates
    ).addTo(map);


    marker.bindPopup(`

        <div class="map-popup">

            <h3>${location.name}</h3>

            <p>
                📍 ${location.address}
            </p>

            <a
                href="https://www.google.com/maps/search/?api=1&query=${location.coordinates[0]},${location.coordinates[1]}"
                target="_blank"
            >
                CÓMO LLEGAR →
            </a>

        </div>

    `);

});


// ==============================
// SIMPLE SCROLL ANIMATION
// ==============================

const observer = new IntersectionObserver(

    function(entries) {

        entries.forEach(function(entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    },

    {
        threshold: 0.15
    }

);


document
    .querySelectorAll(
        ".benefit-card, .step, .business-content"
    )
    .forEach(function(element) {

        observer.observe(element);

    });
