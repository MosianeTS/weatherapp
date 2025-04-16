# Weather App

A responsive and beautifully designed weather application built with Next.js and Tailwind CSS. This app provides current weather information, hourly forecasts, and 5-day forecasts for any city worldwide.

## Features

- **Current Weather**: Display current temperature, feels-like temperature, and weather conditions
- **Weather Details**: Show humidity, wind speed, pressure, and UV index
- **Sunrise & Sunset Times**: View sunrise and sunset times for the selected location
- **Hourly Forecast**: Get a detailed forecast for the next few hours
- **5-Day Forecast**: View weather predictions for the next 5 days
- **City Search**: Look up weather information for any city globally
- **Current Location**: Option to get weather data based on your current location
- **Theme Toggle**: Switch between light and dark modes with persistent settings

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [OpenWeatherMap API](https://openweathermap.org/api) - Weather data provider

## Prerequisites

Before running this project, you need to have:

- Node.js (v18 or later)
- npm or yarn package manager
- OpenWeatherMap API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weatherapp/weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create an environment variable file `.env.local` in the root directory and add your OpenWeatherMap API key:
   ```
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

## Running the Application

### Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

