import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching roles
export const fetchSections = createAsyncThunk(
  'sections/fetchSections',
  async ({ API_URL, token }) => {
    const response = await axios.post(
      `${API_URL}/getSection`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const sectionsSlice = createSlice({
  name: 'sections',
  initialState: {
    sections: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sections = action.payload;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default sectionsSlice.reducer;