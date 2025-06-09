import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch states data
export const fetchStates = createAsyncThunk(
  'states/fetchStates',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getState`);
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `states` array
  }
);

// Initial state for states
const initialState = {
  states: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const statesSlice = createSlice({
  name: 'states',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.states = action.payload; // Set fetched states
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default statesSlice.reducer;
