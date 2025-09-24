// ============================================================
// Weather App - script.js
// ------------------------------------------------------------
// Este archivo contiene la lógica principal para obtener y mostrar
// el clima actual de una ciudad usando la API de OpenWeatherMap.
//
// Funcionalidades principales:
// - Búsqueda de clima por nombre de ciudad
// - Visualización de datos meteorológicos con emojis
// - Manejo de errores y estados de carga
// - Diseño responsive y accesible
// ============================================================

/**
 * Configuración de la aplicación
 * IMPORTANTE: Para uso en producción, mueve la API key a variables de entorno
 */
const CONFIG = {
    // API key de OpenWeatherMap - Reemplaza con tu propia clave
    API_KEY: 'b8fe6805b74a15b5786467b2f27ca0bf',
    // URL base de la API de OpenWeatherMap
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    // Unidades de medida (imperial = Fahrenheit, metric = Celsius)
    UNITS: 'imperial'
};

/**
 * Referencias a elementos principales del DOM
 * Estos elementos se utilizan para la interacción con el usuario
 */
const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.getElementById('cityInput'); // Cambiado para usar ID
const card = document.querySelector('.card');

// Mantenemos compatibilidad con el código existente
const apiKey = CONFIG.API_KEY;

// ------------------------------------------------------------
/**
 * Función de depuración para mostrar mensajes estructurados en la consola
 * 
 * @param {...any} args - Argumentos a mostrar en la consola
 * @description Útil para debugging durante el desarrollo. 
 *              Prefija todos los logs con [WeatherApp] para fácil identificación.
 * @example debugLog('Fetching data for:', cityName);
 */
function debugLog(...args) {
    console.log('[WeatherApp]', ...args);
}

// ------------------------------------------------------------
/**
 * Manejador del evento de envío del formulario de búsqueda de clima
 * 
 * @description Esta función se ejecuta cuando el usuario envía el formulario.
 *              Realiza validaciones, obtiene los datos del clima y los muestra.
 *              Incluye manejo completo de errores y estados de carga.
 * 
 * Flujo de ejecución:
 * 1. Previene la recarga de página
 * 2. Valida que el usuario haya ingresado una ciudad
 * 3. Verifica que exista la API key
 * 4. Muestra estado de carga
 * 5. Realiza petición a la API
 * 6. Muestra los resultados o error
 */
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
/**
 * Obtiene los datos del clima desde la API de OpenWeatherMap
 * 
 * @param {string} city - Nombre de la ciudad para buscar el clima
 * @returns {Promise<Object>} Promesa que resuelve con los datos del clima
 * @throws {Error} Si hay problemas de red, API key inválida, ciudad no encontrada, etc.
 * 
 * @description Esta función realiza una petición HTTP a la API de OpenWeatherMap
 *              y maneja diferentes tipos de errores que pueden ocurrir:
 *              - Errores de red (sin internet, bloqueos)
 *              - Errores HTTP (401: API key inválida, 404: ciudad no encontrada)
 *              - Errores de parsing JSON
 * 
 * Estructura de datos devueltos por la API:
 * {
 *   name: string,           // Nombre de la ciudad
 *   main: {
 *     temp: number,         // Temperatura actual
 *     humidity: number      // Humedad (porcentaje)
 *   },
 *   weather: [{
 *     id: number,          // ID del clima (para emoji)
 *     description: string  // Descripción del clima
 *   }]
 * }
 * 
 * @example
 * try {
 *   const data = await getWeather('London');
 *   console.log(`Temperatura en ${data.name}: ${data.main.temp}°F`);
 * } catch (error) {
 *   console.error('Error al obtener clima:', error.message);
 * }
 */
