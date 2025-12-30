import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSelectedPermission } from '../../../redux/rba/permission/permissionSlice';
import PermissionTable from '../../../components/rba/permission/PermissionTable';

const PermissionListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSelectedPermission());
  }, [dispatch]);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Permission List</Typography>

        <Button
          component={RouterLink}
          to={ROUTES.RBA.PERMISSION.ADD_FORM}
          variant="contained"
          color="primary"
          onClick={() => dispatch(clearSelectedPermission())}
        >
          + Add Permission
        </Button>
      </Box>

      <PermissionTable />
    </Paper>
  );
};

export default PermissionListPage;

