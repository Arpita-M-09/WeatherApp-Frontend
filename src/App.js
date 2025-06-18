import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const getWeather = async () => {
    if (!city) return;

    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setWeather(data);
      setError('');

      const weatherMain = data.weather[0].main.toLowerCase();
      document.body.setAttribute('data-weather', weatherMain);
    } catch (err) {
      setWeather(null);
      setError("City not found. Please try again.");

      const inputEl = document.querySelector("input");
      inputEl.classList.add("shake");
      setTimeout(() => {
        inputEl.classList.remove("shake");
      }, 400);
    }
  };

  useEffect(() => {
    const phrases = ["Enter city name", "e.g. London", "Try: Tokyo", "What's the weather?"];
    let i = 0;
    const input = document.querySelector("input");
    const interval = setInterval(() => {
      input.placeholder = phrases[i % phrases.length];
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <h1>🌤️ Weather App</h1>

      <div className="input-group">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="result-group">
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p>{weather.weather[0].main} - {weather.weather[0].description}</p>
            <p>🌡️ {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>💨 Wind: {weather.wind.speed} m/s</p>
            <p className="weather-type">
              🌈 Weather Theme: <strong>{weather.weather[0].main.toLowerCase()}</strong>
            </p>
          </div>

          <div className="map-card">
            <iframe
              title="city-location-map"
              width="100%"
              height="250"
              style={{ border: "0", borderRadius: "15px" }}
              loading="lazy"
              allowFullScreen
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${weather.coord.lon - 0.05}%2C${weather.coord.lat - 0.05}%2C${weather.coord.lon + 0.05}%2C${weather.coord.lat + 0.05}&layer=mapnik&marker=${weather.coord.lat}%2C${weather.coord.lon}`}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
