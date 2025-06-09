import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch districts data
export const fetchDistricts = createAsyncThunk(
  'districts/fetchDistricts',
  async (stateId) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getCity?stateId=${stateId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch districts');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `districts` array
  }
);

// Initial state for districts
const initialState = {
  districts: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const districtsSlice = createSlice({
  name: 'districts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistricts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.districts = action.payload; // Set fetched districts
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default districtsSlice.reducer;
