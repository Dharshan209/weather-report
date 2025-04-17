import React, { useState, useEffect } from 'react';
import { Search, Wind, Droplets,LoaderPinwheel } from 'lucide-react';
import "../Components/Weather.css";

const API_KEY = 'bfeeae0b79cc34ad7c87dc6e0630bd33';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

function Weather(){

    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [unit, setUnit] = useState('celsius');
  
    useEffect(() => {
      const lastCity = localStorage.getItem('lastCity');
      if (lastCity) {
        fetchWeather(lastCity);
      }
    }, []);
  
    const fetchWeather = async (searchCity) => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(
          `${API_BASE_URL}/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('City not found');
        }
  
        const data = await response.json();
        setWeather(data);
        localStorage.setItem('lastCity', searchCity);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (city.trim()) {
        fetchWeather(city.trim());
      }
    };
  
    const convertTemp = (temp) => {
      if (unit === 'fahrenheit') {
        return ((temp * 9/5) + 32).toFixed(1);
      }
      return temp.toFixed(1);
    };
  
    const toggleUnit = () => {
      setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
    };
  
    const getBackgroundImage = (weatherMain) => {
      const timeOfDay = new Date().getHours() > 6 && new Date().getHours() < 18 ? 'day' : 'night';
      
      switch (weatherMain?.toLowerCase()) {
        case 'clear':
          return `url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920')`;
        case 'clouds':
          return `url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920')`;
        case 'rain':
          return `url('https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920')`;
        case 'snow':
          return `url('https://images.unsplash.com/photo-1516431883659-655d41c09bf9?auto=format&fit=crop&w=1920')`;
        default:
          return timeOfDay === 'day' 
            ? `url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920')`
            : `url('https://images.unsplash.com/photo-1507400492013-162706c8c05d?auto=format&fit=crop&w=1920')`;
      }
    };
    return (
        <div 
          className="weather-app"
          style={{ 
            backgroundImage: weather ? getBackgroundImage(weather.weather[0].main) : getBackgroundImage()
          }}
        >
          <div className="search-section">
            <form onSubmit={handleSubmit} className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button type="submit" className="search-button">
                <Search size={20} />
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
    
          {loading ? (
            <div className="loading"></div>
          ) : weather ? (
            <div className="weather-card">
              <div className="location">
                <h2>{weather.name}</h2>
                <p>{weather.sys.country}</p>
              </div>
    
              <div className="weather-info">
                <div className="temperature">
                  <h1>
                    {convertTemp(weather.main.temp)}°
                    {unit === 'celsius' ? 'C' : 'F'}
                  </h1>
                  <button onClick={toggleUnit}>
                    Switch to {unit === 'celsius' ? '°F' : '°C'}
                  </button>
                </div>
    
                <div className="weather-condition">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                  />
                  <p>{weather.weather[0].description}</p>
                </div>
              </div>
    
              <div className="details">
                <div className="detail-item">
                  <Droplets size={24} />
                  <h4>Humidity</h4>
                  <p>{weather.main.humidity}%</p>
                </div>
                <div className="detail-item">
                  <Wind size={24} />
                  <h4>Wind Speed</h4>
                  <p>{weather.wind.speed} m/s</p>
                </div>
                <div className="detail-item">
                  <LoaderPinwheel size={24} />
                  <h4>Presuure </h4>
                  <p>{weather.main.pressure} m/s</p>
                </div>
                <div className="detail-item">
                  <LoaderPinwheel size={24} />
                  <h4>Wind Direction </h4>
                  <p>{weather.wind.deg} m/s</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      );
}

export default Weather;