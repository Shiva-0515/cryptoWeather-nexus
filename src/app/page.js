'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WeatherSection from '../components/WeatherSection';
import CryptoSection from '../components/CryptoSection';
import NewsSection from '../components/NewsSection';
import { fetchWeatherData } from '../redux/slices/weatherSlice';
import { fetchCryptoData } from '../redux/slices/cryptoSlice';
import { fetchNewsData } from '../redux/slices/newsSlice';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial data fetch
    const cities = ['New York', 'London', 'Tokyo'];
    const coins = ['bitcoin', 'ethereum', 'cardano'];

    cities.forEach(city => dispatch(fetchWeatherData(city)));
    coins.forEach(coin => dispatch(fetchCryptoData(coin)));
    dispatch(fetchNewsData());

    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      cities.forEach(city => dispatch(fetchWeatherData(city)));
      coins.forEach(coin => dispatch(fetchCryptoData(coin)));
      dispatch(fetchNewsData());
    }, 300000); // Refresh every 5 minutes instead of every minute

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          CryptoWeather Nexus
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              <WeatherSection />
              <CryptoSection />
            </div>
          </div>
          <div>
            <NewsSection />
          </div>
        </div>
      </div>
    </main>
  );
}
