    
    const weatherForm = document.querySelector('.weatherForm');
    const cityInput = document.querySelector('.cityInput');
    const card = document.querySelector('.card');

    
    const apiKey = 'b8fe6805b74a15b5786467b2f27ca0bf';

    function debugLog(...args) {
    console.log('[WeatherApp]', ...args);
    }

    weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        displayError('Please enter a city name');
        return;
    }

    if (!apiKey || apiKey === '' ) {
        displayError('API key not configured in index.js');
        debugLog('Missing API key');
        return;
    }

    try {
        showLoading();
        const weatherData = await getWeather(city);
        displayWeatherInfo(weatherData);
    } catch (err) {
        const msg = (err && err.message) ? err.message : String(err);
        displayError(msg);
        debugLog('Error:', err);
    }
    });

    async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
    debugLog('Fetching:', url);

    let response;
    try {
        response = await fetch(url);
    } catch (networkErr) {
        debugLog('Network error:', networkErr);
        throw new Error('Network error: cannot reach OpenWeatherMap. Check internet or browser extensions.');
    }

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

    try {
        const data = await response.json();
        debugLog('Received data:', data);
        return data;
    } catch (err) {
        debugLog('JSON parse error:', err);
        throw new Error('Invalid JSON from API.');
    }
    }

    function displayWeatherInfo(data) {
    const {
        name: cityName,
        main: { temp, humidity } = {},
        weather = []
    } = data;

    const weatherObj = weather[0] || {};
    const weatherId = weatherObj.id;
    const description = weatherObj.description || '';

    card.innerHTML = '';
    card.style.display = 'flex';

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

    card.appendChild(cityEl);
    card.appendChild(emojiEl);
    card.appendChild(tempEl);
    if (humidityEl.textContent) card.appendChild(humidityEl);
    if (description) card.appendChild(descEl);
    }

    function getWeatherEmoji(weatherId) {
    if (typeof weatherId !== 'number') return '🌈';
    if (weatherId >= 200 && weatherId < 300) return '⛈️';
    if (weatherId >= 300 && weatherId < 500) return '🌦️';
    if (weatherId >= 500 && weatherId < 600) return '🌧️';
    if (weatherId >= 600 && weatherId < 700) return '❄️';
    if (weatherId >= 700 && weatherId < 800) return '🌫️';
    if (weatherId === 800) return '☀️';
    if (weatherId > 800 && weatherId < 900) return '☁️';
    return '🌈';
    }

    function showLoading() {
    card.innerHTML = '';
    card.style.display = 'flex';
    const loading = document.createElement('p');
    loading.textContent = 'Loading...';
    card.appendChild(loading);
    }

    function displayError(message) {
    card.innerHTML = '';
    card.style.display = 'flex';
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.className = 'errorDisplay';
    card.appendChild(errorDisplay);
    }
