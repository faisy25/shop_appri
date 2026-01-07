import { Box, Button, Paper, Typography, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { clearSelectedRole } from '../../../redux/rba/role/roleSlice';
import { fetchOrganizations } from '../../../redux/rba/organization/organizationThunk';
import { fetchDepartments } from '../../../redux/rba/department/departmentThunk';
import { fetchDesignations } from '../../../redux/rba/designation/designationThunk';
import RoleTable from '../../../components/rba/role/RoleTable';
import FilterModal from '../../../components/common/FilterModal';
import { FilterList } from '@mui/icons-material';

const RoleListPage = () => {
  const dispatch = useDispatch();

  const { list: organizations } = useSelector((state) => state.organizations);
  const { list: departments } = useSelector((state) => state.departments);
  const { list: designations } = useSelector((state) => state.designations);

  const [filters, setFilters] = useState({
    organization_id: null,
    department_id: null,
    designation_id: null,
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== null && value !== undefined && value !== '',
    ).length;
  }, [filters]);

  // Format options for filter dropdowns
  const organizationOptions = useMemo(() => {
    if (!organizations || !Array.isArray(organizations)) return [];
    return organizations.map((org) => ({
      label: org.name,
      value: org.organization_id,
    }));
  }, [organizations]);

  const departmentOptions = useMemo(() => {
    if (!departments || !Array.isArray(departments)) return [];
    return departments.map((dept) => ({
      label: dept.name,
      value: dept.department_id,
    }));
  }, [departments]);

  const designationOptions = useMemo(() => {
    if (!designations || !Array.isArray(designations)) return [];
    return designations.map((desig) => ({
      label: desig.name,
      value: desig.designation_id,
    }));
  }, [designations]);

  useEffect(() => {
    dispatch(clearSelectedRole());
    dispatch(fetchOrganizations());
    dispatch(fetchDepartments());
    dispatch(fetchDesignations());
  }, [dispatch]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      organization_id: null,
      department_id: null,
      designation_id: null,
    });
  };

  // Prepare filter fields configuration for FilterModal
  const filterFields = useMemo(
    () => [
      {
        key: 'organization_id',
        label: 'Organization',
        options: organizationOptions,
        placeholder: 'All organizations...',
      },
      {
        key: 'department_id',
        label: 'Department',
        options: departmentOptions,
        placeholder: 'All departments...',
      },
      {
        key: 'designation_id',
        label: 'Designation',
        options: designationOptions,
        placeholder: 'All designations...',
      },
    ],
    [organizationOptions, departmentOptions, designationOptions],
  );

  // Prepare filters object for API (only include non-null values)
  const apiFilters = useMemo(() => {
    const apiFiltersObj = {};
    if (filters.organization_id) apiFiltersObj.organization_id = filters.organization_id;
    if (filters.department_id) apiFiltersObj.department_id = filters.department_id;
    if (filters.designation_id) apiFiltersObj.designation_id = filters.designation_id;
    return apiFiltersObj;
  }, [filters]);

  return (
    <>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Role List</Typography>

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
              to={ROUTES.RBA.ROLE.ADD_FORM}
              variant="contained"
              color="primary"
              onClick={() => dispatch(clearSelectedRole())}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              + Add Role
            </Button>
          </Box>
        </Box>

        <RoleTable filters={apiFilters} />
      </Paper>

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filterFields={filterFields}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        title="Filter Roles"
      />
    </>
  );
};

export default RoleListPage;
