import { Box, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import {
  fetchFeatures,
  fetchFeatureById,
  createFeature,
  updateFeature,
} from '../../../redux/rba/feature/featureThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedFeature, selectRootFeatures } from '../../../redux/rba/feature/featureSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import CustomSelect from '../../../components/common/CustomSelect';
import CustomInput from '../../../components/common/CustomInput';
import { FEATURE_ELEMENT_TYPES } from '../../../util/constants';

const FeatureFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { feature, loading } = useSelector((state) => state.features);
  // ✅ Using memoized selector: Only recalculates when features list changes
  const rootFeatures = useSelector(selectRootFeatures);
  const [errMsg, setErrMsg] = useState('');

  // ✅ Component-level memoization: Format transformation (runs only when rootFeatures or id changes)
  // This is the optimal pattern:
  // 1. Redux selector handles filtering (memoized)
  // 2. Component useMemo handles formatting (component-specific)
  const featureOptions = useMemo(() => {
    // Exclude current feature when editing (prevents self-parent selection)
    const filtered = id
      ? rootFeatures.filter((feat) => feat.feature_id !== parseInt(id))
      : rootFeatures;

    // Format for react-select: { label, value }
    return filtered.map((feat) => ({
      label: feat.name,
      value: feat.feature_id,
    }));
  }, [rootFeatures, id]);

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
      element_type: 'menu',
      icon: '',
      description: '',
      fk_id: 0,
      parent_id: null,
      sort_order: 0,
    },
  });

  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  // Fetch all features on mount to populate root features list
  useEffect(() => {
    dispatch(fetchFeatures());
  }, [dispatch]);

  useEffect(() => {
    if (!id) {
      dispatch(clearSelectedFeature());
      reset({
        name: '',
        element_type: 'menu',
        icon: '',
        description: '',
        fk_id: 0,
        parent_id: null,
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
        element_type: feature.element_type || 'menu',
        icon: feature.icon || '',
        description: feature.description || '',
        fk_id: feature.fk_id || 0,
        parent_id: feature.parent_id && feature.parent_id !== 0 ? feature.parent_id : null,
        sort_order: feature.sort_order || 0,
      });
    }
  }, [feature, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    const submitData = {
      ...data,
      fk_id: Number(data.fk_id) || 0,
      parent_id: data.parent_id ? Number(data.parent_id) : 0,
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
        <CustomInput
          name="name"
          label="Feature Name"
          type="text"
          isRequired={true}
          register={register}
          errors={errors}
        />

        <CustomSelect
          name="element_type"
          control={control}
          options={FEATURE_ELEMENT_TYPES}
          label="Element Type"
          placeholder="Select element type..."
          isMulti={false}
          isRequired={true}
          error={errors.element_type}
          helperText={errors.element_type?.message}
        />

        <CustomInput
          name="icon"
          label="Icon (Optional)"
          type="text"
          placeholder="e.g., Dashboard, Settings"
          register={register}
          errors={errors}
        />

        <CustomInput
          name="description"
          label="Description"
          type="text"
          multiline={true}
          rows={3}
          register={register}
          errors={errors}
        />

        <CustomSelect
          name="parent_id"
          control={control}
          options={featureOptions}
          label="Parent Feature (Optional)"
          placeholder="Select parent feature..."
          isMulti={false}
          isLoading={loading}
          error={errors.parent_id}
        />

        <CustomInput
          name="fk_id"
          label="FK ID"
          type="number"
          register={register}
          errors={errors}
        />

        <CustomInput
          name="sort_order"
          label="Sort Order"
          type="number"
          register={register}
          errors={errors}
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
