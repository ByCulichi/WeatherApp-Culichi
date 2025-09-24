// ============================================================
// Weather App - script.js
// ------------------------------------------------------------
// Este archivo contiene la lógica principal para obtener y mostrar
// el clima actual de una ciudad usando la API de OpenWeatherMap.
// ============================================================

// Elementos principales del DOM
const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');

// Clave de API para OpenWeatherMap (debes reemplazarla por la tuya)
const apiKey = 'b8fe6805b74a15b5786467b2f27ca0bf';

// Estado global para unidades de temperatura
let isCelsius = false;

// ------------------------------------------------------------
// Función de depuración para mostrar mensajes en consola
function debugLog(...args) {
    console.log('[WeatherApp]', ...args);
}

// ------------------------------------------------------------
// Evento principal: envío del formulario de búsqueda
weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita recargar la página

    const city = cityInput.value.trim();

    // Validación: campo vacío
    if (!city) {
        displayError('Please enter a city name');
        return;
    }

    // Validación: clave de API ausente
    if (!apiKey || apiKey === '') {
        displayError('API key not configured in script.js');
        debugLog('Missing API key');
        return;
    }

    try {
        showLoading(); // Muestra mensaje de carga
        const weatherData = await getWeather(city); // Obtiene datos del clima
        displayWeatherInfo(weatherData); // Muestra la información en la tarjeta
    } catch (err) {
        const msg = (err && err.message) ? err.message : String(err);
        displayError(msg); // Muestra error en la interfaz
        debugLog('Error:', err); // Muestra error en consola
    }
});

// ------------------------------------------------------------
// Función para obtener datos del clima desde la API
async function getWeather(city) {
    const units = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
    debugLog('Fetching:', url);

    let response;
    try {
        response = await fetch(url);
    } catch (networkErr) {
        debugLog('Network error:', networkErr);
        throw new Error('Network error: cannot reach OpenWeatherMap. Check internet or browser extensions.');
    }

    // Manejo de errores HTTP
    if (!response.ok) {
        let bodyText = '';
        try {
            const json = await response.json();
            bodyText = json && json.message ? json.message : JSON.stringify(json);
        } catch (parseErr) {
            bodyText = await response.text().catch(() => '(no body)');
        }

        debugLog('HTTP error', response.status, response.statusText, 'body:', bodyText);

        if (response.status === 401) throw new Error(`Unauthorized (401): invalid API key. ${bodyText}`);
        if (response.status === 404) throw new Error(`City not found (404). Check spelling. ${bodyText}`);
        if (response.status === 429) throw new Error(`Too many requests (429). You may be rate-limited. ${bodyText}`);
        throw new Error(`HTTP ${response.status} — ${response.statusText}. ${bodyText}`);
    }

    // Procesa la respuesta JSON
    try {
        const data = await response.json();
        debugLog('Received data:', data);
        return data;
    } catch (err) {
        debugLog('JSON parse error:', err);
        throw new Error('Invalid JSON from API.');
    }
}

