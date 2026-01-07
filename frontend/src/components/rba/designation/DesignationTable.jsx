import CustomTable from '../../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteDesignation,
  fetchDesignations,
} from '../../../redux/rba/designation/designationThunk';
import { ROUTES } from '../../../routes/routes';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const DesignationTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector((state) => state.designations);

  useEffect(() => {
    dispatch(fetchDesignations());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      try {
        await dispatch(deleteDesignation(id)).unwrap();
        toast.success('Designation deleted successfully!');
      } catch (err) {
        toast.error(err || 'Failed to delete designation');
      }
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const columns = [
    { accessorKey: 'designation_id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
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
          onEdit={(row) => navigate(ROUTES.RBA.DESIGNATION.EDIT_FORM(row.designation_id))}
          onDelete={(row) => handleDelete(row.designation_id)}
        />
      ) : (
        !loading && <Typography>No designations found...</Typography>
      )}
    </>
  );
};

export default DesignationTable;
