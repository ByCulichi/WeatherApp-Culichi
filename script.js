// ============================================================
// Weather App - JavaScript Logic (script.js)
// ============================================================
// 
// Este archivo contiene toda la lógica principal para obtener y mostrar
// el clima actual de una ciudad usando la API de OpenWeatherMap.
// 
// Funcionalidades implementadas:
// - Validación de entrada del usuario
// - Llamadas asíncronas a la API de OpenWeatherMap
// - Manejo comprehensivo de errores (red, API, validación)
// - Manipulación dinámica del DOM para mostrar resultados
// - Estados de carga y mensajes informativos
// - Mapeo de códigos de clima a emojis representativos
// - Logging para depuración durante el desarrollo
//
// Arquitectura del código:
// 1. Configuración inicial y constantes
// 2. Event listeners para interacciones del usuario
// 3. Funciones para comunicación con la API
// 4. Funciones para manipulación del DOM
// 5. Utilidades y helpers (emojis, logging)
//
// ============================================================

// ------------------------------------------------------------
// CONFIGURACIÓN INICIAL Y CONSTANTES
// ------------------------------------------------------------

// Elementos principales del DOM que se utilizarán en toda la aplicación
const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');

// Clave de API para OpenWeatherMap 
// IMPORTANTE: Debes reemplazarla por tu propia clave de API
// Obtén una gratis en: https://openweathermap.org/api
const apiKey = 'b8fe6805b74a15b5786467b2f27ca0bf';

// ------------------------------------------------------------
// UTILIDADES Y FUNCIONES DE DEPURACIÓN
// ------------------------------------------------------------

/**
 * Función de depuración para mostrar mensajes en consola
 * Propósito: Facilitar el debugging durante el desarrollo
 * @param {...any} args - Argumentos a mostrar en la consola
 */
function debugLog(...args) {
    console.log('[WeatherApp]', ...args);
}

// ------------------------------------------------------------
// MANEJO DE EVENTOS Y LÓGICA PRINCIPAL
// ------------------------------------------------------------

/**
 * Event listener principal: maneja el envío del formulario de búsqueda
 * Este es el punto de entrada principal de la aplicación
 */
weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita recargar la página al enviar el formulario

    // Obtiene y limpia la entrada del usuario
    const city = cityInput.value.trim();

    // Validación 1: Verifica que se haya ingresado un nombre de ciudad
    if (!city) {
        displayError('Please enter a city name');
        return;
    }

    // Validación 2: Verifica que la clave de API esté configurada
    if (!apiKey || apiKey === '') {
        displayError('API key not configured in script.js');
        debugLog('Missing API key');
        return;
    }

    // Ejecuta la búsqueda del clima con manejo de errores
    try {
        showLoading(); // Muestra estado de carga al usuario
        const weatherData = await getWeather(city); // Obtiene datos del clima
        displayWeatherInfo(weatherData); // Muestra la información en la interfaz
    } catch (err) {
        // Manejo de errores: extrae el mensaje de error y lo muestra
        const msg = (err && err.message) ? err.message : String(err);
        displayError(msg); // Muestra error en la interfaz
        debugLog('Error:', err); // Registra error completo en consola para desarrollo
    }
});

// ------------------------------------------------------------
// COMUNICACIÓN CON LA API DE OPENWEATHERMAP
// ------------------------------------------------------------

/**
 * Función asíncrona para obtener datos del clima desde la API
 * @param {string} city - Nombre de la ciudad a buscar
 * @returns {Promise<Object>} - Datos del clima en formato JSON
 * @throws {Error} - Diversos tipos de errores de red o API
 */
async function getWeather(city) {
    // Construye la URL de la API con parámetros codificados
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
    debugLog('Fetching weather data from:', url);

    let response;
    
    // Intento de conexión con manejo de errores de red
    try {
        response = await fetch(url);
    } catch (networkErr) {
        debugLog('Network error occurred:', networkErr);
        throw new Error('Network error: cannot reach OpenWeatherMap. Check internet or browser extensions.');
    }

    // Manejo de errores HTTP basados en códigos de estado
    if (!response.ok) {
        let bodyText = '';
        
        // Intenta extraer el mensaje de error del cuerpo de la respuesta
        try {
            const json = await response.json();
            bodyText = json && json.message ? json.message : JSON.stringify(json);
        } catch (parseErr) {
            bodyText = await response.text().catch(() => '(no body)');
        }

        debugLog('HTTP error', response.status, response.statusText, 'body:', bodyText);

        // Manejo específico de errores comunes de la API
        if (response.status === 401) throw new Error(`Unauthorized (401): invalid API key. ${bodyText}`);
        if (response.status === 404) throw new Error(`City not found (404). Check spelling. ${bodyText}`);
        if (response.status === 429) throw new Error(`Too many requests (429). You may be rate-limited. ${bodyText}`);
        
        // Error genérico para otros códigos de estado
        throw new Error(`HTTP ${response.status} — ${response.statusText}. ${bodyText}`);
    }

    // Procesa la respuesta JSON exitosa
    try {
        const data = await response.json();
        debugLog('Successfully received weather data:', data);
        return data;
    } catch (err) {
        debugLog('JSON parse error:', err);
        throw new Error('Invalid JSON from API.');
    }
}

