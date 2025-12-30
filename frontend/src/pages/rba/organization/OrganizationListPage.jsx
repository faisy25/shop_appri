import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSelectedOrganization } from '../../../redux/rba/organization/organizationSlice';
import OrganizationTable from '../../../components/rba/organization/OrganizationTable';

const OrganizationListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSelectedOrganization());
  }, [dispatch]);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Organization List</Typography>

        <Button
          component={RouterLink}
          to={ROUTES.RBA.ORGANIZATION.ADD_FORM}
          variant="contained"
          color="primary"
          onClick={() => dispatch(clearSelectedOrganization())}
        >
          + Add Organization
        </Button>
      </Box>

      <OrganizationTable />
    </Paper>
  );
};

export default OrganizationListPage;

