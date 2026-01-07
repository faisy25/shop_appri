import { Box, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { fetchRoleById, createRole, updateRole, fetchRoles } from '../../../redux/rba/role/roleThunk';
import { fetchOrganizations } from '../../../redux/rba/organization/organizationThunk';
import { fetchDepartments } from '../../../redux/rba/department/departmentThunk';
import { fetchDesignations } from '../../../redux/rba/designation/designationThunk';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedRole } from '../../../redux/rba/role/roleSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import CustomSelect from '../../../components/common/CustomSelect';
import CustomInput from '../../../components/common/CustomInput';

const RoleFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { role } = useSelector((state) => state.roles);
  const { list: organizations } = useSelector((state) => state.organizations);
  const { list: departments } = useSelector((state) => state.departments);
  const { list: designations } = useSelector((state) => state.designations);
  const [errMsg, setErrMsg] = useState('');

  // Format options for dropdowns
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

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      organization_id: null,
      department_id: null,
      designation_id: null,
      description: '',
    },
  });

  // Watch selected values to show preview of auto-generated role name
  const selectedOrganization = watch('organization_id');
  const selectedDepartment = watch('department_id');
  const selectedDesignation = watch('designation_id');

  // Calculate preview role name (with hyphen separator)
  const previewRoleName = useMemo(() => {
    if (selectedDesignation && selectedDepartment) {
      const designation = designations.find((d) => d.designation_id === selectedDesignation);
      const department = departments.find((d) => d.department_id === selectedDepartment);
      if (designation && department) {
        return `${designation.name}-${department.name}`;
      }
    }
    return '';
  }, [selectedDesignation, selectedDepartment, designations, departments]);

  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  // Fetch organizations, departments, and designations on mount
  useEffect(() => {
    dispatch(fetchOrganizations());
    dispatch(fetchDepartments());
    dispatch(fetchDesignations());
  }, [dispatch]);

  useEffect(() => {
    if (!id) {
      dispatch(clearSelectedRole());
      reset({
        organization_id: null,
        department_id: null,
        designation_id: null,
        description: '',
      });
    } else {
      dispatch(fetchRoleById(id));
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (role) {
      reset({
        organization_id: role.organization?.organization_id || null,
        department_id: role.department?.department_id || null,
        designation_id: role.designation?.designation_id || null,
        description: role.description || '',
      });
    }
  }, [role, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    try {
      if (role) {
        await dispatch(updateRole({ id: role.role_id, data })).unwrap();
        toast.success('Role updated successfully!');
      } else {
        await dispatch(createRole(data)).unwrap();
        toast.success('Role created successfully!');
      }

      // Refetch roles list to ensure it's up to date
      dispatch(fetchRoles());
      dispatch(clearSelectedRole());
      navigate(ROUTES.RBA.ROLE.ROOT);
    } catch (err) {
      setErrMsg(err || 'Something went wrong');
      toast.error(errMsg || err);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        mt: 5,
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          mb: 3,
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.primary' }}
          onClick={() => navigate(ROUTES.RBA.ROLE.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {role ? 'Edit Role' : 'Add New Role'}
        </Typography>
      </Box>

      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <CustomSelect
          name="organization_id"
          control={control}
          options={organizationOptions}
          label="Organization"
          placeholder="Select organization..."
          isMulti={false}
          isRequired={true}
          error={errors.organization_id}
          helperText={errors.organization_id?.message}
        />

        <CustomSelect
          name="department_id"
          control={control}
          options={departmentOptions}
          label="Department"
          placeholder="Select department..."
          isMulti={false}
          isRequired={true}
          error={errors.department_id}
          helperText={errors.department_id?.message}
        />

        <CustomSelect
          name="designation_id"
          control={control}
          options={designationOptions}
          label="Designation"
          placeholder="Select designation..."
          isMulti={false}
          isRequired={true}
          error={errors.designation_id}
          helperText={errors.designation_id?.message}
        />

        {/* Preview of auto-generated role name */}
        {previewRoleName && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Role Name (Auto-generated):
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {previewRoleName}
            </Typography>
          </Box>
        )}

        <CustomInput
          name="description"
          label="Description"
          type="text"
          multiline={true}
          rows={3}
          placeholder="Enter description..."
          isRequired={false}
          register={register}
          errors={errors}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            mt: 1,
            borderRadius: 2,
            py: 1.2,
            fontWeight: 600,
            height: 48,
          }}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={26} />
          ) : role ? (
            'Update Role'
          ) : (
            'Create Role'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default RoleFormPage;
