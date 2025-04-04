import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (coinId) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    return response.data;
  }
);

const initialState = {
  coins: {
    bitcoin: { data: null, loading: false, error: null },
    ethereum: { data: null, loading: false, error: null },
    cardano: { data: null, loading: false, error: null },
  },
  priceAlerts: [],
  websocketStatus: 'disconnected',
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePrice: (state, action) => {
      const { coinId, price } = action.payload;
      if (state.coins[coinId]?.data) {
        state.coins[coinId].data.market_data.current_price.usd = price;
      }
    },
    addPriceAlert: (state, action) => {
      state.priceAlerts.push(action.payload);
    },
    clearPriceAlerts: (state) => {
      state.priceAlerts = [];
    },
    setWebsocketStatus: (state, action) => {
      state.websocketStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state, action) => {
        const coinId = action.meta.arg;
        if (state.coins[coinId]) {
          state.coins[coinId].loading = true;
          state.coins[coinId].error = null;
        }
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        const coinId = action.meta.arg;
        if (state.coins[coinId]) {
          state.coins[coinId].loading = false;
          state.coins[coinId].data = action.payload;
          state.coins[coinId].error = null;
        }
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        const coinId = action.meta.arg;
        if (state.coins[coinId]) {
          state.coins[coinId].loading = false;
          state.coins[coinId].error = action.error.message;
        }
      });
  },
});

export const {
  updatePrice,
  addPriceAlert,
  clearPriceAlerts,
  setWebsocketStatus,
} = cryptoSlice.actions;
export default cryptoSlice.reducer; 