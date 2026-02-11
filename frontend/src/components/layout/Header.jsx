import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/auth/authThunk';

export default function Header({ mode, setMode, sidebarOpen, onMenuToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', width: '100%', alignItems: 'stretch' }}>
      {/* Toggle Button Section - Positioned at the edge connecting sidebar and header (Desktop only) */}
      {!isMobile && (
        <Box
          sx={{
            width: sidebarOpen ? '280px' : '64px',
            minHeight: '64px',
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderRight: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            transition: 'width 0.3s ease',
            flexShrink: 0,
          }}
        >
          {sidebarOpen && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: '0.875rem',
              }}
            >
              FIRMA
            </Typography>
          )}
          <IconButton
            onClick={onMenuToggle}
            size="small"
            sx={{
              color: theme.palette.text.primary,
              transition: 'transform 0.3s ease',
              ml: sidebarOpen ? 'auto' : 0,
            }}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
      )}

      <AppBar
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          transition: isMobile ? 'none' : 'width 0.3s ease',
          width: { xs: '100%', md: sidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 64px)' },
          flex: 1,
          ml: 0,
        }}
        position="sticky"
        elevation={1}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: { xs: '56px', sm: '64px' },
            px: { xs: 1, sm: 2, md: 2 },
            pl: { xs: 1, sm: 2, md: !isMobile ? 2 : 3 }, // Reduce left padding on desktop to eliminate gap
          }}
        >
          {/* App Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {isMobile && (
              <IconButton
                onClick={onMenuToggle}
                color="inherit"
                sx={{
                  mr: { xs: 0.5, sm: 1 },
                  p: { xs: 0.75, sm: 1 },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <img
                src="/logo.svg"
                alt="Firma Logo"
                style={{
                  height: isMobile ? '40px' : '50px',
                  width: 'auto',
                }}
              />
            </Box>
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                p: { xs: 0.75, sm: 1 },
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="secondary"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to={ROUTES.LOGIN}
                variant="contained"
                color="secondary"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
