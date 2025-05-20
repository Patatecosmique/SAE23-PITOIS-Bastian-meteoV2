// Clé d'API pour accéder au service météo
const apiMeteoToken = "726b1c99c171e7c9d93155a0b1721f138a48d4c33ad10e533f84fbbd55d62140";

/**
 * Fonction principale pour récupérer et afficher la météo
 */
async function fetchWeatherData() {
    const postalCode = document.getElementById("postal-code").value.trim();
    const days = document.getElementById("forecast-days").value; // Nombre de jours sélectionnés
    const weatherResultContainer = document.getElementById("weather-result");
    weatherResultContainer.innerHTML = "Chargement...";

    try {
        // Appel à l'API géographique pour récupérer les coordonnées de la commune
        const geoApiResponse = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom,centre&format=json`);
        const geoData = await geoApiResponse.json();

        if (!geoData.length) {
            weatherResultContainer.innerHTML = "<p>Aucune commune trouvée pour ce code postal.</p>";
            return;
        }

        const { nom: cityName, centre: { coordinates: [longitude, latitude] } } = geoData[0];

        // Appel à l'API météo pour récupérer les prévisions
        const weatherApiResponse = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${apiMeteoToken}&latlng=${latitude},${longitude}`);
        const weatherData = await weatherApiResponse.json();

        // Génération du titre et des cartes météo
        weatherResultContainer.innerHTML = `
            <h1>Météo de ${cityName} pour ${days} jour${days > 1 ? "s" : ""}</h1>
            <div class="weather-cards-container">
                ${weatherData.forecast
                    .slice(0, days) // Limite au nombre de jours sélectionnés
                    .map((day, index) => `
                        <div class="weather-card">
                            <h3>Jour ${index + 1}</h3>
                            <div class="icon">${getWeatherIcon(day.weather)}</div>
                            <p><strong>Temp. Min :</strong> ${day.tmin}°C</p>
                            <p><strong>Temp. Max :</strong> ${day.tmax}°C</p>
                            <p><strong>Pluie :</strong> ${day.probarain ?? "N/A"}%</p>
                        </div>
                    `)
                    .join("")}
            </div>
        `;
            
    } catch (error) {
        weatherResultContainer.innerHTML = "<p>Erreur lors de la récupération des données météo.</p>";
        console.error(error);
    }
}

// Fonction pour obtenir une animation météo en fonction du code météo
function getWeatherIcon(weatherCode) {
    const icons = {
        0: "sun.gif", // Soleil
        1: "partly-cloudy-day.gif", // Peu nuageux
        2: "cloudy.png", // Nuageux
        3: "rain.gif", // Pluie
        4: "light-drizzle.gif", // Bruine légère
        5: "cloud-lightning.gif", // Orage
        6: "snow.gif", // Neige
        7: "windy-weather.gif", // Vent
    };

    const iconPath = icons[weatherCode] || "unknown.gif"; // Icône par défaut si le code est inconnu
    return `<img src="./img/${iconPath}" alt="Météo animée" class="weather-icon" />`;
}

// Fonction pour mettre à jour l'étiquette du curseur
function updateDaysLabel(value) {
    document.getElementById("days-label").textContent = `${value} jour${value > 1 ? "s" : ""}`;
}

