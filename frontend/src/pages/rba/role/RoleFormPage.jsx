import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchRoleById, createRole, updateRole, fetchRoles } from '../../../redux/rba/role/roleThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedRole } from '../../../redux/rba/role/roleSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const RoleFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { role } = useSelector((state) => state.roles);
  const [errMsg, setErrMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role_id: '',
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  useEffect(() => {
    if (!id) {
      dispatch(clearSelectedRole());
      reset({
        role_id: '',
        name: '',
        description: '',
      });
    } else {
      dispatch(fetchRoleById(id));
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (role) {
      reset({
        role_id: role.role_id || '',
        name: role.name || '',
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
        <TextField
          label="Role ID"
          variant="outlined"
          fullWidth
          {...register('role_id', { required: 'Role ID is required' })}
          error={!!errors.role_id}
          helperText={errors.role_id?.message}
          disabled={!!role}
          slotProps={{
            inputLabel: {
              sx: { 
                fontSize: '0.9rem', 
                color: 'text.secondary',
                zIndex: 1,
                '&.MuiInputLabel-shrink': {
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  padding: '0 4px',
                },
              },
            },
          }}
        />

        <TextField
          label="Role Name"
          variant="outlined"
          fullWidth
          {...register('name', { required: 'Name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{
            inputLabel: {
              sx: { 
                fontSize: '0.9rem', 
                color: 'text.secondary',
                zIndex: 1,
                '&.MuiInputLabel-shrink': {
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  padding: '0 4px',
                },
              },
            },
          }}
        />

        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          {...register('description')}
          slotProps={{
            inputLabel: {
              sx: { 
                fontSize: '0.9rem', 
                color: 'text.secondary',
                zIndex: 1,
                '&.MuiInputLabel-shrink': {
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  padding: '0 4px',
                },
              },
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

