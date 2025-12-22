import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, mode, setMode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header mode={mode} setMode={setMode} />

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}
