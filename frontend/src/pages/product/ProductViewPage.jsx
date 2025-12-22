import { Box, Typography, Button, Divider, Card, CardMedia, Stack, Rating } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ROUTES } from '../../routes/routes';
import MediaGallery from '../../components/media/MediaGallery';

const ProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useSelector((state) =>
    state.products.list.find((p) => String(p.product_id) === String(id)),
  );

  if (!product) {
    return (
      <Typography variant="h5" textAlign="center" mt={4}>
        Product not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        onClick={() => navigate(ROUTES.PRODUCT.ROOT)}
      >
        Back to Products
      </Button>

      <Card
        sx={{
          display: 'flex',
          gap: 4,
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: 'background.paper',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* LEFT | PRODUCT IMAGE */}
        <Box
          sx={{
            width: { xs: '100%', md: 400 },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MediaGallery media={product.media} />
        </Box>

        {/* RIGHT | PRODUCT DETAILS */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {product.name}
          </Typography>

          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary', lineHeight: 1.7 }}>
            {product.description}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
            <Rating value={4} readOnly />
            <Typography variant="body2" color="text.secondary">
              (120 reviews)
            </Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" fontWeight="bold" color="text.primary">
            ₹ {product.price}
          </Typography>

          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
            Available Quantity: <b>{product.qty}</b>
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Add to Cart
            </Button>

            <Button variant="outlined" color="secondary" sx={{ px: 4, py: 1.5, borderRadius: 2 }}>
              Buy Now
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductViewPage;
