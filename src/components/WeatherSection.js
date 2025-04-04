'use client';

import { useSelector, useDispatch } from 'react-redux';
import { toggleFavoriteCity } from '../redux/slices/preferencesSlice';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function WeatherSection() {
  const dispatch = useDispatch();
  const cities = useSelector(state => state.weather.cities);
  const favoriteCities = useSelector(state => state.preferences.favoriteCities);

  const handleFavoriteToggle = (city) => {
    dispatch(toggleFavoriteCity(city));
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Weather Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(cities).map(([city, data]) => (
          <div
            key={city}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => handleFavoriteToggle(city)}
              className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-600 transition-colors"
              aria-label={favoriteCities.includes(city) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favoriteCities.includes(city) ? (
                <StarIconSolid className="h-6 w-6" />
              ) : (
                <StarIconOutline className="h-6 w-6" />
              )}
            </button>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {city}
            </h3>

            {data.loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-300"></div>
              </div>
            ) : data.error ? (
              <div className="text-red-500 p-4 text-center">
                <p>{data.error}</p>
                <p className="text-sm mt-2">Please check your API key or try again later.</p>
              </div>
            ) : data.data ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                      {Math.round(data.data.main.temp)}°C
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 capitalize">
                      {data.data.weather[0].description}
                    </p>
                  </div>
                  <img
                    src={getWeatherIcon(data.data.weather[0].icon)}
                    alt={data.data.weather[0].description}
                    className="w-16 h-16"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded">
                    <p className="font-medium">Humidity</p>
                    <p>{data.data.main.humidity}%</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded">
                    <p className="font-medium">Wind</p>
                    <p>{Math.round(data.data.wind.speed)} m/s</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded">
                    <p className="font-medium">Feels Like</p>
                    <p>{Math.round(data.data.main.feels_like)}°C</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded">
                    <p className="font-medium">Pressure</p>
                    <p>{data.data.main.pressure} hPa</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
} 