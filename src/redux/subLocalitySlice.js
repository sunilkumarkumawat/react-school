import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSubLocalities = createAsyncThunk(
  'subLocalities/fetchSubLocalities',
  async (segment) => {

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/search/getSubLocality?id=${segment[1]}&prefix=${segment[0]}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sub-localities');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the sub-localities array
  }
);

// Initial state for sub-localities
const initialState = {
  subLocalities: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const subLocalitySlice = createSlice({
  name: 'subLocalities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubLocalities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubLocalities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subLocalities = action.payload; // Set fetched sub-localities
      })
      .addCase(fetchSubLocalities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default subLocalitySlice.reducer;