// ------------------------------------------------------------
// Función para mostrar la información del clima en la tarjeta
function displayWeatherInfo(data) {
    // Desestructura los datos principales incluyendo datos adicionales
    const {
        name: cityName,
        main: { temp, humidity, feels_like, temp_min, temp_max, pressure } = {},
        weather = [],
        wind: { speed } = {}
    } = data;

    const weatherObj = weather[0] || {};
    const weatherId = weatherObj.id;
    const description = weatherObj.description || '';
    const tempUnit = isCelsius ? '°C' : '°F';

    // Limpia y muestra la tarjeta
    card.innerHTML = '';
    card.style.display = 'flex';

    // Panel principal con temperatura
    const mainPanel = document.createElement('div');
    mainPanel.className = 'main-panel';

    const cityEl = document.createElement('h2');
    cityEl.textContent = cityName || 'Unknown';
    cityEl.className = 'city-name';

    const emojiEl = document.createElement('p');
    emojiEl.className = 'weatherEmoji';
    emojiEl.textContent = getWeatherEmoji(weatherId);

    const tempEl = document.createElement('p');
    tempEl.className = 'temp';
    tempEl.textContent = (typeof temp === 'number') ? `${temp.toFixed(1)}${tempUnit}` : 'N/A';

    const descEl = document.createElement('p');
    descEl.className = 'desc';
    descEl.textContent = description;

    // Añade elementos al panel principal
    mainPanel.appendChild(cityEl);
    mainPanel.appendChild(emojiEl);
    mainPanel.appendChild(tempEl);
    if (description) mainPanel.appendChild(descEl);

    // Panel secundario con información adicional
    const secondaryPanel = document.createElement('div');
    secondaryPanel.className = 'secondary-panel';

    // Crea elementos de información secundaria
    const weatherDetails = [
        { label: 'Min', value: typeof temp_min === 'number' ? `${temp_min.toFixed(1)}${tempUnit}` : 'N/A', icon: '🌡️' },
        { label: 'Max', value: typeof temp_max === 'number' ? `${temp_max.toFixed(1)}${tempUnit}` : 'N/A', icon: '🌡️' },
        { label: 'Feels like', value: typeof feels_like === 'number' ? `${feels_like.toFixed(1)}${tempUnit}` : 'N/A', icon: '🌡️' },
        { label: 'Pressure', value: typeof pressure === 'number' ? `${pressure} hPa` : 'N/A', icon: '🔽' },
        { label: 'Humidity', value: typeof humidity === 'number' ? `${humidity}%` : 'N/A', icon: '💧' },
        { label: 'Wind', value: typeof speed === 'number' ? `${speed} ${isCelsius ? 'm/s' : 'mph'}` : 'N/A', icon: '💨' }
    ];

    weatherDetails.forEach(detail => {
        const detailEl = document.createElement('div');
        detailEl.className = 'weather-detail';
        
        detailEl.innerHTML = `
            <span class="detail-icon">${detail.icon}</span>
            <span class="detail-label">${detail.label}</span>
            <span class="detail-value">${detail.value}</span>
        `;
        
        secondaryPanel.appendChild(detailEl);
    });

    // Añade los paneles a la tarjeta
    card.appendChild(mainPanel);
    card.appendChild(secondaryPanel);
}

// ------------------------------------------------------------
// Función para alternar entre Celsius y Fahrenheit
function toggleTemperatureUnit() {
    isCelsius = !isCelsius;
    const toggleBtn = document.querySelector('.temp-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = isCelsius ? '°F' : '°C';
    }
    
    // Si hay datos mostrados, refrescar con las nuevas unidades
    const cityInput = document.querySelector('.cityInput');
    if (cityInput && cityInput.value.trim()) {
        const city = cityInput.value.trim();
        getWeather(city).then(displayWeatherInfo).catch(err => {
            displayError(err.message);
        });
    }
}

// ------------------------------------------------------------
// Función para obtener el emoji según el código de clima
function getWeatherEmoji(weatherId) {
    if (typeof weatherId !== 'number') return '🌈';
    if (weatherId >= 200 && weatherId < 300) return '⛈️';      // Tormenta eléctrica
    if (weatherId >= 300 && weatherId < 500) return '🌦️';      // Lluvia ligera
    if (weatherId >= 500 && weatherId < 600) return '🌧️';      // Lluvia
    if (weatherId >= 600 && weatherId < 700) return '❄️';      // Nieve
    if (weatherId >= 700 && weatherId < 800) return '🌫️';      // Neblina
    if (weatherId === 800) return '☀️';                        // Despejado
    if (weatherId > 800 && weatherId < 900) return '☁️';       // Nublado
    return '🌈';                                                // Otro
}

// ------------------------------------------------------------
// Función para mostrar mensaje de carga
function showLoading() {
    card.innerHTML = '';
    card.style.display = 'flex';

    const loading = document.createElement('p');
    loading.textContent = 'Loading...';
    card.appendChild(loading);
}

// ------------------------------------------------------------
// Función para mostrar mensajes de error en la tarjeta
function displayError(message) {
    card.innerHTML = '';
    card.style.display = 'flex';

    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.className = 'errorDisplay';
    card.appendChild(errorDisplay);
}
