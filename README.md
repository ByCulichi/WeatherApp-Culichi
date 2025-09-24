# Weather App

A beautiful, responsive weather application that provides real-time weather information for any city worldwide.

## Demo

<img src="https://github.com/SoyCulichi/WeatherApp-Culichi/blob/main/Weatherapp.gif" width="250px">

Simple client-side Weather App that fetches current weather from OpenWeatherMap and displays it in a small card with a modern, gradient design.

## Features
- 🌍 **City Search**: Search by city name from anywhere in the world
- 🌡️ **Temperature Display**: Shows current temperature in Fahrenheit
- 💧 **Humidity Information**: Displays current humidity percentage
- 📝 **Weather Description**: Provides detailed weather conditions
- 🎨 **Weather Emojis**: Visual representation of weather conditions
- ⏳ **Loading States**: Smooth loading indicators during API calls
- 🚨 **Error Handling**: Comprehensive error messages for various scenarios
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ♿ **Accessibility**: Screen reader friendly with proper ARIA labels

## Project Structure

```
WeatherApp-Culichi/
├── index.html          # Main HTML structure and semantic layout
├── style.css           # Styling with CSS variables and responsive design
├── script.js           # JavaScript logic for API calls and DOM manipulation
├── README.md           # This documentation file
├── Weatherapp.gif      # Demo animation
└── .git/              # Git version control
```

## Code Architecture

### HTML Structure (`index.html`)
- **Semantic HTML5**: Uses proper semantic elements like `<main>`, `<header>`, `<section>`
- **Accessibility**: Includes ARIA labels and live regions for screen readers
- **Meta Tags**: Proper viewport and charset configuration for mobile responsiveness

### Styling (`style.css`)
- **CSS Custom Properties**: Uses CSS variables for consistent theming
- **Flexbox Layout**: Modern CSS layout for responsive design
- **Gradient Backgrounds**: Beautiful linear gradients for visual appeal
- **Mobile-First**: Responsive design with media queries for mobile devices

### JavaScript Logic (`script.js`)
- **Modern ES6+**: Uses async/await, destructuring, and arrow functions
- **API Integration**: Fetches data from OpenWeatherMap API
- **Error Handling**: Comprehensive error handling for network and API errors
- **DOM Manipulation**: Dynamic content creation and updates
- **Debug Logging**: Built-in debugging function for development

## Setup & Usage

### 1. Get an API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api) and sign up for a free account
2. Navigate to the "Current Weather Data" API section
3. Generate your free API key (you get 1000 free calls per day)

### 2. Configure the Application
1. Clone or download this repository
2. Open `script.js` in a text editor
3. Replace the API key on line 14:
   ```javascript
   const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
   ```

### 3. Run the Application
1. Open `index.html` in any modern web browser
2. Enter a city name (e.g., "London", "New York", "Tokyo")
3. Click "Get Weather" or press Enter
4. View the weather information displayed in the card

### 4. Development Server (Optional)
For development, you can use a local server to avoid CORS issues:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## API Information

This app uses the [OpenWeatherMap Current Weather API](https://openweathermap.org/current):
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Units**: Imperial (Fahrenheit, miles/hour)
- **Rate Limit**: 1000 calls/day (free tier)
- **Response Format**: JSON

### Example API Response
```json
{
  "name": "London",
  "main": {
    "temp": 72.5,
    "humidity": 65
  },
  "weather": [
    {
      "id": 800,
      "description": "clear sky"
    }
  ]
}
```

## Weather Emoji Mapping

The app displays weather-appropriate emojis based on OpenWeatherMap condition codes:

| Weather Condition | Code Range | Emoji |
|------------------|------------|--------|
| Thunderstorm     | 200-299    | ⛈️     |
| Light Rain       | 300-499    | 🌦️     |
| Rain             | 500-599    | 🌧️     |
| Snow             | 600-699    | ❄️     |
| Atmosphere (Fog) | 700-799    | 🌫️     |
| Clear Sky        | 800        | ☀️     |
| Clouds           | 801-899    | ☁️     |
| Other/Unknown    | Default    | 🌈     |

## Error Handling

The application handles various error scenarios:

- **Empty Input**: Prompts user to enter a city name
- **Invalid API Key**: Shows configuration error message
- **City Not Found**: Displays helpful message for misspelled cities
- **Network Errors**: Handles connection issues and timeouts
- **Rate Limiting**: Informs user about API quota exceeded
- **Invalid JSON**: Handles malformed API responses

## Troubleshooting

### Common Issues

**1. "API key not configured" Error**
- Solution: Replace the placeholder API key in `script.js` with your actual OpenWeatherMap API key

**2. "City not found" Error**
- Solution: Check spelling of the city name or try a more specific location (e.g., "Paris, FR")

**3. "Network error" Message**
- Solution: Check internet connection or disable browser extensions that might block API requests

**4. No weather data appears**
- Solution: Open browser Developer Tools (F12) and check the Console for error messages

**5. CORS Errors (in Development)**
- Solution: Use a local development server instead of opening the HTML file directly

### API Key Issues
- Ensure your API key is active (it can take up to 10 minutes after signup)
- Check that you haven't exceeded the free tier limit (1000 calls/day)
- Verify the API key is correctly pasted without extra spaces

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Required Features:**
- ES6+ support (async/await, destructuring)
- Fetch API
- CSS Custom Properties
- Flexbox

## Contributing

This is a simple educational project demonstrating:
- Modern JavaScript (ES6+)
- API integration
- Responsive web design
- Error handling best practices
- Accessibility considerations

Feel free to fork and enhance the project!

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Created by [ByCulichi](https://github.com/ByCulichi)
- Emojis provided by system fonts
