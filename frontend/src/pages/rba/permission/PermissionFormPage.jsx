import { Box, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  fetchPermissionById,
  createPermission,
  updatePermission,
} from '../../../redux/rba/permission/permissionThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedPermission } from '../../../redux/rba/permission/permissionSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import CustomInput from '../../../components/common/CustomInput';
import {
  validatePermissionId,
  validatePermissionName,
} from '../../../utils/validation/commonValidation';

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
          gap: 3, // 🔥 Global vertical spacing
          maxWidth: '100%', // Prevents over-stretching on large screens
          mx: 'auto', // Center horizontally
        }}
      >
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              // lg: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          <CustomInput
            name="permission_id"
            label="Permission ID (10 characters)"
            type="text"
            isRequired={true}
            disabled={!!permission}
            validation={{
              required: 'Permission ID is required',
              validate: validatePermissionId,
            }}
            register={register}
            errors={errors}
          />

          <CustomInput
            name="name"
            label="Permission Name"
            type="text"
            isRequired={true}
            validation={{
              required: 'Permission Name is required',
              validate: validatePermissionName,
            }}
            register={register}
            errors={errors}
          />
        </Box>

        <CustomInput
          name="description"
          label="Description"
          type="text"
          multiline={true}
          rows={3}
          register={register}
          errors={errors}
        />

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
            ) : permission ? (
              'Update Permission'
            ) : (
              'Create Permission'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PermissionFormPage;
