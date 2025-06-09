import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching users list
export const fetchUsersList = createAsyncThunk(
  'usersList/fetchUsersList',
  async ({ API_URL, token ,selectedBranchId=null}) => {
    const response = await axios.post(
      `${API_URL}/getUsers`,
      {branch_id:selectedBranchId},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const usersListSlice = createSlice({
  name: 'usersList',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Add sync reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersListSlice.reducer;