function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm"
  };

  return weatherCodes[code] || "Unknown weather condition";
}

async function getWeather() {
  let city = document.getElementById("cityInput").value.trim();
  let result = document.getElementById("weatherResult");

  if (city === "") {
    result.innerHTML = `<p class="error">Please enter a city.</p>`;
    return;
  }

  result.innerHTML = `<p>Loading weather data...</p>`;

  try {
    let geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    let geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      result.innerHTML = `<p class="error">City not found. Please try again.</p>`;
      return;
    }

    let location = geoData.results[0];

    let weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`
    );

    let weatherData = await weatherResponse.json();
    let weather = weatherData.current_weather;

    result.innerHTML = `
      <div class="weather-card">
        <h2>${location.name}, ${location.country}</h2>
        <p class="temperature">${weather.temperature}&#176;C</p>
        <p>${getWeatherDescription(weather.weathercode)}</p>
        <p>Wind Speed: ${weather.windspeed} km/h</p>
      </div>
    `;
  } catch (error) {
    result.innerHTML = `<p class="error">Something went wrong. Please try again.</p>`;
  }
}