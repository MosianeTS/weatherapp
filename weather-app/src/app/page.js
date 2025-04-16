"use client";
import Image from "next/image";
import CurrentLocation  from './CurrentLocation';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [inputCity, setInputCity] = useState('Johannesburg');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Johannesburg');
  const [isLightTheme, setIsLightTheme] = useState(false);

  const apiKey = '2b5155e071f8bdc3b09d96402b4c9adc'; 
  const units = 'metric';  
  

  useEffect(() => {
    if (!city) return;
  
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
        );
        const data = await response.json();
  
        if (response.ok) {
          setWeatherData(data);
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch weather data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWeatherData();   
   
    const intervalId = setInterval(fetchWeatherData, 5 * 60 * 1000);   
    
    return () => clearInterval(intervalId);
  
  }, [city, units, apiKey]);
  

  useEffect(() => {
    if (!city) return;
  
    const fetchForecastData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`
        );
        const data = await response.json();  
       
        setForecastData(data.list);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
        setLoading(false);
      }
    };
  
    fetchForecastData(); 
  
    const intervalId = setInterval(fetchForecastData, 5 * 60 * 1000); 
  
    return () => clearInterval(intervalId); 
  }, [city, apiKey]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(inputCity);
  };

  useEffect(() => {    
    const light = localStorage.getItem('light') === 'enabled';
    setIsLightTheme(light);
    document.body.classList.toggle('light', light);
  }, []);
  
  const toggleTheme = (e) => {
    const newTheme = e.target.checked;
    setIsLightTheme(newTheme);
    localStorage.setItem('light', newTheme ? 'enabled' : 'disabled');
    document.body.classList.toggle('light', newTheme);
  }; 

  if (loading && !weatherData) return <div className="flex items-center justify-center min-h-screen text-black dark:text-white">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-black dark:text-white">Error: {error}</div>;

  const formatDate = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    
    return `${day}, ${dayOfMonth} ${month}`;
  };

  const formatTime = (timestamp, timezoneOffset = 0) => {
    const localTime = new Date((timestamp + timezoneOffset) * 1000);
    return localTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  const currentDate = new Date();
  const time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = formatDate(currentDate);

  


  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pb-16 md:pb-32 gap-8 md:gap-16 font-[Poppins]  transition-colors duration-300">
           
           <div className="top-section w-full flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between gap-2 md:gap-[10px] mb-4 px-2">
            {/* Toggle Switch */}
            <div className="theme-toggle w-full sm:w-auto toggle-div flex flex-col items-center p-3 rounded-[10px]">
              <input
                type="checkbox"
                id="switch"
                className="peer hidden"
                onChange={toggleTheme}
              />
              <label
                htmlFor="switch"
                className="cursor-pointer w-[100px] h-[40px] bg-[#219c90] block rounded-full relative after:content-[''] after:absolute after:top-[5px] after:left-[5px] after:w-[30px] after:h-[30px] after:bg-white after:rounded-full after:transition-all peer-checked:bg-[#e9b824] peer-checked:after:translate-x-[60px]">
              </label>
              <p
                className={`mt-2 text-sm text-center ${
                  isLightTheme ? 'text-black' : 'text-white'
                }`}
              >
                {isLightTheme ? 'Light Mode' : 'Dark Mode'}
              </p>

            </div>


            {/* Search Form */}
            <div className="flex-grow w-full sm:w-auto">
              <form onSubmit={handleSubmit} className="search-input w-full max-w-[700px] mx-auto">
                <div className="relative w-full h-12 md:h-16">
                  <input
                    className="w-full h-full pl-12 pr-4 shadow-lg md:shadow-[0px_4px_40px_rgba(0,0,0,0.2)] dark:md:shadow-[0px_4px_40px_rgba(0,0,0,0.5)] rounded-full md:rounded-[40px] focus:outline-none bg-white dark:bg-[#222] text-black dark:text-white text-sm md:text-base"
                    placeholder="Search for your preferred city..."
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Image src="/icons/search.png" alt="Search" width={24} height={24} />
                  </div>
                </div>
              </form>
            </div>

            {/* Location Button */}
            <div >
              <CurrentLocation />
            </div>
          </div>



      {/* Current day weather */}
      <div className="current-day-weather flex flex-col lg:flex-row items-center justify-center w-full gap-6 md:gap-8 lg:gap-[80px] items-start">

        {/* Location, time, date */}
        <div
        className={`w-full max-w-md h-auto min-h-[280px] md:min-h-[330px] 
          ${isLightTheme ? 'bg-white text-black shadow-[10px_10px_4px_rgba(0,0,0,0.2)]' : 'bg-[#444444] text-white shadow-[10px_10px_4px_rgba(0,0,0,0.5)]'} 
          rounded-2xl md:rounded-[30px] p-4 transition-colors duration-300`}
        >

        <h1
          className={`font-bold text-2xl md:text-[36px] leading-[100%] tracking-[0] text-center mt-4 md:mt-[60px]}`}
        >
          {weatherData.name}
        </h1>


          <div className="w-full max-w-[296px] h-auto mx-auto">
            <h1 className="font-bold text-6xl md:text-[96px] leading-[100%] tracking-[0] text-center mt-6 md:mt-[50px]">{time}</h1>
            <p className="text-center text-base md:text-[20px] font-light">{date}</p>
          </div>
        </div>

        {/* Weather details */}
        <div
          className={`w-full max-w-3xl h-auto min-h-[280px] md:min-h-[330px] 
            ${isLightTheme ? 'bg-white text-black shadow-md md:shadow-[10px_10px_4px_rgba(0,0,0,0.2)]' : 'bg-[#444444] text-white shadow-md dark:shadow-[10px_10px_4px_rgba(0,0,0,0.5)] md:shadow-[10px_10px_4px_rgba(0,0,0,0.2)]'} 
            rounded-2xl md:rounded-[30px] p-4 flex flex-col md:flex-row items-center justify-around gap-4 transition-colors duration-300`}
        >

            <div className="w-full md:w-[280px] h-auto md:h-[300px] rounded-lg flex flex-col items-center justify-around">   
              
              <div className="w-full max-w-[204px] text-center md:text-left">
                  <p className="text-5xl md:text-[70px] m-0 leading-[1]">{weatherData.main.temp.toFixed(0)}°C</p>
                  <p className="m-0 leading-tight">Feels like: <span className="text-xl md:text-[32px]">{weatherData.main.feels_like.toFixed(0)}°C</span></p>
              </div>

              <div className="text-center md:text-left">               
                  <div className="flex gap-[20px]">
                      <div>
                         <Image src="/icons/sunrise.png" alt="Sunrise icon" width={50} height={50} />
                      </div>
                      <div>
                        <p className="font-normal">Sunrise</p>
                        <p className="mb-4">{formatTime(weatherData.sys.sunrise, weatherData.timezone)}</p>  
                      </div>                                      
                  </div>
                  <div className="flex gap-[20px]">
                      <div>
                         <Image src="/icons/sunset.png" alt="Sunset icon" width={50} height={50} />
                      </div>
                      <div>
                        <p className="font-normal">Sunset</p>
                        <p className="mb-4">{formatTime(weatherData.sys.sunset, weatherData.timezone)}</p>  
                      </div>                                      
                  </div>                
              </div>
            </div>

            <div className="w-full md:w-[270px] h-auto md:h-[300px] rounded-lg text-center flex flex-col">
              <Image src="/icons/sunny.png" alt="Sunny icon" width={270} height={270} />
              <p className="text-[26px]">{weatherData.weather[0].description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Humidity */}
              <div className="w-full h-auto rounded-lg p-4 text-center flex flex-col items-center justify-center">
                <Image src="/icons/humidity.png" alt="Humidity" width={60} height={60} />
                <p className="text-xl font-semibold mt-2">{weatherData.main.humidity}%</p>
                <p className="text-sm">Humidity</p>
              </div>

              {/* Wind Speed */}
              <div className="w-full h-auto min-w-[150px] rounded-lg p-4 text-center flex flex-col items-center justify-center">
                <Image src="/icons/wind.png" alt="Wind Speed" width={60} height={60} />
                <p className="text-xl font-semibold mt-2">{(weatherData.wind.speed * 3.6).toFixed(0)} km/h</p>
                <p className="text-sm">Wind Speed</p>
              </div>

              {/* Pressure */}
              <div className="w-full h-auto rounded-lg p-4 text-center flex flex-col items-center justify-center">
                <Image src="/icons/pressure.png" alt="Pressure" width={60} height={60} />
                <p className="text-xl font-semibold mt-2">{weatherData.main.pressure} hPa</p>
                <p className="text-sm">Pressure</p>
              </div>

              {/* UV */}
              <div className="w-full h-auto rounded-lg p-4 text-center flex flex-col items-center justify-center">
                <Image src="/icons/uv.png" alt="UV" width={60} height={60} />
                <p className="text-xl font-semibold mt-2">7</p>
                <p className="text-sm">UV</p>
              </div>
            </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-6 md:gap-8 lg:gap-[80px]">

        {/* 5 days Forecast */}
        <div
        className={`w-full max-w-md h-auto min-h-[300px] md:min-h-[366px] 
          ${isLightTheme ? 'bg-white text-black shadow-md md:shadow-[10px_10px_4px_rgba(0,0,0,0.2)]' : 'bg-[#444444] text-white shadow-md dark:shadow-[10px_10px_4px_rgba(0,0,0,0.5)] md:shadow-[10px_10px_4px_rgba(0,0,0,0.2)]'} 
          rounded-2xl md:rounded-[30px] p-4 transition-colors duration-300`}
        >
          <h1 className="text-center text-xl md:text-[32px] mb-4 md:mb-6 mt-2">5 Days Forecast:</h1> 
               
          {forecastData
            .filter((forecast) => forecast.dt_txt.includes("12:00:00"))
            .slice(0, 5)
            .map((forecast, index) => {
              const date = new Date(forecast.dt * 1000);
              const day = date.toLocaleString("en-US", { weekday: "long" });
              const dayNumber = date.getDate();
              const month = date.toLocaleString("en-US", { month: "short" });

              return (
                <div
                  key={index}
                  className="flex items-center justify-between md:justify-around mb-4 md:mb-6 px-2"
                >
                  <Image
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt={forecast.weather[0].description}
                    width={80}
                    height={80}
                  />
                  <p className="text-sm md:text-base">{Math.round(forecast.main.temp)}°C</p>
                  <p className="text-sm md:text-base">{`${day}, ${dayNumber} ${month}`}</p>
                </div>
              );
            })}
        </div>

        {/* Hourly Forecast */}
        <div
        className={`w-full max-w-3xl h-auto min-h-[300px] md:min-h-[366px] 
          ${isLightTheme ? 'bg-white text-black shadow-md md:shadow-[10px_10px_4px_rgba(0,0,0,0.2)]' : 'bg-[#444444] text-white shadow-md dark:shadow-[10px_10px_4px_rgba(0,0,0,0.5)] md:shadow-[10px_10px_4px_rgba(0,0,0,0.2)]'} 
          rounded-2xl md:rounded-[30px] p-4 transition-colors duration-300`}
        >
          <h1 className="text-center text-xl md:text-[32px] mb-4 md:mb-6 mt-2">Hourly Forecast:</h1>
          <div className="rounded-lg flex flex-wrap md:flex-nowrap items-center justify-center md:justify-around gap-4">
          {forecastData.slice(0, 5).map((data, index) => {
            
              const time = new Date(data.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
             
              const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

              return (
                <div
                key={index}
                className={`w-[calc(50%-8px)] sm:w-[130px] h-auto min-h-[220px] md:min-h-[270px] 
                  ${isLightTheme ? 'bg-gray-100 text-black' : 'bg-[#373636] text-white'} 
                  rounded-2xl md:rounded-[40px] flex flex-col items-center justify-around p-3 transition-colors duration-300`}
              >                
                  <p className="text-sm md:text-base">{time}</p>               
                  <Image src={iconUrl} alt="Weather Icon" width={80} height={80} />          
                  <p className="text-[24px] md:text-base">{Math.round(data.main.temp)}°C</p>   
                  <Image
                    src="/icons/navigation.png"
                    width={50}
                    height={50}
                    className="text-lg md:text-xl"
                    alt="Wind speed direction"
                    style={{ transform: `rotate(${data.wind.deg}deg)` }}
                  />                  
                        
                  <p className="text-sm md:text-base">{Math.round(data.wind.speed)*3.6} km/h</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}