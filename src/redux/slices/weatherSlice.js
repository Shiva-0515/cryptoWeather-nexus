import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
      );
      console.log('Weather API Response:', response.data); // Debug log
      return { city, data: response.data };
    } catch (error) {
      console.error('Weather API Error:', error.response?.data || error.message);
      throw error;
    }
  }
);

const initialState = {
  cities: {},
  status: 'idle',
  error: null,
};

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    updateWeather: (state, action) => {
      const { city, data } = action.payload;
      if (city) {
        state.cities[city] = { data };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cities[action.payload.city] = {
          data: action.payload.data,
          lastUpdated: new Date().toISOString()
        };
        state.error = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateWeather } = weatherSlice.actions;
export default weatherSlice.reducer; 