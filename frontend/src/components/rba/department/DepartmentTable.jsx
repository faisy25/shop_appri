import CustomTable from '../../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDepartment, fetchDepartments } from '../../../redux/rba/department/departmentThunk';
import { ROUTES } from '../../../routes/routes';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const DepartmentTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await dispatch(deleteDepartment(id)).unwrap();
        toast.success('Department deleted successfully!');
      } catch (err) {
        toast.error(err || 'Failed to delete department');
      }
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const columns = [
    { accessorKey: 'department_id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description', showEllipsis: true },
  ];

  return (
    <>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {list.length > 0 ? (
        <CustomTable
          data={list}
          columns={columns}
          searchEnabled={true}
          onEdit={(row) => navigate(ROUTES.RBA.DEPARTMENT.EDIT_FORM(row.department_id))}
          onDelete={(row) => handleDelete(row.department_id)}
        />
      ) : (
        !loading && <Typography>No departments found...</Typography>
      )}
    </>
  );
};

export default DepartmentTable;
