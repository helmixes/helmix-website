
// ==========================================
// HELMIX — mapa de puntos de limpieza
// ==========================================

// 1. Inicializar mapa
const map = L.map("map-container").setView([38.35, -0.55], 10);

// 2. Подключить OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

// 3. Реальные точки HELMIX
const locations = [
  {
    name: "Lavandería Agua",
    city: "Elche",
    address: "Carrer del Filet de Fora, 33, 03203 Elx, Alicante",
    coordinates: [38.26199, -0.69596]
  },
  {
    name: "Lavandería Agua",
    city: "Alicante",
    address: "Carrer Olof Palme, 9, 03010 Alacant, Alicante",
    coordinates: [38.3612909, -0.4894761]
  },
  {
    name: "Open Blue San Juan",
    city: "Sant Joan d'Alacant",
    address:
      "Carrer Capitán Juan Martí, 25, Bajo 1, 03550 Sant Joan d'Alacant, Alicante",
    coordinates: null
  }
];

// 4. Защита текста для HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

// 5. Добавление метки на карту
function addLocationMarker(location) {
  const [lat, lng] = location.coordinates;

  const routeUrl =
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(location.address);

  const popupContent = `
    <div class="map-popup">
      <h3>${escapeHTML(location.name)}</h3>
      <p>${escapeHTML(location.city)}</p>
      <p>📍 ${escapeHTML(location.address)}</p>
      <a href="${routeUrl}" target="_blank" rel="noopener noreferrer">
        CÓMO LLEGAR →
      </a>
    </div>
  `;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(popupContent);
}

// 6. Добавить первые две точки с известными координатами
const knownLocations = locations.filter(
  location => Array.isArray(location.coordinates)
);

knownLocations.forEach(addLocationMarker);

// 7. Автоматически найти координаты третьей точки по адресу
async function findThirdLocation() {
  const location = locations.find(item => !item.coordinates);

  if (!location) return;

  const cacheKey = "helmix_open_blue_coordinates";

  try {
    let coordinates = null;

    // Сначала проверить сохранённые координаты
    const saved = localStorage.getItem(cacheKey);

    if (saved) {
      coordinates = JSON.parse(saved);
    } else {
      const query = encodeURIComponent(location.address);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`
      );

      if (!response.ok) {
        throw new Error("Geocoding request failed");
      }

      const results = await response.json();

      if (results.length > 0) {
        coordinates = [
          Number(results[0].lat),
          Number(results[0].lon)
        ];

        // Сохранить координаты для следующих посещений
        localStorage.setItem(cacheKey, JSON.stringify(coordinates));
      }
    }

    if (
      coordinates &&
      Number.isFinite(coordinates[0]) &&
      Number.isFinite(coordinates[1])
    ) {
      location.coordinates = coordinates;
      addLocationMarker(location);

      // Показать все три точки на карте
      const allCoordinates = locations
        .filter(item => Array.isArray(item.coordinates))
        .map(item => item.coordinates);

      map.fitBounds(allCoordinates, {
        padding: [35, 35],
        maxZoom: 12
      });
    } else {
      console.warn("HELMIX: не удалось определить координаты Open Blue.");
    }
  } catch (error) {
    console.warn("HELMIX: ошибка определения координат:", error);
  }
}

// 8. Показать известные точки и найти третью
const initialBounds = knownLocations.map(item => item.coordinates);

if (initialBounds.length > 0) {
  map.fitBounds(initialBounds, {
    padding: [35, 35],
    maxZoom: 12
  });
}

findThirdLocation();

// 9. Корректно отобразить карту после загрузки страницы
window.addEventListener("load", () => {
  map.invalidateSize();
});
