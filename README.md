# 🌤️ Weather App - Aplicación del Clima

Una aplicación web sencilla y elegante para consultar el clima actual de cualquier ciudad del mundo usando la API de OpenWeatherMap.

![Weather App Screenshot](https://github.com/user-attachments/assets/4c912a26-b2bf-49b0-848e-ad4b52668423)

## 📱 Demo en Vivo

![Demo Animation](https://github.com/SoyCulichi/WeatherApp-Culichi/blob/main/Weatherapp.gif)

## ✨ Características

- 🔍 **Búsqueda por ciudad**: Ingresa el nombre de cualquier ciudad del mundo
- 🌡️ **Temperatura actual**: Muestra la temperatura en grados Fahrenheit
- 💧 **Información de humedad**: Porcentaje de humedad actual
- 🌈 **Emojis del clima**: Representación visual intuitiva de las condiciones meteorológicas
- ⚡ **Carga rápida**: Interfaz optimizada y responsiva
- 🔄 **Manejo de errores**: Mensajes claros para diferentes tipos de errores
- ♿ **Accesible**: Diseñado siguiendo las mejores prácticas de accesibilidad web
- 📱 **Responsive**: Funciona perfectamente en dispositivos móviles y de escritorio

## 🏗️ Estructura del Proyecto

```
WeatherApp-Culichi/
├── 📄 index.html          # Estructura HTML principal
├── 🎨 style.css           # Estilos CSS y diseño responsivo
├── ⚙️ script.js           # Lógica JavaScript y llamadas a la API
├── 📖 README.md           # Este archivo de documentación
└── 🎬 Weatherapp.gif      # Demostración animada
```

### 📄 Descripción de Archivos

| Archivo | Propósito | Características Clave |
|---------|-----------|----------------------|
| `index.html` | Estructura base de la aplicación | Semántica HTML5, accesibilidad, SEO |
| `style.css` | Diseño visual y responsivo | Variables CSS, gradientes, media queries |
| `script.js` | Funcionalidad e interactividad | API calls, manejo de errores, DOM manipulation |

## 🚀 Configuración e Instalación

### 1️⃣ Obtener API Key

1. Visita [OpenWeatherMap](https://openweathermap.org/api)
2. Regístrate para obtener una cuenta gratuita
3. Ve a "API keys" en tu dashboard
4. Copia tu API key personal

### 2️⃣ Configurar la Aplicación

1. **Clona o descarga este repositorio**
   ```bash
   git clone https://github.com/ByCulichi/WeatherApp-Culichi.git
   cd WeatherApp-Culichi
   ```

2. **Configura tu API key**
   
   Abre `script.js` y reemplaza la API key en la configuración:
   
   ```javascript
   const CONFIG = {
       // 🔑 Reemplaza con tu API key personal
       API_KEY: 'TU_API_KEY_AQUI',
       API_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
       UNITS: 'imperial'
   };
   ```

3. **Ejecuta la aplicación**
   
   Puedes usar cualquiera de estos métodos:
   
   **Opción A: Servidor HTTP simple con Python**
   ```bash
   python -m http.server 8080
   # Luego abre http://localhost:8080 en tu navegador
   ```
   
   **Opción B: Servidor HTTP simple con Node.js**
   ```bash
   npx http-server -p 8080
   # Luego abre http://localhost:8080 en tu navegador
   ```
   
   **Opción C: Abrir directamente en el navegador**
   Simplemente abre `index.html` en tu navegador web favorito.

## 🎯 Cómo Usar

1. **Ingresa una ciudad**: Escribe el nombre de la ciudad en el campo de búsqueda
2. **Haz clic en "Obtener Clima"**: O presiona Enter para buscar
3. **Ve los resultados**: La información del clima aparecerá en una tarjeta elegante

### 💡 Ejemplos de Búsquedas Válidas

- `London` - Ciudad simple
- `New York` - Ciudad con espacio
- `México` - Ciudad con acentos
- `Tokyo, JP` - Ciudad con código de país
- `Madrid, ES` - Especificar país para mayor precisión

## 🧩 Arquitectura del Código

### 📦 Funciones Principales

#### 🔍 `getWeather(city)`
```javascript
/**
 * Obtiene datos del clima desde la API de OpenWeatherMap
 * @param {string} city - Nombre de la ciudad
 * @returns {Promise<Object>} Datos del clima
 */
```

#### 🎨 `displayWeatherInfo(data)`
```javascript
/**
 * Muestra la información del clima en la interfaz
 * @param {Object} data - Datos de la API
 */
```

#### 😊 `getWeatherEmoji(weatherId)`
```javascript
/**
 * Determina el emoji apropiado para el código de clima
 * @param {number} weatherId - ID de OpenWeatherMap
 * @returns {string} Emoji correspondiente
 */
```

### 🎨 Mapeo de Emojis por Condiciones Climáticas

| Condición | Código API | Emoji | Descripción |
|-----------|------------|-------|-------------|
| Tormenta | 2xx | ⛈️ | Tormenta eléctrica |
| Llovizna | 3xx | 🌦️ | Lluvia ligera |
| Lluvia | 5xx | 🌧️ | Lluvia moderada/intensa |
| Nieve | 6xx | ❄️ | Nieve |
| Atmósfera | 7xx | 🌫️ | Neblina, humo, polvo |
| Despejado | 800 | ☀️ | Cielo claro |
| Nublado | 8xx | ☁️ | Nubes parciales/totales |

## 🛠️ Para Desarrolladores

### 🎓 Conceptos Aprendidos

Este proyecto es perfecto para aprender:

- **JavaScript Asíncrono**: `async/await`, `fetch()`, Promises
- **Manipulación del DOM**: `createElement()`, `appendChild()`
- **Manejo de Errores**: `try/catch`, validaciones de entrada
- **APIs REST**: Peticiones HTTP, códigos de estado
- **CSS Moderno**: Variables CSS, Flexbox, Grid, responsive design
- **Accesibilidad Web**: ARIA attributes, lectores de pantalla
- **Estructuración de código**: Funciones puras, separación de responsabilidades

### 🔧 Mejoras Sugeridas

¿Quieres contribuir? Aquí hay algunas ideas:

- [ ] **🌡️ Selector de unidades**: Celsius vs Fahrenheit
- [ ] **📍 Geolocalización**: Detectar ubicación del usuario automáticamente
- [ ] **⏰ Pronóstico extendido**: Mostrar clima de varios días
- [ ] **🌓 Modo oscuro**: Toggle entre tema claro y oscuro
- [ ] **💾 Historial**: Guardar ciudades buscadas recientemente
- [ ] **📊 Más datos**: Velocidad del viento, presión atmosférica
- [ ] **🌍 Internacionalización**: Soporte para múltiples idiomas

### 🧪 Debugging

Si encuentras problemas:

1. **Abre las DevTools** (F12) en tu navegador
2. **Revisa la consola** para mensajes de error con prefijo `[WeatherApp]`
3. **Verifica tu API key** en la configuración
4. **Comprueba tu conexión a internet**

### 📊 Códigos de Error Comunes

| Código | Significado | Solución |
|--------|-------------|----------|
| 401 | API key inválida | Verifica tu API key en script.js |
| 404 | Ciudad no encontrada | Revisa la ortografía de la ciudad |
| 429 | Límite de peticiones excedido | Espera un momento antes de buscar de nuevo |

## 🔐 Mejores Prácticas de Seguridad

⚠️ **Importante**: En este ejemplo, la API key está hardcodeada para simplicidad educativa. En producción:

1. **Usa variables de entorno**:
   ```javascript
   const API_KEY = process.env.OPENWEATHER_API_KEY;
   ```

2. **Implementa un backend**: Para ocultar credenciales del cliente
3. **Limita tu API key**: En el dashboard de OpenWeatherMap
4. **Monitorea el uso**: Para evitar cargos inesperados

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**ByCulichi**
- GitHub: [@ByCulichi](https://github.com/ByCulichi)

## 🙏 Agradecimientos

- [OpenWeatherMap](https://openweathermap.org/) por su excelente API gratuita
- [Emojis](https://emojipedia.org/) para la representación visual del clima
- La comunidad de desarrolladores por feedback y sugerencias

---

**¿Te gusta este proyecto?** ⭐ Dale una estrella en GitHub y compártelo con otros desarrolladores!

**¿Problemas o sugerencias?** 🐛 Abre un [issue](https://github.com/ByCulichi/WeatherApp-Culichi/issues) y te ayudaremos.
