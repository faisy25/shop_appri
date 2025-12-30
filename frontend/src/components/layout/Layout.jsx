import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import Header from './Header';
import MainSidebar from './MainSidebar';

export default function Layout({ children, mode, setMode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Open by default on desktop, closed on mobile

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Header
        mode={mode}
        setMode={setMode}
        sidebarOpen={sidebarOpen}
        onMenuToggle={handleMenuToggle}
      />

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          width: '100%',
          height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' }, // Full height minus header (responsive)
        }}
      >
        {/* Main Sidebar - Always visible on desktop, overlay on mobile */}
        {!isMobile && (
          <MainSidebar open={sidebarOpen} onToggle={handleMenuToggle} isMobile={isMobile} />
        )}

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: { xs: '100%', md: sidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 64px)' },
            px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            py: { xs: 1.5, sm: 2 },
            overflow: 'auto',
            transition: isMobile ? 'none' : 'width 0.3s ease',
            position: 'relative',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Mobile Sidebar - Overlay */}
      {isMobile && (
        <MainSidebar open={sidebarOpen} onToggle={handleMenuToggle} isMobile={isMobile} />
      )}
    </Box>
  );
}
