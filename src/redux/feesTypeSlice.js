import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching roles
export const fetchFeesTypes = createAsyncThunk(
  'feesTypes/fetchFeesTypes',
  async ({ API_URL, token }) => {
    const response = await axios.post(
      `${API_URL}/getFeesType`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const feesTypesSlice = createSlice({
  name: 'feesTypes',
  initialState: {
    roles: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeesTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeesTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feesTypes = action.payload;
      })
      .addCase(fetchFeesTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default feesTypesSlice.reducer;