import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import snackbarReducer from './slices/snackbarSlice';
import courseReducer from './slices/courseSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackbarReducer,
    course: courseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 