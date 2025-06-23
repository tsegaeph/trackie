import React, { useEffect, useState } from "react";
import "./WeatherCard.css";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("Fetching...");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        const data = await res.json();

        setWeather(Math.round(data.main.temp));
        setLocationName(data.name);
      } catch (err) {
        setError("Failed to fetch weather.");
      }
    }, () => setError("Unable to retrieve location."));
  }, []);

  return (
    <div className="weather-card">
      <div className="weather-icon">
        {/* same sun SVG as before */}
        <svg height="32" width="32" viewBox="0 0 24 24" fill="#FFD600">
          <circle cx="12" cy="12" r="6"/>
          <g>
            <line x1="12" y1="2" x2="12" y2="5" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2" y1="12" x2="5" y2="12" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19" y1="12" x2="22" y2="12" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="#FFD600" strokeWidth="2" strokeLinecap="round"/>
          </g>
        </svg>
      </div>
      <div className="weather-info">
        <div className="weather-temp">
          {error ? "N/A" : weather !== null ? `${weather}°C` : "Loading..."}
        </div>
        <div className="weather-location">
          {error || locationName}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
