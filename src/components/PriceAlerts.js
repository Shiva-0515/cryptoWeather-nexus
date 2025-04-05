'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PriceAlerts() {
  const coins = useSelector(state => state.crypto.coins);
  const previousPrices = useRef({
    bitcoin: 0,
    ethereum: 0,
    cardano: 0
  });

  useEffect(() => {
    // Check for price changes and show notifications
    Object.entries(coins).forEach(([coinId, data]) => {
      if (!data?.data?.market_data?.current_price?.usd) return;
      
      const currentPrice = data.data.market_data.current_price.usd;
      const prevPrice = previousPrices.current[coinId];
      
      if (prevPrice > 0) {
        const changePercent = ((currentPrice - prevPrice) / prevPrice) * 100;
        
        // Alert if price change is more than 0.5%
        if (Math.abs(changePercent) >= 0.5) {
          const direction = changePercent > 0 ? 'increased' : 'decreased';
          toast.info(
            `${coinId.toUpperCase()} price has ${direction} by ${Math.abs(changePercent).toFixed(2)}%`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
      }
      
      // Update previous price
      previousPrices.current[coinId] = currentPrice;
    });
  }, [coins]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
} 