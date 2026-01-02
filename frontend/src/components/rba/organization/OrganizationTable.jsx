import CustomTable from '../../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteOrganization,
  fetchOrganizations,
} from '../../../redux/rba/organization/organizationThunk';
import { ROUTES } from '../../../routes/routes';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const OrganizationTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector((state) => state.organizations);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await dispatch(deleteOrganization(id)).unwrap();
        toast.success('Organization deleted successfully!');
      } catch (err) {
        toast.error(err || 'Failed to delete organization');
      }
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const columns = [
    { accessorKey: 'organization_id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'parent_company',
      header: 'Parent Company',
      cell: ({ row }) => {
        const parentCompany = row.original.parent_company;
        // Show "-" if parent_company is null, undefined, or empty
        return parentCompany || '-';
      },
    },
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
          onEdit={(row) => navigate(ROUTES.RBA.ORGANIZATION.EDIT_FORM(row.organization_id))}
          onDelete={(row) => handleDelete(row.organization_id)}
        />
      ) : (
        !loading && <Typography>No organizations found...</Typography>
      )}
    </>
  );
};

export default OrganizationTable;
