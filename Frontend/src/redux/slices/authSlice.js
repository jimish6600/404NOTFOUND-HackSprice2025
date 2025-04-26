import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiRequest from "../../utils/ApiRequest";
import { showSnackbar } from "./snackbarSlice";

const initialState = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  userDetails: {
    loading: false,
  },
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ payload }, { rejectWithValue, dispatch }) => {
    try {
      const response = await ApiRequest.post("auth/login", payload);
      dispatch(
        showSnackbar({
          message: response.data.message || "Login Success!",
          severity: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error?.response?.data?.message || "Login Failed!",
          severity: "error",
        })
      );
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ payload }, { rejectWithValue, dispatch }) => {
    try {
      const response = await ApiRequest.post("auth/register", payload);
      dispatch(
        showSnackbar({
          message: response.data.message || "Registration successful!",
          severity: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error?.response?.data?.message || "Registration Failed!",
          severity: "error",
        })
      );
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);


export const getUserDetails = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiRequest.get("me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.auth.user = null;
      state.auth.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.auth.loading = true;
      state.auth.error = null;
    };

    const handleRejected = (state, action) => {
      state.auth.loading = false;
      state.auth.error = action.payload?.message || "Request failed";
    };

    builder
      // Login
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => {
        state.auth.loading = false;

        if (action.payload.token) {
          state.auth.user = action.payload.user;
          state.auth.token = action.payload.token;
          state.auth.isAuthenticated = true;

          localStorage.setItem("token", action.payload.token);
        }
      })

      .addCase(login.rejected, handleRejected)

      // Register
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, action) => {
        state.auth.loading = false;
        state.auth.user = action.payload.user;
        state.auth.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, handleRejected)
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
