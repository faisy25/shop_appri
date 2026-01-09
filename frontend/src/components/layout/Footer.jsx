import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getCurrentYear } from '../../utils/common/dateHelpers';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        mt: 2,
        py: 2,
        backgroundColor: theme.palette.background.paper,
        // theme.palette.mode === 'light' ? theme.background.default : theme.palette.grey[900],
        textAlign: 'center',
      }}
    >
      <Typography variant={isMobile ? 'body2' : 'body1'} color="text.secondary">
        © {getCurrentYear()} Shop — All rights reserved.
      </Typography>
    </Box>
  );
}
