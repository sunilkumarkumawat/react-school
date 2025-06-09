// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null, // Stores user data
  isAuthenticated: false, // Authentication status
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload; // Save user data
      state.isAuthenticated = true; // Mark the user as authenticated
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false; // Clear user data and authentication status
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;
