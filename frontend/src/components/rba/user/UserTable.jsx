import CustomTable from '../../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, fetchUsers } from '../../../redux/rba/user/userThunk';
import { ROUTES } from '../../../routes/routes';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const UserTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list = [], loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        toast.success('User deleted successfully!');
        dispatch(fetchUsers());
      } catch (err) {
        toast.error(err || 'Failed to delete user');
      }
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const columns = [
    { accessorKey: 'user_id', header: 'User ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = row.original.roles || [];
        if (roles.length === 0) return '-';
        return roles.map((role) => role.name).join(', ');
      },
    },
    {
      accessorKey: 'user_detail',
      header: 'Phone',
      cell: ({ row }) => row.original.user_detail?.phone || '-',
    },
    {
      accessorKey: 'user_detail',
      header: 'Country',
      cell: ({ row }) => row.original.user_detail?.country || '-',
    },
  ];

  return (
    <>
      {loading && <Typography>Loading...</Typography>}

      {list.length > 0 ? (
        <CustomTable
          data={list}
          columns={columns}
          searchEnabled={true}
          onEdit={(row) => navigate(ROUTES.RBA.USER.EDIT_FORM(row.user_id))}
          onDelete={(row) => handleDelete(row.user_id)}
        />
      ) : (
        !loading && <Typography>No users found...</Typography>
      )}
    </>
  );
};

export default UserTable;

