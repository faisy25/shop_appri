import { Box, Typography, useTheme } from '@mui/material';

const NewArrivalsBanner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
        py: 5,
        my: 3,
        background: `linear-gradient(135deg, ${theme.palette.secondary.main}30, ${theme.palette.primary.main}30)`,
        borderRadius: 4,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Typography variant="h2" fontWeight={700}>
        ✨ Newly Added Products
      </Typography>

      <Typography variant="body1" mt={1} color="text.secondary">
        Fresh picks curated just for you. Updated automatically when you add new products.
      </Typography>
    </Box>
  );
};

export default NewArrivalsBanner;
