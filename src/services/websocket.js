// WebSocketService.js
import { store } from '../redux/store';
import { updatePrice, setWebsocketStatus } from '../redux/slices/cryptoSlice';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 3000;
    this.isIntentionalDisconnect = false;
  }

  connect() {
    if (this.socket) return;

    try {
      console.log('Connecting to WebSocket...');
      this.socket = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano');

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        store.dispatch(setWebsocketStatus('connected'));
        this.reconnectAttempts = 0;
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        store.dispatch(setWebsocketStatus('disconnected'));
        this.socket = null;
        
        if (!this.isIntentionalDisconnect) {
          this.handleReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.dispatch(setWebsocketStatus('disconnected'));
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          Object.entries(data).forEach(([coinId, price]) => {
            const numericPrice = parseFloat(price);
            if (!isNaN(numericPrice) && numericPrice > 0) {
              store.dispatch(updatePrice({ coinId, price: numericPrice }));
            }
          });
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      store.dispatch(setWebsocketStatus('disconnected'));
      this.handleReconnect();
    }
  }

  disconnect() {
    this.isIntentionalDisconnect = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      store.dispatch(setWebsocketStatus('disconnected'));
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.min(this.reconnectAttempts, 5);
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      store.dispatch(setWebsocketStatus('disconnected'));
      // Reset and try again after 1 minute
      setTimeout(() => {
        this.reconnectAttempts = 0;
        this.connect();
      }, 60000);
    }
  }
}

const wsService = new WebSocketService();
export default wsService;