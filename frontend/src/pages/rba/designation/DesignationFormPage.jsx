import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  fetchDesignationById,
  createDesignation,
  updateDesignation,
} from '../../../redux/rba/designation/designationThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedDesignation } from '../../../redux/rba/designation/designationSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import CustomInput from '../../../components/common/CustomInput';
import {
  validateDesignationId,
  validateDesignationName,
} from '../../../utils/validation/commonValidation';

const DesignationFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { designation } = useSelector((state) => state.designations);
  const [errMsg, setErrMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      designation_id: '',
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
      dispatch(clearSelectedDesignation());
      reset({
        designation_id: '',
        name: '',
        description: '',
      });
    } else {
      dispatch(fetchDesignationById(id));
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (designation) {
      reset({
        designation_id: designation.designation_id || '',
        name: designation.name || '',
        description: designation.description || '',
      });
    }
  }, [designation, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    try {
      if (designation) {
        await dispatch(updateDesignation({ id: designation.designation_id, data })).unwrap();
        toast.success('Designation updated successfully!');
      } else {
        await dispatch(createDesignation(data)).unwrap();
        toast.success('Designation created successfully!');
      }

      dispatch(clearSelectedDesignation());
      navigate(ROUTES.RBA.DESIGNATION.ROOT);
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
          onClick={() => navigate(ROUTES.RBA.DESIGNATION.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {designation ? 'Edit Designation' : 'Add New Designation'}
        </Typography>
      </Box>

      <Box onSubmit={handleSubmit(onSubmit)} component="form">
        <Grid container spacing={3}>
          {/* Row 1: Designation ID and Name - 2 per row on larger screens */}
          <Grid item xs={12} md={6}>
            <CustomInput
              name="designation_id"
              label="Designation ID (10 characters)"
              type="text"
              isRequired={true}
              disabled={!!designation}
              validation={{
                required: 'Designation ID is required',
                validate: validateDesignationId,
              }}
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomInput
              name="name"
              label="Designation Name"
              type="text"
              isRequired={true}
              validation={{
                required: 'Designation Name is required',
                validate: validateDesignationName,
              }}
              register={register}
              errors={errors}
            />
          </Grid>

          {/* Row 2: Description - Full width */}
          <Grid item xs={12}>
            <CustomInput
              name="description"
              label="Description"
              type="text"
              multiline={true}
              rows={3}
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
            {isSubmitting ? (
              <CircularProgress size={26} />
            ) : designation ? (
              'Update Designation'
            ) : (
              'Create Designation'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DesignationFormPage;
