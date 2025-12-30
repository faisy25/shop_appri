import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSelectedFeature } from '../../../redux/rba/feature/featureSlice';
import FeatureTable from '../../../components/rba/feature/FeatureTable';

const FeatureListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSelectedFeature());
  }, [dispatch]);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Feature List</Typography>

        <Button
          component={RouterLink}
          to={ROUTES.RBA.FEATURE.ADD_FORM}
          variant="contained"
          color="primary"
          onClick={() => dispatch(clearSelectedFeature())}
        >
          + Add Feature
        </Button>
      </Box>

      <FeatureTable />
    </Paper>
  );
};

export default FeatureListPage;

