"use client";
import Image from "next/image";
// import Dashboard from "./ThemeToggle";
import React, { useState, useEffect } from 'react';

export default function Home() {

  const [weatherData, setWeatherData] = useState(null);
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
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pb-16 md:pb-32 gap-8 md:gap-16 font-[Poppins] dark:bg-black dark:text-white">

      {/* Theme Toggle */}
      {/* <Dashboard /> */}

      {/* Top section */}
      <div className="w-full max-w-full sm:max-w-3xl">
        <form>
          <div className="relative w-full h-12 md:h-16">
            <input
              className="w-full h-full pl-12 pr-4 shadow-lg md:shadow-[0px_4px_40px_#000000] rounded-full md:rounded-[40px] focus:outline-none dark:bg-[#222] dark:text-white text-sm md:text-base"
              placeholder="Search for your preferred city..."
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Image src="/search-icon.svg" alt="Search" width={24} height={24} />
            </div>
          </div>
        </form>
      </div>

      {/* Current day weather */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-6 md:gap-8 lg:gap-[80px]">

        {/* Location, time, date */}
        <div className="w-full max-w-md h-auto min-h-[280px] md:min-h-[330px] bg-[#444444] shadow-md md:shadow-[10px_10px_4px_#000000] rounded-2xl md:rounded-[30px] text-white p-4">
          <h1 className="font-bold text-2xl md:text-[36px] leading-[100%] tracking-[0] text-center mt-4 md:mt-[60px]">{weatherData.name}</h1>
          <div className="w-full max-w-[296px] h-auto mx-auto">
            <h1 className="font-bold text-6xl md:text-[96px] leading-[100%] tracking-[0] text-center mt-6 md:mt-[50px]">{time}</h1>
            <p className="text-center text-base md:text-[20px] font-light">{date}</p>
          </div>
        </div>

        {/* Weather details */}
        <div className="w-full max-w-3xl h-auto min-h-[280px] md:min-h-[330px] bg-[#444444] shadow-md md:shadow-[10px_10px_4px_#000000] rounded-2xl md:rounded-[30px] text-white p-4 flex flex-col md:flex-row items-center justify-around gap-4">

            <div className="w-full md:w-[280px] h-auto md:h-[300px] rounded-lg flex flex-col items-center justify-around text-white">   
              
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
              <p className="text-[32px]">{weatherData.weather[0].description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Humidity */}
              <div className="w-full h-auto text-white rounded-lg p-4 text-center flex flex-col items-center justify-center">
                <Image src="/icons/humidity.png" alt="Humidity" width={60} height={60} />
                <p className="text-xl font-semibold mt-2">{weatherData.main.humidity}%</p>
                <p className="text-sm text-gray-600">Humidity</p>
              </div>

              {/* Wind Speed */}
              <div className="w-full h-auto min-w-[150px] text-white rounded-lg  p-4 text-center flex flex-col items-center justify-center">
                <Image src="/icons/wind.png" alt="Wind Speed" width={60} height={60} />
                <p className="text-xl font-semibold mt-2">{weatherData.wind.speed} m/s</p>
                <p className="text-sm text-gray-600">Wind Speed</p>
              </div>

              {/* Pressure */}
              <div className="w-full h-auto text-white rounded-lg p-4 text-center flex flex-col items-center justify-center">
                <Image src="/icons/pressure.png" alt="Pressure" width={60} height={60} />
                <p className="text-xl font-semibold mt-2">{weatherData.main.pressure} hPa</p>
                <p className="text-sm text-gray-600">Pressure</p>
              </div>

              {/* UV */}
              <div className="w-full h-auto text-white rounded-lg  p-4 text-center flex flex-col items-center justify-center">
                <Image src="/icons/uv.png" alt="UV" width={60} height={60} />
                <p className="text-xl font-semibold mt-2">{weatherData.current?.uvi ?? "N/A"}</p>
                <p className="text-sm text-gray-600">UV</p>
              </div>
            </div>

        </div>
      </div>

      {/* Forecast */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-6 md:gap-8 lg:gap-[80px]">

        {/* 5 days Forecast */}
        <div className="w-full max-w-md h-auto min-h-[300px] md:min-h-[366px] rounded-2xl md:rounded-[30px] bg-[#444444] shadow-md md:shadow-[10px_10px_4px_#000000] text-white p-4">
          <h1 className="text-center text-xl md:text-[32px] mb-4 md:mb-6 mt-2">5 Days Forecast:</h1> 
               
          {forecastData.map((forecast, index) => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleString("en-US", { weekday: "long" });
            const dayNumber = date.getDate();
            const month = date.toLocaleString("en-US", { month: "short" });

            return (
              <div key={index} className="flex items-center justify-between md:justify-around mb-4 md:mb-6 px-2">
                <Image
                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt={forecast.weather[0].description}
                  width={40}
                  height={40}
                />
                <p className="text-sm md:text-base">{Math.round(forecast.main.temp)}°C</p>
                <p className="text-sm md:text-base">{`${day}, ${dayNumber} ${month}`}</p>
              </div>
            );
          })}
        </div>

        {/* Hourly Forecast */}
        <div className="w-full max-w-3xl h-auto min-h-[300px] md:min-h-[366px] rounded-2xl md:rounded-[30px] bg-[#444444] shadow-md md:shadow-[10px_10px_4px_#000000] text-white p-4">
          <h1 className="text-center text-xl md:text-[32px] mb-4 md:mb-6 mt-2">Hourly Forecast:</h1>
          <div className="rounded-lg flex flex-wrap md:flex-nowrap items-center justify-center md:justify-around gap-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="w-[calc(50%-8px)] sm:w-[130px] h-auto min-h-[220px] md:min-h-[270px] rounded-2xl md:rounded-[40px] bg-[#373636] flex flex-col items-center justify-around text-white p-3">
                <p className="text-sm md:text-base">12:00</p>
                <p className="text-sm md:text-base">Icon</p>
                <p className="text-sm md:text-base">25°C</p>
                <p className="text-sm md:text-base">Icon</p>
                <p className="text-sm md:text-base">3km/h</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}