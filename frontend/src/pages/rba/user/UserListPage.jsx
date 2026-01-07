import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSelectedUser, resetFormData } from '../../../redux/rba/user/userSlice';
import UserTable from '../../../components/rba/user/UserTable';

const UserListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSelectedUser());
    dispatch(resetFormData());
  }, [dispatch]);

  return (
    <>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">User List</Typography>

          <Button
            component={RouterLink}
            to={ROUTES.RBA.USER.ADD_FORM}
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(clearSelectedUser());
              dispatch(resetFormData());
            }}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            + Add User
          </Button>
        </Box>

        <UserTable />
      </Paper>
    </>
  );
};

export default UserListPage;

