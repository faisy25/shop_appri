// src/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Base pastel color palette
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode pastel colors
          primary: { main: '#A3C4F3' },
          secondary: { main: '#F6A6B2' },
          background: { default: '#f3f3f3ff', paper: '#fffff8' },
          text: { primary: '#333', secondary: '#555' },
        }
      : {
          // Dark mode pastel colors
          primary: { main: '#7DA2A9' },
          secondary: { main: '#CBA6F7' },
          background: { default: '#121212', paper: '#1E1E1E' },
          text: { primary: '#EAEAEA', secondary: '#BDBDBD' },
        }),
  },
  typography: {
    fontFamily: ['Poppins', 'Roboto', 'Nunito', 'Arial', 'sans-serif'].join(','),
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
  },
  spacing: 8, // Base spacing unit (e.g., 8px)
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
        },
      },
    },
  },
});

export const createAppTheme = (mode) => responsiveFontSizes(createTheme(getDesignTokens(mode)));
