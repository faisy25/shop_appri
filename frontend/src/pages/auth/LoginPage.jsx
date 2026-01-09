import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { getCurrentYear } from '../../utils/common/dateHelpers';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual authentication logic here
    // For now, just navigate to home
    navigate(ROUTES.HOME);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Get theme colors for gradients
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary?.main;
  const primaryLight = theme.palette.primary.light || primaryColor;
  const primaryDark = theme.palette.primary.dark || primaryColor;

  // Create gradient colors based on theme
  const getGradientColors = () => {
    // Use primary and secondary if available, otherwise use primary variants
    if (secondaryColor) {
      return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    }
    // Fallback: use primary light/dark variants
    return `linear-gradient(135deg, ${primaryLight} 0%, ${primaryDark} 100%)`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : theme.palette.grey[100],
        padding: isMobile ? 2 : 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: getGradientColors(),
          opacity: 0.1,
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-50%',
          left: '-50%',
          width: '100%',
          height: '100%',
          background: getGradientColors(),
          opacity: 0.1,
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />

      <Container maxWidth="sm" sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            padding: isMobile ? 4 : 6,
            borderRadius: 3,
            background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
          }}
        >
          {/* Brand Logo/Image Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 5,
            }}
          >
            <Box
              sx={{
                width: isMobile ? 72 : 88,
                height: isMobile ? 72 : 88,
                borderRadius: '50%',
                background: getGradientColors(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: `0 8px 24px ${primaryColor}40`,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <ShoppingBagIcon
                sx={{
                  fontSize: isMobile ? 36 : 44,
                  color: 'white',
                }}
              />
            </Box>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 700,
                background: getGradientColors(),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
                letterSpacing: 2,
              }}
            >
              FIRMA
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: isMobile ? '0.875rem' : '0.9375rem',
                textAlign: 'center',
              }}
            >
              Welcome back! Please login to continue
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: primaryColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primaryColor,
                    borderWidth: 2,
                  },
                },
              }}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    zIndex: 1,
                    '&.MuiInputLabel-shrink': {
                      zIndex: 2,
                      backgroundColor:
                        theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
                      padding: '0 4px',
                    },
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: primaryColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primaryColor,
                    borderWidth: 2,
                  },
                },
              }}
              slotProps={{
                inputLabel: {
                  sx: {
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    zIndex: 1,
                    '&.MuiInputLabel-shrink': {
                      zIndex: 2,
                      backgroundColor:
                        theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
                      padding: '0 4px',
                    },
                  },
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: primaryColor,
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.75,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: isMobile ? '1rem' : '1.0625rem',
                textTransform: 'none',
                background: getGradientColors(),
                boxShadow: `0 4px 14px ${primaryColor}30`,
                '&:hover': {
                  background: getGradientColors(),
                  opacity: 0.9,
                  boxShadow: `0 6px 20px ${primaryColor}50`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Login
            </Button>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: 5,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: isMobile ? '0.75rem' : '0.8125rem',
              }}
            >
              © {getCurrentYear()} Firma. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
