import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching payment modes list
export const fetchPaymentModes = createAsyncThunk(
  'paymentModes/fetchPaymentModes',
  async ({ API_URL, token }) => {
    const response = await axios.get(
      `${API_URL}/getPaymentModes`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const paymentModesSlice = createSlice({
  name: 'paymentModes',
  initialState: {
    paymentModes: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Add sync reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentModes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPaymentModes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paymentModes = action.payload;
      })
      .addCase(fetchPaymentModes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default paymentModesSlice.reducer;