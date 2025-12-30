import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSelectedDesignation } from '../../../redux/rba/designation/designationSlice';
import DesignationTable from '../../../components/rba/designation/DesignationTable';

const DesignationListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSelectedDesignation());
  }, [dispatch]);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Designation List</Typography>

        <Button
          component={RouterLink}
          to={ROUTES.RBA.DESIGNATION.ADD_FORM}
          variant="contained"
          color="primary"
          onClick={() => dispatch(clearSelectedDesignation())}
        >
          + Add Designation
        </Button>
      </Box>

      <DesignationTable />
    </Paper>
  );
};

export default DesignationListPage;

