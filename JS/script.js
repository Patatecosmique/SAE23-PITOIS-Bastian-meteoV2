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
                            <div class="icon"></div>
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



