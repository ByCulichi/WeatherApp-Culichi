// Weather App 

const wehatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const cityName = document.querySelector('.cityName');
const card = document.querySelector('.card');
const apiKey = "b8fe6805b74a15b5786467b2f27ca0bf";

wehatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value;
    
    if (city) {

    } else {

        displayError("Please enter a city name");
    }
});

async function getWeather(city) {
    }

    function displayWeatherInfo(data){

    }

    function getWeatherEmoji(weatherId){

    }

    function displayError(message){
        const errorDisplay = document.createElement('p');
        errorDisplay.textContent = message;
        errorDisplay.classList.add('errorDisplay');

        card.textContent = '';
        card.style.display = 'flex';
        card.appendChild(errorDisplay);

    }