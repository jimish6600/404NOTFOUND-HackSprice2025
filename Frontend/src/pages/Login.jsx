import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
 import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { theme } from "../theme/theme.js";
 
function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(
    (state) => state.auth.auth || false
  );
  console.log("🚀 ~ LoginPage ~ loading:", loading);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(
          login({
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
          })
        );
        console.log("🚀 ~ onSubmit: ~ resultAction:", resultAction);

        if (login.fulfilled.match(resultAction)) {
          dispatch(
            showSnackbar({ message: "Login successful!", severity: "success" })
          );
          navigate("/dashboard");
        } else if (login.rejected.match(resultAction)) {
          dispatch(
            showSnackbar({
              message:
                resultAction.payload || "Login failed. Please try again.",
              severity: "error",
            })
          );
         }
      } catch (error) {
        console.error("Unexpected error during login:", error);
        dispatch(
          showSnackbar({
            message: "An unexpected error occurred. Please try again later.",
            severity: "error",
          })
        );
       }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {/* Formik Form */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""
            }
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ""
            }
            error={formik.touched.password && Boolean(formik.errors.password)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: "text.primary" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                name="rememberMe"
              />
            }
            label="Remember me"
            sx={{ mt: 1 }}
          />
          <Box sx={{ textAlign: "right", mt: 1 }}>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                fontSize: "1rem",
                color: theme.palette.secondary.main,
              }}
            >
              Don't have an account?
            </Link>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2, color: theme.palette.text.primary }}
            type="submit"
            // disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default LoginPage;