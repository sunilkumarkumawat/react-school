import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching branches
export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async ({ API_URL, token}) => {
    const response = await axios.post(
      `${API_URL}/getBranches`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const branchSlice = createSlice({
  name: 'branches',
  initialState: {
    branches: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // You can add sync reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default branchSlice.reducer;


// const initialState = {
//   roles: [],
// };

// const branchesReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'SET_BRANCHES':
//       return { ...state, branches: action.payload };
//     default:
//       return state;
//   }
// };

// export default branchesReducer;