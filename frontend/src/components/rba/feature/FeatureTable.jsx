import CustomTable from '../../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFeature, fetchFeatures } from '../../../redux/rba/feature/featureThunk';
import { ROUTES } from '../../../routes/routes';
import { useEffect, useMemo } from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { toast } from 'react-toastify';

const FeatureTable = ({ filters = {} }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { list = [], loading, error } = useSelector((state) => state.features);

  // Memoize filter key to avoid unnecessary re-fetches
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    dispatch(fetchFeatures(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterKey]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await dispatch(deleteFeature(id)).unwrap();
        toast.success('Feature deleted successfully!');
        // Refetch after delete
        dispatch(fetchFeatures(filters));
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
        const elementType = row.original.element_type?.toUpperCase() || '-';
        return (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {elementType}
          </Typography>
        );
      },
    },
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => {
        const icon = row.original.icon || '-';
        return (
          <Box
            sx={{
              display: 'inline-block',
              px: 1,
              py: 0.5,
              border: 1,
              borderColor: theme.palette.divider,
              borderRadius: 1,
              backgroundColor: theme.palette.background.paper,
              fontSize: '0.75rem',
              color: theme.palette.text.secondary,
              minWidth: '40px',
              textAlign: 'center',
            }}
          >
            {icon}
          </Box>
        );
      },
    },
    { accessorKey: 'route', header: 'Route' },
    { accessorKey: 'fk_id', header: 'FK ID' },
    { accessorKey: 'sort_order', header: 'Sort Order' },
  ];

  return (
    <>
      {loading && <Typography>Loading...</Typography>}

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
