"use client";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import React, { useState, useEffect } from 'react';

export default function Home() {

  const [weatherData,setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = '2b5155e071f8bdc3b09d96402b4c9adc'; 
  const city = 'Johannesburg'; 
  const units = 'metric'; 

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
        );
        const data = await response.json();
        
        if (response.ok) {
          setWeatherData(data);  
          setLoading(false);
        } else {
          throw new Error(data.message);  
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchWeatherData();
  }, [city, apiKey, units]);  

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=5&appid=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data.list);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
    <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-32 gap-16 sm:p-20 font-[Poppins] dark:bg-black dark:text-white">

      {/* Theme Toggle */}
      {/* <ThemeToggle /> */}

      {/* Top section */}
      <div>
        <form>
          <div className="relative w-[803px] h-[62px]">
            <input
              className="w-full h-full pl-12 pr-4 shadow-[0px_4px_40px_#000000] rounded-[40px] focus:outline-none dark:bg-[#222] dark:text-white"
              placeholder="Search for your preferred city..."
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Image src="/search-icon.svg" alt="Search" width={24} height={24} />
            </div>
          </div>
        </form>
      </div>

      {/* Current day weather */}
      <div className="flex items-center justify-items-center gap-[80px]">

        {/* Location, time, date */}
        <div className="w-[510px] h-[330px] bg-[#444444] shadow-[10px_10px_4px_#000000] rounded-[30px] text-white">
          <h1 className="font-[Poppins] font-bold text-[36px] leading-[100%] tracking-[0] text-center mt-[60px] font-bold">{weatherData.name}</h1>
          <div className="w-[296px] h-[144px] mx-auto">
            <h1 className="font-[Poppins] font-bold text-[36px] leading-[100%] tracking-[0] text-center mt-[50px] text-[96px]">{time}</h1>
            <p className="text-center text-[20px] font-light">{date}</p>
          </div>
        </div>

        {/* Weather details */}
        <div className="w-[780px] h-[330px] bg-[#444444] shadow-[10px_10px_4px_#000000] rounded-[30px] text-white flex items-center justify-around">

            <div className="w-[204px] h-[300px] rounded-lg shadow-lg flex flex-col items-center justify-around text-white">   
              
              
              <p className="text-[60px]">{weatherData.main.temp}°C  </p>
              <p>Feels like: {weatherData.main.feels_like}°C</p>            
              <p>Sunrise: {formatTime(weatherData.sys.sunrise, weatherData.timezone)}</p>
              <p>Sunset: {formatTime(weatherData.sys.sunset, weatherData.timezone)}</p>          

              
            </div>

            <div className="w-[270px] h-[300px] rounded-lg shadow-lg">



              <p>{weatherData.weather[0].description}</p>
            </div>


            <div className="w-[250px] h-[300px] rounded-lg shadow-lg">
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind: {weatherData.wind.speed} m/s</p>
            </div>

        </div>
      </div>

      {/* Forecast */}
      <div className="flex items-center justify-items-center gap-[80px] ">

        {/* 5 days Forecast */}
        <div className="w-[414px] h-[366px] rounded-lg bg-[#444444] shadow-[10px_10px_4px_#000000] rounded-[30px] text-white">
          <h1 className="text-center text-[32px] mb-6 mt-2">5 Days Forecast:</h1> 
               
          {forecastData.map((forecast, index) => {
          const date = new Date(forecast.dt * 1000);
          const day = date.toLocaleString("en-US", { weekday: "long" });
          const dayNumber = date.getDate();
          const month = date.toLocaleString("en-US", { month: "short" });

          // Explicitly return JSX for each forecast
          return (
            <div key={index} className="flex items-center justify-around mb-6">
              <Image
                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt={forecast.weather[0].description}
                width={40}
                height={40}
              />
              <p>{Math.round(forecast.main.temp)}°C</p>
              <p>{`${day}, ${dayNumber} ${month}`}</p>
            </div>
          );
        })}
  

        </div>

        {/* Hourly Forecast */}
        <div className="w-[870px] h-[366px] rounded-[30px] bg-[#444444] shadow-[10px_10px_4px_#000000] text-white">
          <h1 className="text-center text-[32px] mb-6 mt-2">Hourly Forecast:</h1>
          <div className="rounded-lg flex items-center justify-around">
            <div className="w-[130px] h-[270px] rounded-[40px] bg-[#373636] flex flex-col items-center justify-around text-white">
              <p>12:00</p>
              <p>Icon</p>
              <p>25°C</p>
              <p>Icon</p>
              <p>3km/h</p>
            </div>

            <div className="w-[130px] h-[270px] rounded-[40px] bg-[#373636] flex flex-col items-center justify-around text-white">
              <p>12:00</p>
              <p>Icon</p>
              <p>25°C</p>
              <p>Icon</p>
              <p>3km/h</p>
            </div>

            <div className="w-[130px] h-[270px] rounded-[40px] bg-[#373636] flex flex-col items-center justify-around text-white">
              <p>12:00</p>
              <p>Icon</p>
              <p>25°C</p>
              <p>Icon</p>
              <p>3km/h</p>
            </div>

            <div className="w-[130px] h-[270px] rounded-[40px] bg-[#373636] flex flex-col items-center justify-around text-white">
              <p>12:00</p>
              <p>Icon</p>
              <p>25°C</p>
              <p>Icon</p>
              <p>3km/h</p>
            </div>

            <div className="w-[130px] h-[270px] rounded-[40px] bg-[#373636] flex flex-col items-center justify-around text-white">
              <p>12:00</p>
              <p>Icon</p>
              <p>25°C</p>
              <p>Icon</p>
              <p>3km/h</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
