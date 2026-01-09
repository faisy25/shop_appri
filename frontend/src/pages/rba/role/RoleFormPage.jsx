import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import {
  fetchRoleById,
  createRole,
  updateRole,
  fetchRoles,
} from '../../../redux/rba/role/roleThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedRole } from '../../../redux/rba/role/roleSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import CustomInput from '../../../components/common/CustomInput';
import OrganizationDepartmentDesignationFilter from '../../../components/common/OrganizationDepartmentDesignationFilter';
import { validateRoleDescription } from '../../../utils/validation/commonValidation';

const RoleFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { role } = useSelector((state) => state.roles);
  const { list: departments } = useSelector((state) => state.departments);
  const { list: designations } = useSelector((state) => state.designations);
  const [errMsg, setErrMsg] = useState('');

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
        mt: 4,
        borderRadius: 2,
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

      <Box onSubmit={handleSubmit(onSubmit)} component="form">
        <Grid container spacing={3}>
          {/* Row 1: Organization, Department, Designation - 3 per row on larger screens */}
          <Grid item xs={12}>
            <OrganizationDepartmentDesignationFilter
              control={control}
              errors={errors}
              organizationRequired={true}
              departmentRequired={true}
              designationRequired={true}
              direction="row"
              spacing={3}
            />
          </Grid>

          {/* Preview of auto-generated role name */}
          {previewRoleName && (
            <Grid item xs={12}>
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
            </Grid>
          )}

          {/* Row 2: Description - Full width */}
          <Grid item xs={12}>
            <CustomInput
              name="description"
              label="Description"
              type="text"
              multiline={true}
              rows={3}
              placeholder="Enter description..."
              isRequired={false}
              validation={{
                validate: validateRoleDescription,
              }}
              register={register}
              errors={errors}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={26} /> : role ? 'Update Role' : 'Create Role'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RoleFormPage;
