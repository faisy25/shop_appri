import TheaterComedySharpIcon from '@mui/icons-material/TheaterComedySharp';
import { Typography, Box, Button, useTheme } from '@mui/material';
import ProductListUI from '../components/product/ProductListUI';

const HomePage = () => {
  const theme = useTheme();

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '70vh',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
          }}
        >
          <TheaterComedySharpIcon sx={{ fontSize: 70, color: theme.palette.primary.main }} />
          <Typography variant="h1" mt={2} gutterBottom>
            Welcome to the Shop
          </Typography>

          <Typography variant="h5" color="text.secondary" maxWidth="600px" mx="auto">
            Discover hand-picked products crafted with care. Fresh arrivals every week.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, px: 4, py: 1.5, fontSize: '1rem', borderRadius: 3 }}
          >
            Explore Products
          </Button>
        </Box>
      </Box>

      {/* Newly Added Banner + Product List */}
      <ProductListUI />
    </>
  );
};

export default HomePage;
