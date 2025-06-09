import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch settings data (header and footer) from the given API
export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => {
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getSetting`);
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  const data = await response.json();
  return data.data;  // Assuming the response contains settings data for header and footer
});

// Initial state with a single settingsData object containing header and footer
const initialState = {
  settingsData: {},  // This will contain both header and footer
  status: 'idle',     // To track the request status (idle, loading, succeeded, failed)
  error: null,        // To track any errors
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settingsData = action.payload;  // Set the fetched data (both header and footer)
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default settingsSlice.reducer;
