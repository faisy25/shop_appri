import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import getMenuRouteHelper from '../../routes/getMenuRouteHelper.routes';

const MenuDrawer = ({ drawerOpen, setDrawerOpen, toggleTheme, mode }) => {
  const theme = useTheme();
  const location = useLocation();
  return (
    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box sx={{ width: 260 }} role="presentation">
        {/* Drawer Header with Close Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            py: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>

          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Navigation Links */}
        <List>
          {getMenuRouteHelper().map((item) => (
            <ListItem
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
              key={item.path}
              disablePadding
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List>
          {/* Login */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          {/* Theme Toggle */}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleTheme}>
              <ListItemText primary={mode === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
