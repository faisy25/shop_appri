import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchProducts } from '../../redux/product/productThunk';
import NewArrivalsBanner from '../home/NewArrivalsBanner';
import { toast } from 'react-toastify';
import LatestProducts from './LatestProducts';

const ProductListUI = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error);
    }
  }, [error]);

  // sort newest → oldest
  const sorted = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // take latest 10
  const latest10 = sorted.slice(0, 10);

  return (
    <Box sx={{ width: '100%', px: 4 }}>
      {/* NEW ARRIVALS SECTION */}
      <NewArrivalsBanner />

      {loading && <Typography>Loading...</Typography>}

      {/* LATEST PRODUCTS SLIDER */}
      {!loading && <LatestProducts products={latest10} />}
    </Box>
  );
};

export default ProductListUI;