// ------------------------------------------------------------
// MANIPULACIÓN DEL DOM Y RENDERIZADO DE LA INTERFAZ
// ------------------------------------------------------------

/**
 * Función para mostrar la información del clima en la tarjeta
 * Crea dinámicamente los elementos HTML y los inserta en el DOM
 * @param {Object} data - Datos del clima recibidos de la API
 */
function displayWeatherInfo(data) {
    // Desestructuración de datos principales con valores por defecto
    const {
        name: cityName,                    // Nombre de la ciudad
        main: { temp, humidity } = {},     // Temperatura y humedad
        weather = []                       // Array de condiciones climáticas
    } = data;

    // Extrae información del primer elemento de weather (condición principal)
    const weatherObj = weather[0] || {};
    const weatherId = weatherObj.id;            // Código numérico del clima
    const description = weatherObj.description || '';  // Descripción textual

    // Limpia el contenido anterior y muestra la tarjeta
    card.innerHTML = '';
    card.style.display = 'flex';

    // Creación de elementos DOM para mostrar la información
    
    // Elemento del nombre de la ciudad (título principal)
    const cityEl = document.createElement('h2');
    cityEl.textContent = cityName || 'Unknown';

    // Elemento del emoji representativo del clima
    const emojiEl = document.createElement('p');
    emojiEl.className = 'weatherEmoji';
    emojiEl.textContent = getWeatherEmoji(weatherId);

    // Elemento de la temperatura con formato específico
    const tempEl = document.createElement('p');
    tempEl.className = 'temp';
    tempEl.textContent = (typeof temp === 'number') ? `${temp.toFixed(1)}°F` : 'N/A';

    // Elemento de la humedad (solo se muestra si hay datos válidos)
    const humidityEl = document.createElement('p');
    humidityEl.className = 'humidity';
    humidityEl.textContent = (typeof humidity === 'number') ? `Humidity: ${humidity}%` : '';

    // Elemento de la descripción del clima
    const descEl = document.createElement('p');
    descEl.className = 'desc';
    descEl.textContent = description;

    // Añade todos los elementos a la tarjeta en orden específico
    card.appendChild(cityEl);
    card.appendChild(emojiEl);
    card.appendChild(tempEl);
    // Solo añade humedad si tiene contenido
    if (humidityEl.textContent) card.appendChild(humidityEl);
    // Solo añade descripción si existe
    if (description) card.appendChild(descEl);
}

// ------------------------------------------------------------
// FUNCIONES UTILITARIAS Y MAPEO DE DATOS
// ------------------------------------------------------------

/**
 * Función para obtener el emoji apropiado según el código de clima
 * Mapea los códigos numéricos de OpenWeatherMap a emojis representativos
 * @param {number} weatherId - Código numérico del clima de la API
 * @returns {string} - Emoji correspondiente al tipo de clima
 */
function getWeatherEmoji(weatherId) {
    // Validación: si no es un número, devuelve emoji por defecto
    if (typeof weatherId !== 'number') return '🌈';
    
    // Mapeo basado en rangos de códigos de OpenWeatherMap:
    // https://openweathermap.org/weather-conditions
    
    if (weatherId >= 200 && weatherId < 300) return '⛈️';      // Tormenta eléctrica (200-299)
    if (weatherId >= 300 && weatherId < 500) return '🌦️';      // Lluvia ligera/llovizna (300-499)
    if (weatherId >= 500 && weatherId < 600) return '🌧️';      // Lluvia (500-599)
    if (weatherId >= 600 && weatherId < 700) return '❄️';      // Nieve (600-699)
    if (weatherId >= 700 && weatherId < 800) return '🌫️';      // Atmósfera: neblina, humo (700-799)
    if (weatherId === 800) return '☀️';                        // Cielo despejado (800)
    if (weatherId > 800 && weatherId < 900) return '☁️';       // Nublado (801-899)
    
    return '🌈';                                                // Condiciones no reconocidas
}

// ------------------------------------------------------------
// ESTADOS DE LA INTERFAZ DE USUARIO
// ------------------------------------------------------------

/**
 * Función para mostrar mensaje de carga mientras se obtienen los datos
 * Proporciona feedback visual al usuario durante las llamadas a la API
 */
function showLoading() {
    card.innerHTML = '';  // Limpia contenido anterior
    card.style.display = 'flex';  // Hace visible la tarjeta

    // Crea y añade elemento de carga
    const loading = document.createElement('p');
    loading.textContent = 'Loading...';
    loading.className = 'loading-message';  // Clase para posibles estilos futuros
    card.appendChild(loading);
}

/**
 * Función para mostrar mensajes de error en la tarjeta
 * Maneja la presentación visual de todos los tipos de errores
 * @param {string} message - Mensaje de error a mostrar al usuario
 */
function displayError(message) {
    card.innerHTML = '';  // Limpia contenido anterior
    card.style.display = 'flex';  // Hace visible la tarjeta

    // Crea elemento de error con clase específica para estilos
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.className = 'errorDisplay';  // Clase CSS para styling de errores
    card.appendChild(errorDisplay);
}
