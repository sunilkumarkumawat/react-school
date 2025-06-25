import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching roles
export const fetchFeesGroups = createAsyncThunk(
  'feesGroups/fetchFeesGroups',
  async ({ API_URL, token }) => {
    const response = await axios.post(
      `${API_URL}/getFeesGroup`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const feesGroupsSlice = createSlice({
  name: 'feesGroups',
  initialState: {
    roles: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeesGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeesGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feesGroups = action.payload;
      })
      .addCase(fetchFeesGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default feesGroupsSlice.reducer;