import React, { useState } from 'react';
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
    } catch (err) {
      setWeather(null);
      setError("City not found. Please try again.");
    }
  };

  return (
    <div className="app">
      <h1>🌤️ Weather App</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>{weather.weather[0].main} - {weather.weather[0].description}</p>
          <p>🌡️ {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>💨 Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
