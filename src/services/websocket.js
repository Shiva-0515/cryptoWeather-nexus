import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { updatePrice, setWebsocketStatus, addPriceAlert } from '../redux/slices/cryptoSlice';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.previousPrices = {};
  }

  connect() {
    this.socket = io('wss://ws.coincap.io/prices?assets=bitcoin,ethereum');

    this.socket.on('connect', () => {
      store.dispatch(setWebsocketStatus('connected'));
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      store.dispatch(setWebsocketStatus('disconnected'));
      console.log('WebSocket disconnected');
    });

    this.socket.on('prices', (data) => {
      Object.entries(data).forEach(([asset, price]) => {
        const previousPrice = this.previousPrices[asset];
        const currentPrice = parseFloat(price);

        // Update the price in Redux store
        store.dispatch(updatePrice({
          coinId: asset,
          price: currentPrice
        }));

        // Check for significant price changes (>= 1%)
        if (previousPrice) {
          const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;
          if (Math.abs(percentageChange) >= 1) {
            store.dispatch(addPriceAlert({
              coinId: asset,
              previousPrice,
              currentPrice,
              percentageChange,
              timestamp: new Date().toISOString()
            }));
          }
        }

        this.previousPrices[asset] = currentPrice;
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();
export default wsService; 