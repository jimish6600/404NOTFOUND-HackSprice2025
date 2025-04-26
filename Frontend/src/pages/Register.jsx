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
// import your register action
// import { register, showSnackbar } from "../redux/actions/authActions"; 

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.auth || false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(
          register({
            name: values.name,
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
          })
        );
        console.log("🚀 ~ onSubmit: ~ resultAction:", resultAction);

        if (register.fulfilled.match(resultAction)) {
          dispatch(
            showSnackbar({ message: "Registration successful!", severity: "success" })
          );
          navigate("/dashboard");
        } else if (register.rejected.match(resultAction)) {
          dispatch(
            showSnackbar({
              message: resultAction.payload || "Registration failed. Please try again.",
              severity: "error",
            })
          );
        }
      } catch (error) {
        console.error("Unexpected error during registration:", error);
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
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        {/* Formik Form */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
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
            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
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
            helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
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
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ""
            }
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
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
              to="/login"
              style={{
                textDecoration: "none",
                fontSize: "1rem",
                color: theme.palette.secondary.main,
              }}
            >
              Already have an account?
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
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default RegisterPage;
