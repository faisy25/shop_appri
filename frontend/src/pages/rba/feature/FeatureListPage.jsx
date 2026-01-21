import { Box, Button, Paper, Typography, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { clearSelectedFeature, selectRootFeatures } from '../../../redux/rba/feature/featureSlice';
import FeatureTable from '../../../components/rba/feature/FeatureTable';
import FilterModal from '../../../components/common/FilterModal';
import { FilterList } from '@mui/icons-material';
import { FEATURE_ELEMENT_TYPES } from '../../../constants';

const FeatureListPage = () => {
  const dispatch = useDispatch();

  const rootFeatures = useSelector(selectRootFeatures);

  const [filters, setFilters] = useState({
    element_type: null,
    parent_id: null,
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== null && value !== undefined && value !== '',
    ).length;
  }, [filters]);

  // Format options for parent feature filter (only root features)
  const parentFeatureOptions = useMemo(() => {
    if (!rootFeatures || !Array.isArray(rootFeatures)) return [];

    // Add "Show Root Features" option at the beginning
    const options = [
      {
        label: 'Show Root Features Only',
        value: 0, // Keep as number 0
      },
    ];

    // Add all root features - ensure feature_id is a number
    rootFeatures.forEach((feature) => {
      options.push({
        label: feature.name || `Feature ${feature.feature_id}`,
        value: Number(feature.feature_id), // Ensure it's a number
      });
    });

    return options;
  }, [rootFeatures]);

  // Format element type options
  const elementTypeOptions = useMemo(() => {
    return FEATURE_ELEMENT_TYPES || [];
  }, []);

  useEffect(() => {
    dispatch(clearSelectedFeature());
  }, [dispatch]);

  const handleFilterChange = (filterName, value) => {
    // Normalize parent_id to number to ensure consistent type
    let normalizedValue = value;
    if (filterName === 'parent_id' && value !== null && value !== undefined && value !== '') {
      normalizedValue = Number(value);
    }
    setFilters((prev) => ({
      ...prev,
      [filterName]: normalizedValue,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      element_type: null,
      parent_id: null,
    });
  };

  // Prepare filter fields configuration for FilterModal
  const filterFields = useMemo(
    () => [
      {
        key: 'element_type',
        label: 'Element Type',
        options: elementTypeOptions,
        placeholder: 'All element types...',
      },
      {
        key: 'parent_id',
        label: 'Parent Feature',
        options: parentFeatureOptions,
        placeholder: 'All features (no parent filter)...',
      },
    ],
    [elementTypeOptions, parentFeatureOptions],
  );

  // Prepare filters object for API (only include non-null values)
  const apiFilters = useMemo(() => {
    const apiFiltersObj = {};
    if (filters.element_type) apiFiltersObj.element_type = filters.element_type;
    // Include parent_id if it's set (including 0 for root features)
    if (filters.parent_id !== null && filters.parent_id !== undefined && filters.parent_id !== '') {
      apiFiltersObj.parent_id = filters.parent_id;
    }
    return apiFiltersObj;
  }, [filters]);

  return (
    <>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Feature List</Typography>

          <Box display="flex" gap={1.5} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterModalOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderColor: activeFilterCount > 0 ? 'primary.main' : undefined,
              }}
            >
              Filters
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  color="primary"
                  sx={{ ml: 1, minWidth: '20px', height: '20px', fontSize: '0.75rem' }}
                />
              )}
            </Button>

            <Button
              component={RouterLink}
              to={ROUTES.RBA.FEATURE.ADD_FORM}
              variant="contained"
              color="primary"
              onClick={() => dispatch(clearSelectedFeature())}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              + Add Feature
            </Button>
          </Box>
        </Box>

        <FeatureTable filters={apiFilters} />
      </Paper>

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filterFields={filterFields}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        title="Filter Features"
      />
    </>
  );
};

export default FeatureListPage;
