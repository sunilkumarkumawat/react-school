import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch popular localities
export const fetchPopularLocalities = createAsyncThunk(
  'popularLocalities/fetchPopularLocalities',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/search/getPopularLocalities`);
    if (!response.ok) {
      throw new Error('Failed to fetch popular localities');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains an array of localities
  }
);

// Initial state
const initialState = {
  popularLocalities: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const popularLocalitySlice = createSlice({
  name: 'popularLocalities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularLocalities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPopularLocalities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.popularLocalities = action.payload;
      })
      .addCase(fetchPopularLocalities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default popularLocalitySlice.reducer;
