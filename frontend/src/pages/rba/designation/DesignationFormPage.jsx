import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchDesignationById, createDesignation, updateDesignation } from '../../../redux/rba/designation/designationThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedDesignation } from '../../../redux/rba/designation/designationSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

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
          onClick={() => navigate(ROUTES.RBA.DESIGNATION.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {designation ? 'Edit Designation' : 'Add New Designation'}
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
          label="Designation ID (10 characters)"
          variant="outlined"
          fullWidth
          {...register('designation_id', {
            required: 'Designation ID is required',
            minLength: { value: 10, message: 'Must be exactly 10 characters' },
            maxLength: { value: 10, message: 'Must be exactly 10 characters' },
          })}
          error={!!errors.designation_id}
          helperText={errors.designation_id?.message}
          disabled={!!designation}
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
          label="Designation Name"
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
          ) : designation ? (
            'Update Designation'
          ) : (
            'Create Designation'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default DesignationFormPage;

