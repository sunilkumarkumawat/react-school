import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching roles
export const fetchFeesMasters = createAsyncThunk(
  'feesMasters/fetchFeesMasters',
  async ({ API_URL, token }) => {
    const response = await axios.post(
      `${API_URL}/getFeesMaster`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const feesMastersSlice = createSlice({
  name: 'feesMasters',
  initialState: {
    feesMasters: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeesMasters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeesMasters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feesMasters = action.payload;
      })
      .addCase(fetchFeesMasters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default feesMastersSlice.reducer;