import { Box, Button, Paper, Typography } from '@mui/material';
import ProductTable from '../../components/product/ProductTable';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { clearSelectedProduct } from '../../redux/product/productSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const ProductListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    clearSelectedProduct();
  }, []);

  return (
    <>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Product List</Typography>

          <Button
            component={RouterLink}
            to={ROUTES.PRODUCT.ADD_FORM}
            variant="contained"
            color="primary"
            onClick={() => dispatch(clearSelectedProduct())}
          >
            + Add Product
          </Button>
        </Box>

        <ProductTable />
      </Paper>
    </>
  );
};

export default ProductListPage;
