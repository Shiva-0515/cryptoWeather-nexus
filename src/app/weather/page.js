'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { fetchWeatherData } from '../../redux/slices/weatherSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function WeatherDetails() {
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState('');
  const [historicalData, setHistoricalData] = useState(null);

  // Get both the entire weather state and cities data
  const weatherState = useSelector(state => state.weather);
  const cities = useSelector(state => state.weather?.cities || {});

  // Debug logs
  console.log('Entire Weather State:', weatherState);
  console.log('Cities Data:', cities);
  console.log('Selected City:', selectedCity);
  console.log('Selected City Data:', selectedCity ? cities[selectedCity] : null);

  // Initial data fetch for default cities if none exist
  useEffect(() => {
    if (Object.keys(cities).length === 0) {
      const defaultCities = ['London', 'New York', 'Tokyo'];
      defaultCities.forEach(city => {
        dispatch(fetchWeatherData(city));
      });
    }
  }, [dispatch, cities]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!selectedCity) return;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.cod === '200') {
          console.log('Historical Data Received:', data);
          setHistoricalData(data);
        } else {
          console.error('Error fetching forecast:', data.message);
        }
      } catch (error) {
        console.error('Error fetching historical weather data:', error);
      }
    };

    if (selectedCity) {
      fetchHistoricalData();
    }
  }, [selectedCity]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
    });
  };

  const chartData = historicalData?.list ? {
    labels: historicalData.list.map(item => formatDate(item.dt)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.list.map(item => item.main.temp),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        yAxisID: 'y'
      },
      {
        label: 'Humidity (%)',
        data: historicalData.list.map(item => item.main.humidity),
        borderColor: 'rgba(54, 162, 235, 0.8)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        yAxisID: 'y1'
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: '5-Day Weather Forecast',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        padding: 12,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°C)',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Humidity (%)',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  const currentWeather = selectedCity ? cities[selectedCity]?.data : null;

  const cityList = Object.keys(cities);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Weather Details</h1>
  
      <div className="mb-6">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="block w-full md:w-64 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800"
        >
          <option value="">Select a city</option>
          {cityList.length > 0 ? (
            cityList.map(city => (
              <option key={city} value={city} className="text-gray-900 dark:text-gray-200">{city}</option>
            ))
          ) : (
            <option value="" disabled className="text-gray-600">Loading cities...</option>
          )}
        </select>
      </div>
  
      {cityList.length === 0 && (
        <div className="text-center py-4 text-gray-600">
          Loading default cities...
        </div>
      )}
  
      {currentWeather ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Current Weather</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Temperature:</span> {currentWeather.main?.temp}°C</p>
              <p><span className="font-medium">Feels Like:</span> {currentWeather.main?.feels_like}°C</p>
              <p><span className="font-medium">Humidity:</span> {currentWeather.main?.humidity}%</p>
              <p><span className="font-medium">Wind Speed:</span> {currentWeather.wind?.speed} m/s</p>
              <p><span className="font-medium">Pressure:</span> {currentWeather.main?.pressure} hPa</p>
              <p><span className="font-medium">Weather:</span> {currentWeather.weather?.[0]?.description}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Additional Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Visibility:</span> {(currentWeather.visibility || 0) / 1000} km</p>
              <p><span className="font-medium">Cloud Cover:</span> {currentWeather.clouds?.all}%</p>
              <p><span className="font-medium">Wind Direction:</span> {currentWeather.wind?.deg}°</p>
              {currentWeather.rain && (
                <p><span className="font-medium">Rain (1h):</span> {currentWeather.rain['1h']} mm</p>
              )}
              {currentWeather.snow && (
                <p><span className="font-medium">Snow (1h):</span> {currentWeather.snow['1h']} mm</p>
              )}
            </div>
          </div>
        </div>
      ) : selectedCity ? (
        <div className="text-center py-4 text-gray-600">
          Loading weather data...
        </div>
      ) : (
        <div className="text-center py-4 text-gray-600">
          Select a city to view weather details
        </div>
      )}

      {chartData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
