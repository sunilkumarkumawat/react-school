import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch packages data (without token)
export const fetchPackages = createAsyncThunk(
  'packages/fetchPackages',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/owner/getPackage`);
    if (!response.ok) {
      throw new Error('Failed to fetch packages');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `packages` array
  }
);

// Initial state for packages
const initialState = {
  packages: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.packages = action.payload; // Set fetched packages
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default packageSlice.reducer;
