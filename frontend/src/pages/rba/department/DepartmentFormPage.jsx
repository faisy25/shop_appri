import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchDepartmentById, createDepartment, updateDepartment } from '../../../redux/rba/department/departmentThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedDepartment } from '../../../redux/rba/department/departmentSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const DepartmentFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { department } = useSelector((state) => state.departments);
  const [errMsg, setErrMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      department_id: '',
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
      dispatch(clearSelectedDepartment());
      reset({
        department_id: '',
        name: '',
        description: '',
      });
    } else {
      dispatch(fetchDepartmentById(id));
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (department) {
      reset({
        department_id: department.department_id || '',
        name: department.name || '',
        description: department.description || '',
      });
    }
  }, [department, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    try {
      if (department) {
        await dispatch(updateDepartment({ id: department.department_id, data })).unwrap();
        toast.success('Department updated successfully!');
      } else {
        await dispatch(createDepartment(data)).unwrap();
        toast.success('Department created successfully!');
      }

      dispatch(clearSelectedDepartment());
      navigate(ROUTES.RBA.DEPARTMENT.ROOT);
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
          onClick={() => navigate(ROUTES.RBA.DEPARTMENT.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {department ? 'Edit Department' : 'Add New Department'}
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
          label="Department ID"
          variant="outlined"
          fullWidth
          {...register('department_id', { required: 'Department ID is required' })}
          error={!!errors.department_id}
          helperText={errors.department_id?.message}
          disabled={!!department}
          slotProps={{
            inputLabel: {
              sx: { fontSize: '0.9rem', color: 'text.secondary' },
            },
          }}
        />

        <TextField
          label="Department Name"
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
          ) : department ? (
            'Update Department'
          ) : (
            'Create Department'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default DepartmentFormPage;

