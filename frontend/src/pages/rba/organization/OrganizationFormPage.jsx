import { Box, TextField, Typography, Button, Paper, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchOrganizationById, createOrganization, updateOrganization } from '../../../redux/rba/organization/organizationThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedOrganization } from '../../../redux/rba/organization/organizationSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const OrganizationFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { organization } = useSelector((state) => state.organizations);
  const [errMsg, setErrMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      parent_id: '',
    },
  });

  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  useEffect(() => {
    if (!id) {
      dispatch(clearSelectedOrganization());
      reset({
        name: '',
        type: '',
        parent_id: '',
      });
    } else {
      dispatch(fetchOrganizationById(id));
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (organization) {
      reset({
        name: organization.name || '',
        type: organization.type || '',
        parent_id: organization.parent_id || '',
      });
    }
  }, [organization, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    const submitData = {
      ...data,
      parent_id: data.parent_id ? Number(data.parent_id) : null,
    };

    try {
      if (organization) {
        await dispatch(updateOrganization({ id: organization.organization_id, data: submitData })).unwrap();
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

        <TextField
          label="Type"
          variant="outlined"
          fullWidth
          select
          {...register('type', { required: 'Type is required' })}
          error={!!errors.type}
          helperText={errors.type?.message}
          slotProps={{
            inputLabel: {
              sx: { fontSize: '0.9rem', color: 'text.secondary' },
            },
          }}
        >
          <MenuItem value="internal">Internal</MenuItem>
          <MenuItem value="brand">Brand</MenuItem>
          <MenuItem value="outsourced">Outsourced</MenuItem>
        </TextField>

        <TextField
          label="Parent ID (Optional)"
          variant="outlined"
          fullWidth
          type="number"
          {...register('parent_id')}
          slotProps={{
            inputLabel: {
              sx: { fontSize: '0.9rem', color: 'text.secondary' },
            },
          }}
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

