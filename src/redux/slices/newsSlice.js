import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async () => {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency&language=en&size=5`
    );
    return response.data.results;
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
        state.error = action.error.message;
      });
  },
});

export const { clearNews } = newsSlice.actions;
export default newsSlice.reducer; 