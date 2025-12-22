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
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import MenuDrawer from './MenuDrawer';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import getMenuRouteHelper from '../../routes/getMenuRouteHelper.routes';

export default function Header({ mode, setMode }) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
        }}
        position="sticky"
        elevation={1}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* App */}
          <Typography
            component={RouterLink}
            to="/"
            variant={isMobile ? 'h6' : 'h5'}
            sx={{ fontWeight: 700, cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
          >
            Shop
          </Typography>

          {!isMobile && (
            <Box>
              {getMenuRouteHelper().map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    backgroundColor: location.pathname.startsWith(item.path)
                      ? theme.palette.action.selected // MUI subtle highlight
                      : 'transparent',
                    borderRadius: 1,
                    px: 2,
                    py: 0.5,
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Box>
              <Button
                variant="contained"
                color="secondary"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Login
              </Button>

              {/* Theme Toggle */}
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Box>
          )}

          {/* Small screen menu bar shown */}
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* For small menu drawer  */}
      <MenuDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        toggleTheme={toggleTheme}
        mode={mode}
      />
    </>
  );
}
