import { Box, TextField, Typography, Button, Paper } from '@mui/material';
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
import { ORGANIZATION_TYPES } from '../../../util/constants';

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
          onClick={() => navigate(ROUTES.RBA.ORGANIZATION.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {organization ? 'Edit Organization' : 'Add New Organization'}
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
        <TextField
          label="Organization Name"
          variant="outlined"
          fullWidth
          {...register('name', { required: 'Name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{
            inputLabel: {
              sx: { fontSize: '0.9rem', color: 'text.secondary' },
            },
          }}
        />

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
          ) : organization ? (
            'Update Organization'
          ) : (
            'Create Organization'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default OrganizationFormPage;
