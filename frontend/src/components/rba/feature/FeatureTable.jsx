import CustomTable from '../../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFeature, fetchFeatures } from '../../../redux/rba/feature/featureThunk';
import { ROUTES } from '../../../routes/routes';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const FeatureTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector((state) => state.features);

  useEffect(() => {
    dispatch(fetchFeatures());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await dispatch(deleteFeature(id)).unwrap();
        toast.success('Feature deleted successfully!');
      } catch (err) {
        toast.error(err || 'Failed to delete feature');
      }
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const columns = [
    { accessorKey: 'feature_id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },

    { accessorKey: 'description', header: 'Description', showEllipsis: true },
    {
      accessorKey: 'parent_feature',
      header: 'Parent Feature',
      cell: ({ row }) => {
        const parentFeature = row.original.parent_feature;
        return parentFeature || '-';
      },
    },
    {
      accessorKey: 'element_type',
      header: 'Element Type',
      cell: ({ row }) => {
        return row.original.element_type.toUpperCase();
      },
    },
    { accessorKey: 'icon', header: 'Icon' },
    { accessorKey: 'fk_id', header: 'FK ID' },
    { accessorKey: 'sort_order', header: 'Sort Order' },
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
          onEdit={(row) => navigate(ROUTES.RBA.FEATURE.EDIT_FORM(row.feature_id))}
          onDelete={(row) => handleDelete(row.feature_id)}
        />
      ) : (
        !loading && <Typography>No features found...</Typography>
      )}
    </>
  );
};

export default FeatureTable;
