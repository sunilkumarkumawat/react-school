// src/redux/studentListSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch students
export const fetchStudentList = createAsyncThunk(
  'studentList/fetchStudentList',
  async ({ API_URL, token, selectedBranchId = null }) => {
    const response = await axios.post(
      `${API_URL}/getStudents`,
      { branch_id: selectedBranchId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data || [];
  }
);

const studentListSlice = createSlice({
  name: 'studentList',
  initialState: {
    students: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearStudentList: (state) => {
      state.students = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudentList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearStudentList } = studentListSlice.actions;
export default studentListSlice.reducer;