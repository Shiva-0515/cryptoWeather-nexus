import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteCities: [],
  favoriteCoins: [],
  theme: 'light',
  refreshInterval: 60, // in seconds
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action) => {
      const city = action.payload;
      const index = state.favoriteCities.indexOf(city);
      if (index === -1) {
        state.favoriteCities.push(city);
      } else {
        state.favoriteCities.splice(index, 1);
      }
    },
    toggleFavoriteCoin: (state, action) => {
      const coin = action.payload;
      const index = state.favoriteCoins.indexOf(coin);
      if (index === -1) {
        state.favoriteCoins.push(coin);
      } else {
        state.favoriteCoins.splice(index, 1);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
    },
  },
});

export const {
  toggleFavoriteCity,
  toggleFavoriteCoin,
  setTheme,
  setRefreshInterval,
} = preferencesSlice.actions;
export default preferencesSlice.reducer; 