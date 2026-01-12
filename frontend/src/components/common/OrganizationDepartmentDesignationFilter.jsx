import React, { useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { fetchOrganizations } from '../../redux/rba/organization/organizationThunk';
import { fetchDepartments } from '../../redux/rba/department/departmentThunk';
import { fetchDesignations } from '../../redux/rba/designation/designationThunk';
import CustomSelect from './CustomSelect';

/**
 * Reusable component for Organization, Department, and Designation filters
 *
 * IMPORTANT: This component MUST be used inside a FormProvider OR you must pass the control prop.
 * React hooks must be called unconditionally, so useFormContext will always be called.
 * If not inside FormProvider and control prop is not provided, an error will be thrown.
 *
 * @param {Object} props
 * @param {boolean} props.showOrganization - Show organization dropdown (default: true)
 * @param {boolean} props.showDepartment - Show department dropdown (default: true)
 * @param {boolean} props.showDesignation - Show designation dropdown (default: true)
 * @param {boolean} props.organizationRequired - Organization is required (default: false)
 * @param {boolean} props.departmentRequired - Department is required (default: false)
 * @param {boolean} props.designationRequired - Designation is required (default: false)
 * @param {Function} props.onChange - Callback when any filter changes (receives { organization_id, department_id, designation_id })
 * @param {Object} props.errors - Form errors object (optional, uses form context if not provided)
 * @param {Object} props.control - Form control object (REQUIRED if not inside FormProvider)
 * @param {string} props.organizationLabel - Custom label for organization (default: "Organization")
 * @param {string} props.departmentLabel - Custom label for department (default: "Department")
 * @param {string} props.designationLabel - Custom label for designation (default: "Designation")
 * @param {string} props.organizationPlaceholder - Custom placeholder for organization
 * @param {string} props.departmentPlaceholder - Custom placeholder for department
 * @param {string} props.designationPlaceholder - Custom placeholder for designation
 * @param {string} props.spacing - Gap between fields (default: 3)
 * @param {string} props.direction - Layout direction: 'row' or 'column' (default: 'column')
 */
const OrganizationDepartmentDesignationFilter = ({
  showOrganization = true,
  showDepartment = true,
  showDesignation = true,
  organizationRequired = false,
  departmentRequired = false,
  designationRequired = false,
  onChange,
  errors: externalErrors,
  control: externalControl,
  organizationLabel = 'Organization',
  departmentLabel = 'Department',
  designationLabel = 'Designation',
  organizationPlaceholder = 'Select organization...',
  departmentPlaceholder = 'Select department...',
  designationPlaceholder = 'Select designation...',
  spacing = 3,
  direction = 'column',
}) => {
  const dispatch = useDispatch();

  // React hooks must be called unconditionally at the top level
  // Always call useFormContext - this will throw if not inside FormProvider
  // If externalControl is provided, it will be preferred over form context
  // NOTE: Component MUST be inside FormProvider if externalControl is not provided
  const formContext = useFormContext();

  // Prefer externalControl if provided, otherwise use form context
  const control = externalControl || formContext?.control || null;
  const watch = formContext?.watch || null;
  const formErrors = formContext?.formState?.errors || {};

  // Use external errors if provided, otherwise use form context errors
  const errors = externalErrors || formErrors;

  const { list: organizations } = useSelector((state) => state.organizations);
  const { list: departments } = useSelector((state) => state.departments);
  const { list: designations } = useSelector((state) => state.designations);

  // Fetch data on mount
  useEffect(() => {
    if (showOrganization) dispatch(fetchOrganizations());
    if (showDepartment) dispatch(fetchDepartments());
    if (showDesignation) dispatch(fetchDesignations());
  }, [dispatch, showOrganization, showDepartment, showDesignation]);

  // Format options
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

  // Watch values if form context is available
  const watchedOrganization = watch ? watch('organization_id') : null;
  const watchedDepartment = watch ? watch('department_id') : null;
  const watchedDesignation = watch ? watch('designation_id') : null;

  // Call onChange callback when values change
  useEffect(() => {
    if (
      onChange &&
      (watchedOrganization !== undefined ||
        watchedDepartment !== undefined ||
        watchedDesignation !== undefined)
    ) {
      onChange({
        organization_id: watchedOrganization || null,
        department_id: watchedDepartment || null,
        designation_id: watchedDesignation || null,
      });
    }
  }, [watchedOrganization, watchedDepartment, watchedDesignation, onChange]);

  // Require control for CustomSelect to work
  if (!control && (showOrganization || showDepartment || showDesignation)) {
    console.warn(
      'OrganizationDepartmentDesignationFilter: Must be used inside FormProvider or provide control prop',
    );
    return null;
  }

  // Use Grid for horizontal layout, Box for vertical
  if (direction === 'row') {
    return (
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: spacing,
        }}
      >
        {showOrganization && (
          <CustomSelect
            name="organization_id"
            control={control}
            options={organizationOptions}
            label={organizationLabel}
            placeholder={organizationPlaceholder}
            isMulti={false}
            isRequired={organizationRequired}
            error={errors.organization_id}
            helperText={errors.organization_id?.message}
          />
        )}

        {showDepartment && (
          <CustomSelect
            name="department_id"
            control={control}
            options={departmentOptions}
            label={departmentLabel}
            placeholder={departmentPlaceholder}
            isMulti={false}
            isRequired={departmentRequired}
            error={errors.department_id}
            helperText={errors.department_id?.message}
          />
        )}

        {showDesignation && (
          <CustomSelect
            name="designation_id"
            control={control}
            options={designationOptions}
            label={designationLabel}
            placeholder={designationPlaceholder}
            isMulti={false}
            isRequired={designationRequired}
            error={errors.designation_id}
            helperText={errors.designation_id?.message}
          />
        )}
      </Box>
    );
  }

  // Vertical layout (default)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {showOrganization && (
        <CustomSelect
          name="organization_id"
          control={control}
          options={organizationOptions}
          label={organizationLabel}
          placeholder={organizationPlaceholder}
          isMulti={false}
          isRequired={organizationRequired}
          error={errors.organization_id}
          helperText={errors.organization_id?.message}
        />
      )}

      {showDepartment && (
        <CustomSelect
          name="department_id"
          control={control}
          options={departmentOptions}
          label={departmentLabel}
          placeholder={departmentPlaceholder}
          isMulti={false}
          isRequired={departmentRequired}
          error={errors.department_id}
          helperText={errors.department_id?.message}
        />
      )}

      {showDesignation && (
        <CustomSelect
          name="designation_id"
          control={control}
          options={designationOptions}
          label={designationLabel}
          placeholder={designationPlaceholder}
          isMulti={false}
          isRequired={designationRequired}
          error={errors.designation_id}
          helperText={errors.designation_id?.message}
        />
      )}
    </Box>
  );
};

export default OrganizationDepartmentDesignationFilter;
