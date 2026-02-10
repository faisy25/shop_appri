import { Box, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
} from '../../../redux/rba/department/departmentThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedDepartment } from '../../../redux/rba/department/departmentSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import CustomInput from '../../../components/common/CustomInput';
import {
  validateDepartmentId,
  validateDepartmentName,
} from './departmentValidation';

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
            name="department_id"
            label="Department ID"
            type="text"
            isRequired={true}
            disabled={!!department}
            validation={{
              required: 'Department ID is required',
              validate: validateDepartmentId,
            }}
            register={register}
            errors={errors}
          />

          <CustomInput
            name="name"
            label="Department Name"
            type="text"
            isRequired={true}
            validation={{
              required: 'Department Name is required',
              validate: validateDepartmentName,
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
            ) : department ? (
              'Update Department'
            ) : (
              'Create Department'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DepartmentFormPage;
