import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import {
  fetchOrganizations,
  fetchOrganizationById,
  createOrganization,
  updateOrganization,
} from '../../../redux/rba/organization/organizationThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  clearSelectedOrganization,
  selectRootOrganizations,
} from '../../../redux/rba/organization/organizationSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import CustomSelect from '../../../components/common/CustomSelect';
import CustomInput from '../../../components/common/CustomInput';
import { ORGANIZATION_TYPES } from '../../../constants';
import { validateOrganizationName } from '../../../utils/validation/commonValidation';

const OrganizationFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { organization, loading } = useSelector((state) => state.organizations);
  // ✅ Using memoized selector: Only recalculates when organizations list changes
  const rootOrganizations = useSelector(selectRootOrganizations);
  const [errMsg, setErrMsg] = useState('');

  // ✅ Component-level memoization: Format transformation (runs only when rootOrganizations or id changes)
  // This is the optimal pattern:
  // 1. Redux selector handles filtering (memoized)
  // 2. Component useMemo handles formatting (component-specific)
  const organizationOptions = useMemo(() => {
    // Exclude current organization when editing (prevents self-parent selection)
    const filtered = id
      ? rootOrganizations.filter((org) => org.organization_id !== parseInt(id))
      : rootOrganizations;

    // Format for react-select: { label, value }
    return filtered.map((org) => ({
      label: org.name,
      value: org.organization_id,
    }));
  }, [rootOrganizations, id]);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      type: null,
      parent_id: null,
    },
  });

  // Type options for organization type dropdown - imported from constants
  const typeOptions = ORGANIZATION_TYPES;

  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  // Fetch all organizations on mount to populate root organizations list
  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if (!id) {
      dispatch(clearSelectedOrganization());
      reset({
        name: '',
        type: null,
        parent_id: null,
      });
    } else {
      dispatch(fetchOrganizationById(id));
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (organization) {
      reset({
        name: organization.name || '',
        type: organization.type || null,
        parent_id:
          organization.parent_id && organization.parent_id !== 0 ? organization.parent_id : null,
      });
    }
  }, [organization, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    const submitData = {
      ...data,
      parent_id: data.parent_id ? Number(data.parent_id) : 0,
    };

    try {
      if (organization) {
        await dispatch(
          updateOrganization({ id: organization.organization_id, data: submitData }),
        ).unwrap();
        toast.success('Organization updated successfully!');
      } else {
        await dispatch(createOrganization(submitData)).unwrap();
        toast.success('Organization created successfully!');
      }

      dispatch(clearSelectedOrganization());
      navigate(ROUTES.RBA.ORGANIZATION.ROOT);
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
          onClick={() => navigate(ROUTES.RBA.ORGANIZATION.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {organization ? 'Edit Organization' : 'Add New Organization'}
        </Typography>
      </Box>

      <Box onSubmit={handleSubmit(onSubmit)} component="form">
        <Grid container spacing={3}>
          {/* Row 1: Organization Name - Full width */}
          <Grid item xs={12}>
            <CustomInput
              name="name"
              label="Organization Name"
              type="text"
              isRequired={true}
              validation={{
                required: 'Organization Name is required',
                validate: validateOrganizationName,
              }}
              register={register}
              errors={errors}
            />
          </Grid>

          {/* Row 2: Type and Parent Organization - 2 per row on larger screens */}
          <Grid item xs={12} md={6}>
            <CustomSelect
              name="type"
              control={control}
              options={typeOptions}
              label="Type"
              placeholder="Select organization type..."
              isMulti={false}
              isRequired={true}
              error={errors.type}
              helperText={errors.type?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSelect
              name="parent_id"
              control={control}
              options={organizationOptions}
              label="Parent Organization (Optional)"
              placeholder="Select parent organization..."
              isMulti={false}
              isLoading={loading}
              error={errors.parent_id}
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
            {isSubmitting ? (
              <CircularProgress size={26} />
            ) : organization ? (
              'Update Organization'
            ) : (
              'Create Organization'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default OrganizationFormPage;
