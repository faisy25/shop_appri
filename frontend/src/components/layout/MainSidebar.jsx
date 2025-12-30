import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useTheme,
  IconButton,
} from '@mui/material';
import { ExpandLess, ExpandMore, Security, Close } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { routeConfig, menuGroups } from '../../routes/routesConfig.routes';
import { sidebarTypography } from '../../theme';

const drawerWidth = 280;
const collapsedWidth = 64;

const MainSidebar = ({ open, onToggle, isMobile }) => {
  const theme = useTheme();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({});

  const handleGroupToggle = (groupName) => {
    setExpandedGroups((prev) => {
      // Accordion behavior: close other groups, toggle current
      const newState = {};
      if (!prev[groupName]) {
        // Opening this group - close all others
        newState[groupName] = true;
      }
      // If it was open, newState will be empty (all closed)
      return newState;
    });
  };

  const isActive = (path) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return location.pathname.startsWith(normalizedPath);
  };

  // Process routes from routeConfig - group by menuGroup
  const menuStructure = useMemo(() => {
    const mainItems = [];
    const groupedItems = {};

    routeConfig.forEach((route) => {
      if (!route.showInMenu) return;

      const menuItem = {
        label: route.label,
        path: route.path,
        icon: route.icon || Security, // Use icon from route config, default to Security
      };

      if (route.menuGroup) {
        // Grouped item (e.g., RBA)
        if (!groupedItems[route.menuGroup]) {
          groupedItems[route.menuGroup] = {
            label: route.menuGroup,
            icon: menuGroups[route.menuGroup]?.icon || Security, // Get icon from menuGroups config
            items: [],
          };
        }
        groupedItems[route.menuGroup].items.push(menuItem);
      } else {
        // Main menu item
        mainItems.push(menuItem);
      }
    });

    return { mainItems, groupedItems };
  }, []);

  const drawerContent = (
    <Box
      sx={{
        width: isMobile ? drawerWidth : open ? drawerWidth : collapsedWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: isMobile ? 'none' : 'width 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Mobile Close Button */}
      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            p: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <IconButton
            onClick={onToggle}
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            <Close />
          </IconButton>
        </Box>
      )}

      {/* Main Menu Items */}
      <List sx={{ flex: 1, pt: { xs: 1, sm: 1 }, overflow: 'auto', pb: 2 }}>
        {/* Main Menu Items (Products, Inventory, etc.) */}
        {menuStructure.mainItems.map((item, index) => (
          <Box key={item.path}>
            <ListItem
              disablePadding
              sx={{
                backgroundColor: isActive(item.path)
                  ? theme.palette.action.selected
                  : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={isMobile ? onToggle : undefined}
                sx={{ pl: open ? 2 : 1.5, justifyContent: open ? 'flex-start' : 'center' }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 40 : 0,
                    justifyContent: 'center',
                    color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  {item.icon && <item.icon />}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        ...(isActive(item.path)
                          ? sidebarTypography.menuItemActive
                          : sidebarTypography.menuItem),
                        sx: {
                          color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                        },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
            {/* Divider after each main item */}
            {index < menuStructure.mainItems.length - 1 && <Divider />}
          </Box>
        ))}

        {/* Divider before grouped items if there are main items */}
        {menuStructure.mainItems.length > 0 &&
          Object.keys(menuStructure.groupedItems).length > 0 && <Divider sx={{ my: 1 }} />}

        {/* Grouped Menu Items (RBA, etc.) */}
        {Object.entries(menuStructure.groupedItems).map(([groupName, group], groupIndex) => {
          const isExpanded = expandedGroups[groupName] || false;
          const GroupIcon = group.icon || Security;

          return (
            <Box key={groupName}>
              {/* Divider before each group */}
              {groupIndex > 0 && <Divider sx={{ my: 1 }} />}

              {open && (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleGroupToggle(groupName)}
                      sx={{
                        pl: 2,
                        justifyContent: 'flex-start',
                        backgroundColor: isExpanded ? theme.palette.action.selected : 'transparent',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <GroupIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${groupName}`}
                        slotProps={{
                          primary: sidebarTypography.groupHeader,
                        }}
                      />
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {group.items.map((item, itemIndex) => (
                        <Box key={item.path}>
                          <ListItem
                            disablePadding
                            sx={{
                              backgroundColor: isActive(item.path)
                                ? theme.palette.action.selected
                                : 'transparent',
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            <ListItemButton
                              component={RouterLink}
                              to={item.path}
                              onClick={isMobile ? onToggle : undefined}
                              sx={{ pl: 4 }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 40,
                                  color: isActive(item.path)
                                    ? theme.palette.primary.main
                                    : 'inherit',
                                }}
                              >
                                {item.icon && <item.icon />}
                              </ListItemIcon>
                              <ListItemText
                                primary={item.label}
                                slotProps={{
                                  primary: {
                                    ...(isActive(item.path)
                                      ? sidebarTypography.subMenuItemActive
                                      : sidebarTypography.subMenuItem),
                                    sx: {
                                      color: isActive(item.path)
                                        ? theme.palette.primary.main
                                        : 'inherit',
                                    },
                                  },
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                          {/* Divider after each submenu item */}
                          {itemIndex < group.items.length - 1 && <Divider sx={{ ml: 4 }} />}
                        </Box>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}

              {/* Collapsed Group Icon */}
              {!open && (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onToggle();
                      setExpandedGroups({ [groupName]: true });
                    }}
                    sx={{ justifyContent: 'center', px: 1.5 }}
                    title={`${groupName}`}
                  >
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                      <GroupIcon />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              )}
            </Box>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
};

export default MainSidebar;
