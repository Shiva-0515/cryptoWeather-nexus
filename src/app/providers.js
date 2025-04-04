'use client';

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect } from 'react';
import { wsService } from '../services/websocket';

export function Providers({ children }) {
  useEffect(() => {
    wsService.connect();
    return () => wsService.disconnect();
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
} 