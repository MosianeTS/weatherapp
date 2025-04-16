"use client";
import Image from "next/image";
import React, { useState, useEffect } from 'react';

const CurrentLocation = () => {
  const [currentCity, setCurrentCity] = useState(null); 
  const [loading, setLoading] = useState(true); 

  // Function to get current coordinates
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(error.message);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  };

  // Function to get location name
  const getLocationName = async (latitude, longitude) => {
    const apiKey = "2b5155e071f8bdc3b09d96402b4c9adc"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const city = data.name; 
      setCurrentCity(city); 
      setLoading(false); 
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        await getLocationName(latitude, longitude);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false); 
      }
    };

    fetchLocation();
  }, []); 

  return (
    <div className="current-location bg-[#4CBB17] w-[320px] h-[62px] rounded-[40px] flex items-center justify-center text-white px-4">
      <div className="flex items-center gap-2">
        <Image alt="current location icon" src="/icons/current.png" className="h-5 w-5 text-white" width={35} height={35} />
        <span>Current location: {loading ? "Loading..." : currentCity}</span>
      </div>
    </div>
  );
};

export default CurrentLocation;
