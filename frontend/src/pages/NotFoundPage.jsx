import { Box, Button, Typography, Container, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        padding: isMobile ? 2 : 4,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Error Icon */}
          <Box
            sx={{
              width: isMobile ? 120 : 160,
              height: isMobile ? 120 : 160,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark'
                ? 'rgba(211, 47, 47, 0.1)'
                : 'rgba(211, 47, 47, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: isMobile ? 60 : 80,
                color: theme.palette.error.main,
              }}
            />
          </Box>

          {/* 404 Text */}
          <Typography
            variant={isMobile ? 'h2' : 'h1'}
            sx={{
              fontWeight: 700,
              color: theme.palette.error.main,
              mb: 1,
            }}
          >
            404
          </Typography>

          {/* Error Message */}
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 500,
              mx: 'auto',
              mb: 4,
            }}
          >
            Sorry, the page you are looking for does not exist or has been moved.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: isMobile ? 'column' : 'row',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate(ROUTES.HOME)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: isMobile ? '0.9375rem' : '1rem',
              }}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: isMobile ? '0.9375rem' : '1rem',
              }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;