async function getWeather(city) {
    const url = `${CONFIG.API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
    debugLog('Fetching:', url);

    let response;
    try {
        response = await fetch(url);
    } catch (networkErr) {
        debugLog('Network error:', networkErr);
        throw new Error('Network error: cannot reach OpenWeatherMap. Check internet or browser extensions.');
    }

    // Manejo de errores HTTP específicos
    if (!response.ok) {
        let bodyText = '';
        try {
            const json = await response.json();
            bodyText = json && json.message ? json.message : JSON.stringify(json);
        } catch (parseErr) {
            bodyText = await response.text().catch(() => '(no body)');
        }

        debugLog('HTTP error', response.status, response.statusText, 'body:', bodyText);

        // Mensajes de error específicos y útiles para el usuario
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
/**
 * Muestra la información del clima en la tarjeta de la interfaz
 * 
 * @param {Object} data - Datos del clima obtenidos de la API de OpenWeatherMap
 * @param {string} data.name - Nombre de la ciudad
 * @param {Object} data.main - Datos principales del clima
 * @param {number} data.main.temp - Temperatura actual
 * @param {number} data.main.humidity - Humedad (porcentaje)
 * @param {Array<Object>} data.weather - Array con información del clima
 * @param {number} data.weather[0].id - ID del clima para determinar emoji
 * @param {string} data.weather[0].description - Descripción textual del clima
 * 
 * @description Esta función toma los datos JSON de la API y los convierte en
 *              elementos HTML que se muestran en la tarjeta. Incluye validación
 *              de datos y manejo de casos donde falten algunos valores.
 * 
 * Elementos creados dinámicamente:
 * - Título con nombre de la ciudad
 * - Emoji representativo del clima
 * - Temperatura en grados Fahrenheit
 * - Porcentaje de humedad (solo si está disponible)
 * - Descripción del clima (solo si está disponible)
 * 
 * @example
 * const apiData = {
 *   name: 'London',
 *   main: { temp: 72.5, humidity: 65 },
 *   weather: [{ id: 800, description: 'clear sky' }]
 * };
 * displayWeatherInfo(apiData);
 */
function displayWeatherInfo(data) {
    // Desestructura los datos principales con valores por defecto
    const {
        name: cityName,
        main: { temp, humidity } = {},
        weather = []
    } = data;

    const weatherObj = weather[0] || {};
    const weatherId = weatherObj.id;
    const description = weatherObj.description || '';

    // Limpia la tarjeta y la hace visible
    card.innerHTML = '';
    card.style.display = 'flex';

    // Crear elementos de la interfaz
    const cityEl = document.createElement('h2');
    cityEl.textContent = cityName || 'Unknown';

    const emojiEl = document.createElement('p');
    emojiEl.className = 'weatherEmoji';
    emojiEl.textContent = getWeatherEmoji(weatherId);

    const tempEl = document.createElement('p');
    tempEl.className = 'temp';
    tempEl.textContent = (typeof temp === 'number') ? `${temp.toFixed(1)}°F` : 'N/A';

    const humidityEl = document.createElement('p');
    humidityEl.className = 'humidity';
    humidityEl.textContent = (typeof humidity === 'number') ? `Humidity: ${humidity}%` : '';

    const descEl = document.createElement('p');
    descEl.className = 'desc';
    descEl.textContent = description;

    // Añade los elementos a la tarjeta (solo si tienen contenido)
    card.appendChild(cityEl);
    card.appendChild(emojiEl);
    card.appendChild(tempEl);
    if (humidityEl.textContent) card.appendChild(humidityEl);
    if (description) card.appendChild(descEl);
}

// ------------------------------------------------------------
/**
 * Determina el emoji apropiado basado en el código de clima de OpenWeatherMap
 * 
 * @param {number} weatherId - ID del clima proporcionado por OpenWeatherMap API
 * @returns {string} Emoji que representa las condiciones climáticas
 * 
 * @description Los códigos de OpenWeatherMap siguen un patrón específico:
 *              2xx: Tormentas eléctricas
 *              3xx: Llovizna
 *              5xx: Lluvia
 *              6xx: Nieve
 *              7xx: Atmósfera (niebla, humo, etc.)
 *              800: Cielo despejado
 *              8xx: Nubes
 * 
 * Referencias:
 * - OpenWeatherMap Weather Conditions: https://openweathermap.org/weather-conditions
 * 
 * @example
 * getWeatherEmoji(800);  // returns '☀️' (despejado)
 * getWeatherEmoji(801);  // returns '☁️' (nublado)
 * getWeatherEmoji(500);  // returns '🌧️' (lluvia)
 */
function getWeatherEmoji(weatherId) {
    // Validación de tipo de dato
    if (typeof weatherId !== 'number') return '🌈';
    
    // Mapeo de rangos de códigos a emojis apropiados
    if (weatherId >= 200 && weatherId < 300) return '⛈️';      // Tormenta eléctrica
    if (weatherId >= 300 && weatherId < 500) return '🌦️';      // Lluvia ligera/llovizna
    if (weatherId >= 500 && weatherId < 600) return '🌧️';      // Lluvia
    if (weatherId >= 600 && weatherId < 700) return '❄️';      // Nieve
    if (weatherId >= 700 && weatherId < 800) return '🌫️';      // Neblina/atmósfera
    if (weatherId === 800) return '☀️';                        // Despejado
    if (weatherId > 800 && weatherId < 900) return '☁️';       // Nublado
    
    return '🌈';                                                // Condición desconocida
}

// ------------------------------------------------------------
/**
 * Muestra un indicador de carga en la tarjeta mientras se obtienen datos
 * 
 * @description Esta función limpia la tarjeta y muestra un mensaje de "Loading..."
 *              para proporcionar feedback visual al usuario durante las peticiones
 *              a la API. Mejora la experiencia de usuario indicando que la
 *              aplicación está procesando la solicitud.
 * 
 * @example showLoading(); // Muestra "Loading..." en la tarjeta
 */
function showLoading() {
    card.innerHTML = '';
    card.style.display = 'flex';

    const loading = document.createElement('p');
    loading.textContent = 'Loading...';
    loading.setAttribute('aria-live', 'polite'); // Para accesibilidad
    card.appendChild(loading);
}

// ------------------------------------------------------------
/**
 * Muestra mensajes de error en la tarjeta de la interfaz
 * 
 * @param {string} message - Mensaje de error a mostrar al usuario
 * 
 * @description Esta función limpia la tarjeta y muestra un mensaje de error
 *              con estilos apropriados (definidos en CSS con .errorDisplay).
 *              Los errores se muestran en un color distintivo para alertar
 *              al usuario sobre problemas.
 * 
 * Tipos comunes de errores que maneja:
 * - Ciudad no encontrada (404)
 * - API key inválida (401)
 * - Límite de peticiones excedido (429)
 * - Errores de red/conexión
 * 
 * @example
 * displayError('City not found. Please check spelling.');
 * displayError('Network error: check your internet connection.');
 */
function displayError(message) {
    card.innerHTML = '';
    card.style.display = 'flex';

    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.className = 'errorDisplay';
    errorDisplay.setAttribute('role', 'alert'); // Para accesibilidad
    errorDisplay.setAttribute('aria-live', 'assertive'); // Anuncia errores inmediatamente
    card.appendChild(errorDisplay);
}
