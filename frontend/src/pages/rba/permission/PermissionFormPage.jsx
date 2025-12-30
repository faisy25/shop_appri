import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchPermissionById, createPermission, updatePermission } from '../../../redux/rba/permission/permissionThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedPermission } from '../../../redux/rba/permission/permissionSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const PermissionFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { permission } = useSelector((state) => state.permissions);
  const [errMsg, setErrMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      permission_id: '',
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
      dispatch(clearSelectedPermission());
      reset({
        permission_id: '',
        name: '',
        description: '',
      });
    } else {
      dispatch(fetchPermissionById(id));
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (permission) {
      reset({
        permission_id: permission.permission_id || '',
        name: permission.name || '',
        description: permission.description || '',
      });
    }
  }, [permission, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    try {
      if (permission) {
        await dispatch(updatePermission({ id: permission.permission_id, data })).unwrap();
        toast.success('Permission updated successfully!');
      } else {
        await dispatch(createPermission(data)).unwrap();
        toast.success('Permission created successfully!');
      }

      dispatch(clearSelectedPermission());
      navigate(ROUTES.RBA.PERMISSION.ROOT);
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
          onClick={() => navigate(ROUTES.RBA.PERMISSION.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {permission ? 'Edit Permission' : 'Add New Permission'}
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
          label="Permission ID (10 characters)"
          variant="outlined"
          fullWidth
          {...register('permission_id', {
            required: 'Permission ID is required',
            minLength: { value: 10, message: 'Must be exactly 10 characters' },
            maxLength: { value: 10, message: 'Must be exactly 10 characters' },
          })}
          error={!!errors.permission_id}
          helperText={errors.permission_id?.message}
          disabled={!!permission}
          slotProps={{
            inputLabel: {
              sx: { fontSize: '0.9rem', color: 'text.secondary' },
            },
          }}
        />

        <TextField
          label="Permission Name"
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
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          {...register('description')}
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
          ) : permission ? (
            'Update Permission'
          ) : (
            'Create Permission'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default PermissionFormPage;

