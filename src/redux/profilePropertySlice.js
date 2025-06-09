import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch profile properties via POST with token from localStorage
export const fetchProfileProperties = createAsyncThunk(
  'profileProperty/fetchProfileProperties',
  async (userId) => {
    const token = localStorage.getItem('authToken'); // Read token from localStorage

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/search/getProfileProperties`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Attach Bearer Token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }), // Send userId in request body
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile properties');
    }

    const data = await response.json();
    return data.data; // Assuming response contains a `data` array
  }
);

// Initial state for profile properties
const initialState = {
  properties: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const profilePropertySlice = createSlice({
  name: 'profileProperty',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileProperties.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfileProperties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.properties = action.payload; // Set fetched properties
      })
      .addCase(fetchProfileProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default profilePropertySlice.reducer;
