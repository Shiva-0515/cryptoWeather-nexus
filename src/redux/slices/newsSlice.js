import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async (_, { getState }) => {
    const state = getState().news;
    const now = new Date().getTime();
    
    // If we have cached data and it's not expired, return it
    if (state.lastUpdated && state.articles.length > 0) {
      const lastUpdate = new Date(state.lastUpdated).getTime();
      if (now - lastUpdate < CACHE_DURATION) {
        return state.articles;
      }
    }

    try {
      const response = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency&language=en&size=5`
      );
      return response.data.results;
    } catch (error) {
      // If we get a 429 error and have cached articles, return those
      if (error.response?.status === 429 && state.articles.length > 0) {
        return state.articles;
      }
      throw error;
    }
  }
);

const initialState = {
  articles: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearNews: (state) => {
      state.articles = [];
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        // If we have articles, keep showing them even on error
        if (state.articles.length === 0) {
          state.error = 'Unable to fetch news. Please try again later.';
        }
      });
  },
});

export const { clearNews } = newsSlice.actions;
export default newsSlice.reducer; 