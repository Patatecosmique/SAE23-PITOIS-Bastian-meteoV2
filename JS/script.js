// Clé d'API pour accéder au service météo
const apiMeteoToken = "726b1c99c171e7c9d93155a0b1721f138a48d4c33ad10e533f84fbbd55d62140";

/**
 * Fonction principale pour récupérer et afficher la météo
 */
async function fetchWeatherData() {
    // Récupère la valeur du code postal entré par l'utilisateur
    const postalCode = document.getElementById("postal-code").value.trim();
    // Sélectionne l'élément où les résultats seront affichés
    const weatherResultContainer = document.getElementById("weather-result");

    try {
        // Appel à l'API pour récupérer les informations géographiques à partir du code postal
        const geoApiResponse = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom,centre&format=json`);
        const geoData = await geoApiResponse.json();

        // Vérifie si aucune commune n'a été trouvée pour le code postal donné
        if (!geoData.length) {
            weatherResultContainer.innerHTML = "<p>Aucune commune trouvée pour ce code postal.</p>";
            return;
        }

        // Récupère le nom et les coordonnées de la première commune trouvée a partir de la réponse de l'API 
        const { nom: cityName, centre: cityCoordinates } = geoData[0];
        const [longitude, latitude] = cityCoordinates.coordinates;

        // Appel à l'API météo pour récupérer les prévisions à partir des coordonnées
        const weatherApiResponse = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${apiMeteoToken}&latlng=${latitude},${longitude}`);
        const weatherData = await weatherApiResponse.json();
        const todayWeather = weatherData.forecast[0]; // Données météo pour aujourd'hui

        // Extraction des données météo importantes
        const minTemperature = todayWeather.tmin; // Température minimale
        const maxTemperature = todayWeather.tmax; // Température maximale
        const averageTemperature = ((minTemperature + maxTemperature) / 2); // Moyenne des températures
        const rainProbability = todayWeather.probarain ?? "N/A"; // Probabilité de pluie
        const sunHours = todayWeather.sun_hours ?? "N/A"; // Heures d'ensoleillement

        // Affiche les résultats météo dans le conteneur
        weatherResultContainer.innerHTML = `
  <h2>Météo pour ${cityName}</h2>
  <ul>
    <li><strong>🌡️ Température minimale :</strong> ${minTemperature}°C</li>
    <li><strong>🌡️ Température maximale :</strong> ${maxTemperature}°C</li>
    <li><strong>🌡️ Moyenne estimée :</strong> ${averageTemperature}°C</li>
    <li><strong>☔ Probabilité de pluie :</strong> ${rainProbability}%</li>
    <li><strong>☀️ Heures d'ensoleillement :</strong> ${sunHours} h</li>
  </ul>
`;
    } catch (error) {
        // En cas d'erreur, affiche un message d'erreur et log l'erreur dans la console
        console.error(error);
        weatherResultContainer.innerHTML = "<p>Erreur lors de la récupération des données météo.</p>";
    }
}

// Met à jour l'étiquette du nombre de jours en fonction de la valeur du curseur
function updateDaysLabel(value) {
    document.getElementById('days-label').textContent = `${value} jour${value > 1 ? 's' : ''}`;
}


