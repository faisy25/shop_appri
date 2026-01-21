import CustomTable from '../../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFeature, fetchFeatures } from '../../../redux/rba/feature/featureThunk';
import { ROUTES } from '../../../routes/routes';
import { useEffect, useMemo } from 'react';
import { Typography, Box, useTheme, Chip } from '@mui/material';
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
        // Color mapping for element types
        const getElementTypeColor = (type) => {
          const colors = {
            MENU: theme.palette.primary.main,
            GROUP: theme.palette.secondary.main,
            PAGE: theme.palette.success?.main || '#2e7d32',
            BUTTON: theme.palette.warning?.main || '#ed6c02',
            LINK: theme.palette.info?.main || '#0288d1',
          };
          return colors[type] || theme.palette.text.secondary;
        };

        return (
          <Chip
            label={elementType}
            size="small"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 500,
              height: '22px',
              color: getElementTypeColor(elementType),
              backgroundColor: theme.palette.mode === 'light' 
                ? `${getElementTypeColor(elementType)}15` 
                : `${getElementTypeColor(elementType)}25`,
              border: `1px solid ${getElementTypeColor(elementType)}40`,
              '& .MuiChip-label': {
                px: 1,
                py: 0.25,
              },
            }}
          />
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
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1.5,
              py: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.background.default
                : theme.palette.background.paper,
              fontSize: '0.7rem',
              fontWeight: 400,
              color: theme.palette.text.secondary,
              minWidth: '50px',
              textAlign: 'center',
              boxShadow: theme.palette.mode === 'light' 
                ? '0 1px 2px rgba(0,0,0,0.05)' 
                : '0 1px 2px rgba(0,0,0,0.2)',
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
