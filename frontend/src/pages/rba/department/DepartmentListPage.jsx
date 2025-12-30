import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSelectedDepartment } from '../../../redux/rba/department/departmentSlice';
import DepartmentTable from '../../../components/rba/department/DepartmentTable';

const DepartmentListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSelectedDepartment());
  }, [dispatch]);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Department List</Typography>

        <Button
          component={RouterLink}
          to={ROUTES.RBA.DEPARTMENT.ADD_FORM}
          variant="contained"
          color="primary"
          onClick={() => dispatch(clearSelectedDepartment())}
        >
          + Add Department
        </Button>
      </Box>

      <DepartmentTable />
    </Paper>
  );
};

export default DepartmentListPage;

