import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';

export default function ProductCard({ product }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const primaryMedia =
    product.media?.find((m) => m.is_primary === 1 && m.media_type === 'image') ||
    product.media?.find((m) => m.media_type === 'image') ||
    null;

  const defaultImage = 'https://rb.gy/3y0qna';
  const imageUrl = primaryMedia?.media_url || defaultImage;

  const handleOpenProduct = () => {
    navigate(ROUTES.PRODUCT.VIEW(product.product_id));
  };

  return (
    <Card
      onClick={handleOpenProduct}
      sx={{
        width: 280,
        height: 420,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[4],
      }}
    >
      {/* FIXED IMAGE RATIO */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottom: `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <CardMedia
          component="img"
          alt={product.name}
          image={imageUrl}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            height: 40,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.description}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          px: 2,
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" fontWeight={600}>
          ₹ {product.price}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
          }}
          onClick={(e) => {
            e.stopPropagation();
            // add to cart logic here
          }}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
