'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
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

export default function CryptoDetails() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [historicalData, setHistoricalData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState('above'); // 'above' or 'below'
  const [notifications, setNotifications] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const coins = useSelector(state => state.crypto.coins);

  // Handle window resize and initial mobile check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        // console.log('Fetching historical data for:', selectedCoin);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=usd&days=30&interval=daily`
        );
        const data = await response.json();
        // console.log('Historical data received:', data);
        setHistoricalData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalData();
  }, [selectedCoin]);

  useEffect(() => {
    if (historicalData) {
      // console.log('Chart data processed:', chartData);
    }
  }, [historicalData]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    }
    if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toFixed(2)}`;
  };

  const chartData = historicalData ? {
    labels: historicalData.prices.map(price => formatDate(price[0])),
    datasets: [
      {
        label: 'Price (USD)',
        data: historicalData.prices.map(price => price[1]),
        borderColor: 'rgba(59, 130, 246, 0.8)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        yAxisID: 'y'
      },
      {
        label: 'Volume (USD)',
        data: historicalData.total_volumes.map(volume => volume[1]),
        borderColor: 'rgba(16, 185, 129, 0.8)', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
        yAxisID: 'y1'
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: isMobile ? 10 : 20,
          font: {
            size: isMobile ? 10 : 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: '30-Day Price and Volume History',
        font: {
          size: isMobile ? 14 : 16,
          family: "'Inter', sans-serif",
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: isMobile ? 10 : 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        bodyFont: {
          size: isMobile ? 10 : 12
        },
        titleFont: {
          size: isMobile ? 12 : 14,
          weight: 'bold'
        },
        padding: isMobile ? 8 : 12,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Price: ${formatPrice(context.parsed.y)}`;
            }
            return `Volume: ${formatVolume(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: isMobile ? 8 : 11
          },
          maxTicksLimit: isMobile ? 8 : 15
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: !isMobile,
          text: 'Price (USD)',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return formatPrice(value);
          },
          font: {
            size: isMobile ? 8 : 11
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: !isMobile,
          text: 'Volume (USD)',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        },
        ticks: {
          callback: function(value) {
            return formatVolume(value);
          },
          font: {
            size: isMobile ? 8 : 11
          }
        }
      }
    }
  };

  const currentCoin = coins[selectedCoin]?.data;

  // Check for price alerts
  useEffect(() => {
    if (currentCoin) {
      const currentPrice = currentCoin.market_data.current_price.usd;
      alerts.forEach(alert => {
        const alertTriggered = alert.type === 'above' 
          ? currentPrice >= alert.price 
          : currentPrice <= alert.price;

        if (alertTriggered && !alert.triggered) {
          const notification = {
            id: Date.now(),
            message: `${currentCoin.name} price is ${alert.type} $${alert.price}! Current price: $${currentPrice.toLocaleString()}`,
            timestamp: new Date().toLocaleString()
          };
          setNotifications(prev => [notification, ...prev]);
          
          // Mark alert as triggered
          setAlerts(prev => prev.map(a => 
            a.id === alert.id ? { ...a, triggered: true } : a
          ));
        }
      });
    }
  }, [currentCoin, alerts]);

  const handleAddAlert = (e) => {
    e.preventDefault();
    const price = parseFloat(alertPrice);
    if (!isNaN(price) && price > 0) {
      const newAlert = {
        id: Date.now(),
        coin: selectedCoin,
        price,
        type: alertType,
        triggered: false,
        createdAt: new Date().toLocaleString()
      };
      setAlerts(prev => [...prev, newAlert]);
      setAlertPrice('');
    }
  };

  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Crypto Details</h1>
      
      <div className="mb-6">
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="block w-full md:w-64 p-3 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="cardano">Cardano</option>
        </select>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Notifications</h2>
          <div className="space-y-2">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-center justify-between bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                <div>
                  <p className="text-blue-800 dark:text-blue-100">{notification.message}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">{notification.timestamp}</p>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="ml-4 text-blue-500 hover:text-blue-700"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Alert Form */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Set Price Alert</h2>
        <form onSubmit={handleAddAlert} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alert Price (USD)
              </label>
              <input
                type="number"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                min="0"
                step="0.01"
                className="block w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter price"
                required
              />
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alert Type
              </label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="block w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Alert
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Active Alerts</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between border-b dark:border-gray-700 pb-3">
                <div>
                  <p className="text-gray-800 dark:text-white">
                    Alert when {alert.coin} price is {alert.type} ${alert.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Set on {alert.createdAt}</p>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentCoin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{currentCoin.name} Metrics</h2>
            <div className="space-y-3 text-gray-800 dark:text-white">
              <p><span className="font-medium">Current Price:</span> ${currentCoin.market_data.current_price.usd.toLocaleString()}</p>
              <p><span className="font-medium">Market Cap:</span> ${currentCoin.market_data.market_cap.usd.toLocaleString()}</p>
              <p><span className="font-medium">Market Cap Rank:</span> #{currentCoin.market_cap_rank}</p>
              <p><span className="font-medium">24h Volume:</span> ${currentCoin.market_data.total_volume.usd.toLocaleString()}</p>
              <p><span className="font-medium">24h High:</span> ${currentCoin.market_data.high_24h.usd.toLocaleString()}</p>
              <p><span className="font-medium">24h Low:</span> ${currentCoin.market_data.low_24h.usd.toLocaleString()}</p>
              <p><span className="font-medium">24h Price Change:</span> <span className={currentCoin.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                {currentCoin.market_data.price_change_percentage_24h.toFixed(2)}%
              </span></p>
              <p><span className="font-medium">7d Price Change:</span> <span className={currentCoin.market_data.price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}>
                {currentCoin.market_data.price_change_percentage_7d.toFixed(2)}%
              </span></p>
              <p><span className="font-medium">Circulating Supply:</span> {currentCoin.market_data.circulating_supply.toLocaleString()} {currentCoin.symbol.toUpperCase()}</p>
              <p><span className="font-medium">Total Supply:</span> {currentCoin.market_data.total_supply?.toLocaleString() || 'N/A'} {currentCoin.symbol.toUpperCase()}</p>
              <p><span className="font-medium">Max Supply:</span> {currentCoin.market_data.max_supply?.toLocaleString() || 'N/A'} {currentCoin.symbol.toUpperCase()}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Additional Information</h2>
            <div className="space-y-3 text-gray-800 dark:text-white">
              <div className="mb-4">
                <span className="font-medium">Description:</span>
                <p className="mt-2 text-sm">{currentCoin.description?.en?.split('. ')[0] || 'No description available'}.</p>
              </div>
              <p><span className="font-medium">Genesis Date:</span> {currentCoin.genesis_date || 'N/A'}</p>
              <p><span className="font-medium">Hashing Algorithm:</span> {currentCoin.hashing_algorithm || 'N/A'}</p>
              <p><span className="font-medium">Block Time:</span> {currentCoin.block_time_in_minutes ? `${currentCoin.block_time_in_minutes} minutes` : 'N/A'}</p>
              <p><span className="font-medium">Liquidity Score:</span> {currentCoin.liquidity_score?.toFixed(2) || 'N/A'}</p>
              <p><span className="font-medium">Community Score:</span> {currentCoin.community_score?.toFixed(2) || 'N/A'}</p>
              <p><span className="font-medium">Developer Score:</span> {currentCoin.developer_score?.toFixed(2) || 'N/A'}</p>
              <div>
                <span className="font-medium">Categories:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentCoin.categories.map((category, index) => (
                    <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium">Links:</span>
                <div className="flex flex-wrap gap-3 mt-2">
                  {currentCoin.links?.homepage[0] && (
                    <a href={currentCoin.links.homepage[0]} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                      Website
                    </a>
                  )}
                  {currentCoin.links?.blockchain_site[0] && (
                    <a href={currentCoin.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer"
                       className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                      Explorer
                    </a>
                  )}
                  {currentCoin.links?.official_forum_url[0] && (
                    <a href={currentCoin.links.official_forum_url[0]} target="_blank" rel="noopener noreferrer"
                       className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                      Forum
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {chartData && (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
          <div className="h-[300px] sm:h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
