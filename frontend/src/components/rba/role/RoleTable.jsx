import CustomTable from '../../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRole, fetchRoles } from '../../../redux/rba/role/roleThunk';
import { ROUTES } from '../../../routes/routes';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const RoleTable = ({ filters = {} }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list = [], loading, error } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchRoles(filters));
  }, [dispatch, filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await dispatch(deleteRole(id)).unwrap();
        toast.success('Role deleted successfully!');
        // Refetch after delete
        dispatch(fetchRoles(filters));
      } catch (err) {
        toast.error(err || 'Failed to delete role');
      }
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const columns = [
    { accessorKey: 'role_id', header: 'Role ID' },
    { accessorKey: 'name', header: 'Role Name' },
    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => row.original.organization?.name || '-',
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => row.original.department?.name || '-',
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => row.original.designation?.name || '-',
    },
    { accessorKey: 'description', header: 'Description', showEllipsis: true },
  ];

  return (
    <>
      {loading && <Typography>Loading...</Typography>}

      {list.length > 0 ? (
        <CustomTable
          data={list}
          columns={columns}
          searchEnabled={true}
          onEdit={(row) => navigate(ROUTES.RBA.ROLE.EDIT_FORM(row.role_id))}
          onDelete={(row) => handleDelete(row.role_id)}
        />
      ) : (
        !loading && <Typography>No roles found...</Typography>
      )}
    </>
  );
};

export default RoleTable;
