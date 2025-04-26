// snackbar.slice.js
import { createSlice } from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    open: false,
    message: '',
    severity: 'success', 
  },
  reducers: {
    showSnackbar: (state, action) => {
      const { message, severity = 'success' } = action.payload;
      state.open = true;
      state.message = message;
      state.severity = severity;
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;