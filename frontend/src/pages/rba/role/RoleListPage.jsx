import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSelectedRole } from '../../../redux/rba/role/roleSlice';
import RoleTable from '../../../components/rba/role/RoleTable';

const RoleListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSelectedRole());
  }, [dispatch]);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Role List</Typography>

        <Button
          component={RouterLink}
          to={ROUTES.RBA.ROLE.ADD_FORM}
          variant="contained"
          color="primary"
          onClick={() => dispatch(clearSelectedRole())}
        >
          + Add Role
        </Button>
      </Box>

      <RoleTable />
    </Paper>
  );
};

export default RoleListPage;

