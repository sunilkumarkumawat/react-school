import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching expenses list
export const fetchExpensesList = createAsyncThunk(
  'expenses/fetchExpensesList',
  async ({ API_URL, token, selectedBranchId = null }) => {
    const response = await axios.post(
      `${API_URL}/getExpenses`,
      { branch_id: selectedBranchId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Add sync reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpensesList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(fetchExpensesList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default expensesSlice.reducer;