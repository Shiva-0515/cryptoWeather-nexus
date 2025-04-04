'use client';

import { useSelector, useDispatch } from 'react-redux';
import { toggleFavoriteCoin } from '../redux/slices/preferencesSlice';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function CryptoSection() {
  const dispatch = useDispatch();
  const coins = useSelector(state => state.crypto.coins);
  const favoriteCoins = useSelector(state => state.preferences.favoriteCoins);
  const websocketStatus = useSelector(state => state.crypto.websocketStatus);

  const handleFavoriteToggle = (coinId) => {
    dispatch(toggleFavoriteCoin(coinId));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Crypto Dashboard
        </h2>
        <div className="flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
            websocketStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {websocketStatus === 'connected' ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(coins).map(([coinId, data]) => (
          <div
            key={coinId}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative"
          >
            <button
              onClick={() => handleFavoriteToggle(coinId)}
              className="absolute top-2 right-2 text-yellow-500"
            >
              {favoriteCoins.includes(coinId) ? (
                <StarIconSolid className="h-6 w-6" />
              ) : (
                <StarIconOutline className="h-6 w-6" />
              )}
            </button>

            {data.loading ? (
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            ) : data.error ? (
              <p className="text-red-500">{data.error}</p>
            ) : data.data ? (
              <div>
                <div className="flex items-center mb-2">
                  <img
                    src={data.data.image.thumb}
                    alt={data.data.name}
                    className="w-6 h-6 mr-2"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {data.data.name}
                  </h3>
                </div>

                <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {formatPrice(data.data.market_data.current_price.usd)}
                </p>

                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${
                    data.data.market_data.price_change_percentage_24h > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {formatPercentage(data.data.market_data.price_change_percentage_24h)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    (24h)
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Market Cap: {formatPrice(data.data.market_data.market_cap.usd)}</p>
                  <p>Volume: {formatPrice(data.data.market_data.total_volume.usd)}</p>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
} 