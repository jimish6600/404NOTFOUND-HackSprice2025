// theme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light", // Light theme
    primary: {
      main: "#123458", // Deep blue
      contrastText: "#ffffff", // White text for better contrast
    },
    secondary: {
      main: "#D4C9BE", // Muted tan for secondary elements
      contrastText: "#ffffff",
    },
    background: {
      default: "#F1EFEC", // Light beige background
      paper: "#ffffff",   // White for paper elements
    },
    text: {
      primary: "#030303", // Dark text
      secondary: "#636363", // Muted gray text
      disabled: "#9e9e9e",
    },
    error: {
      main: "#e53935", // Red for errors
    },
    warning: {
      main: "#fb8c00", // Orange for warnings
    },
    info: {
      main: "#2196f3", // Info blue
    },
    success: {
      main: "#43a047", // Green for success
    },
    divider: "#e0e0e0", // Subtle divider lines
  },
  typography: {
    fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.25rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    h5: { fontSize: "1.125rem", fontWeight: 500 },
    h6: { fontSize: "1rem", fontWeight: 500 },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.875rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12, 
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // Remove any background gradients
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff", // Sidebar white background
          borderRight: "1px solid #e0e0e0", // Soft border on the right
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#ffffff", // AppBar white
          color: "#030303", // Dark text
          boxShadow: "0 2px 4px rgba(145, 158, 171, 0.2)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(145, 158, 171, 0.1)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e0e0e0", // Soft divider between rows
        },
        head: {
          backgroundColor: "#F1EFEC", // Light beige background for table headers
          fontWeight: 600,
          color: "#030303", // Dark text
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "& fieldset": {
              borderColor: "#D4C9BE", // Soft tan border
            },
            "&:hover fieldset": {
              borderColor: "#123458", // Deep blue on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#123458", // Deep blue when focused
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
});
