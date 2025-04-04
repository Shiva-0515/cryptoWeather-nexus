import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city) => {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    return response.data;
  }
);

const initialState = {
  cities: {
    'New York': { data: null, loading: false, error: null },
    'London': { data: null, loading: false, error: null },
    'Tokyo': { data: null, loading: false, error: null },
  },
  alerts: [],
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addWeatherAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    clearWeatherAlerts: (state) => {
      state.alerts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state, action) => {
        const city = action.meta.arg;
        if (state.cities[city]) {
          state.cities[city].loading = true;
          state.cities[city].error = null;
        }
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        const city = action.meta.arg;
        if (state.cities[city]) {
          state.cities[city].loading = false;
          state.cities[city].data = action.payload;
          state.cities[city].error = null;
        }
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        const city = action.meta.arg;
        if (state.cities[city]) {
          state.cities[city].loading = false;
          state.cities[city].error = action.error.message;
        }
      });
  },
});

export const { addWeatherAlert, clearWeatherAlerts } = weatherSlice.actions;
export default weatherSlice.reducer; 