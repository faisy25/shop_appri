import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchFeatureById, createFeature, updateFeature } from '../../../redux/rba/feature/featureThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedFeature } from '../../../redux/rba/feature/featureSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const FeatureFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { feature } = useSelector((state) => state.features);
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
      description: '',
      fk_id: 0,
      parent_id: '',
      sort_order: 0,
    },
  });

  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  useEffect(() => {
    if (!id) {
      dispatch(clearSelectedFeature());
      reset({
        name: '',
        description: '',
        fk_id: 0,
        parent_id: '',
        sort_order: 0,
      });
    } else {
      dispatch(fetchFeatureById(id));
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (feature) {
      reset({
        name: feature.name || '',
        description: feature.description || '',
        fk_id: feature.fk_id || 0,
        parent_id: feature.parent_id || '',
        sort_order: feature.sort_order || 0,
      });
    }
  }, [feature, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    const submitData = {
      ...data,
      fk_id: Number(data.fk_id) || 0,
      parent_id: data.parent_id ? Number(data.parent_id) : null,
      sort_order: Number(data.sort_order) || 0,
    };

    try {
      if (feature) {
        await dispatch(updateFeature({ id: feature.feature_id, data: submitData })).unwrap();
        toast.success('Feature updated successfully!');
      } else {
        await dispatch(createFeature(submitData)).unwrap();
        toast.success('Feature created successfully!');
      }

      dispatch(clearSelectedFeature());
      navigate(ROUTES.RBA.FEATURE.ROOT);
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
          onClick={() => navigate(ROUTES.RBA.FEATURE.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {feature ? 'Edit Feature' : 'Add New Feature'}
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
          label="Feature Name"
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

        <TextField
          label="FK ID"
          variant="outlined"
          fullWidth
          type="number"
          {...register('fk_id')}
          slotProps={{
            inputLabel: {
              sx: { fontSize: '0.9rem', color: 'text.secondary' },
            },
          }}
        />

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

        <TextField
          label="Sort Order"
          variant="outlined"
          fullWidth
          type="number"
          {...register('sort_order')}
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
          ) : feature ? (
            'Update Feature'
          ) : (
            'Create Feature'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default FeatureFormPage;

