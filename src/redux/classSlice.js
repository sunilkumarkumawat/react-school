import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching roles
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async ({ API_URL, token }) => {
    const response = await axios.post(
      `${API_URL}/getClass`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const classesSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default classesSlice.reducer;