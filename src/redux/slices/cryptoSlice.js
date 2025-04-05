import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (coinId, { getState }) => {
    const state = getState().crypto;
    const now = new Date().getTime();
    
    // Check if we have cached data for this coin
    if (state.coins[coinId]?.lastUpdated) {
      const lastUpdate = new Date(state.coins[coinId].lastUpdated).getTime();
      // If cache is still valid, return existing data
      if (now - lastUpdate < CACHE_DURATION) {
        return { id: coinId, data: state.coins[coinId].data };
      }
    }

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      return { 
        id: coinId, 
        data: response.data,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      // If we get a rate limit error and have cached data, return the cached data
      if (error.response?.status === 429 && state.coins[coinId]?.data) {
        console.log(`Rate limit hit for ${coinId}, using cached data`);
        return { 
          id: coinId, 
          data: state.coins[coinId].data,
          lastUpdated: state.coins[coinId].lastUpdated
        };
      }
      throw error;
    }
  }
);

const initialState = {
  coins: {},
  status: 'idle',
  error: null,
  websocketStatus: 'disconnected'
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePrice: (state, action) => {
      const { coinId, price } = action.payload;
      if (state.coins[coinId]?.data) {
        state.coins[coinId].data.market_data.current_price.usd = price;
      }
    },
    setWebsocketStatus: (state, action) => {
      state.websocketStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins[action.payload.id] = {
          data: action.payload.data,
          lastUpdated: action.payload.lastUpdated
        };
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updatePrice, setWebsocketStatus } = cryptoSlice.actions;
export default cryptoSlice.reducer; 