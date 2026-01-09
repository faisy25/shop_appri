import {
  Box,
  Button,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchUserById,
  createUser,
  updateUser,
  fetchUsers,
} from '../../../redux/rba/user/userThunk';
import {
  clearSelectedUser,
  setCurrentStep,
  resetFormData,
  initializeFormFromUser,
} from '../../../redux/rba/user/userSlice';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import UserFormStep1 from '../../../components/rba/user/UserFormStep1';
import UserFormStep2 from '../../../components/rba/user/UserFormStep2';
import UserFormStep3 from '../../../components/rba/user/UserFormStep3';
import { parseDateFromRedux, formatDateForAPI } from '../../../utils/common/dateHelpers';

const steps = ['Role Assignment', 'Basic Information', 'User Details'];

const UserFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { user, formData, currentStep, loading } = useSelector((state) => state.users);

  const [errMsg, setErrMsg] = useState('');
  const isInitializedRef = useRef(false);
  const previousUserIdRef = useRef(null);

  // Initialize react-hook-form with Redux formData
  const methods = useForm({
    defaultValues: {
      // Step 1
      organization_id: formData.step1.organization_id,
      department_id: formData.step1.department_id,
      designation_id: formData.step1.designation_id,
      role_ids: formData.step1.role_ids,
      // Step 2
      name: formData.step2.name,
      email: formData.step2.email,
      // Step 3
      phone: formData.step3.phone,
      alternate_phone: formData.step3.alternate_phone,
      country: formData.step3.country,
      date_of_birth: parseDateFromRedux(formData.step3.date_of_birth),
      gender: formData.step3.gender,
      profile_picture_url: formData.step3.profile_picture_url,
      bio: formData.step3.bio,
    },
  });

  const { handleSubmit, reset, formState } = methods;
  const { isSubmitting } = formState;

  // Fetch user if editing
  useEffect(() => {
    if (!id) {
      isInitializedRef.current = false;
      previousUserIdRef.current = null;
      dispatch(clearSelectedUser());
      dispatch(resetFormData());
      reset({
        organization_id: null,
        department_id: null,
        designation_id: null,
        role_ids: [],
        name: '',
        email: '',
        phone: '',
        alternate_phone: '',
        country: '',
        date_of_birth: null,
        gender: null,
        profile_picture_url: '',
        bio: '',
      });
      // Mark as initialized after reset for new user
      setTimeout(() => {
        isInitializedRef.current = true;
      }, 0);
    } else {
      // Only fetch if user ID changed
      if (previousUserIdRef.current !== id) {
        previousUserIdRef.current = id;
        isInitializedRef.current = false;
        dispatch(fetchUserById(id));
      }
    }
  }, [id, dispatch, reset]);

  // Initialize form from user data (only once when user data is loaded)
  useEffect(() => {
    if (user && id && user.user_id && !isInitializedRef.current) {
      dispatch(initializeFormFromUser(user));

      // Reset form with user data
      const roleIds = user.roles ? user.roles.map((r) => r.role_id) : [];

      // Convert date_of_birth string to Date object
      const dateOfBirth = parseDateFromRedux(user.user_detail?.date_of_birth);

      reset({
        organization_id: user.roles?.[0]?.organization?.organization_id || null,
        department_id: user.roles?.[0]?.department?.department_id || null,
        designation_id: user.roles?.[0]?.designation?.designation_id || null,
        role_ids: Array.isArray(roleIds) ? roleIds.join(',') : roleIds || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.user_detail?.phone || '',
        alternate_phone: user.user_detail?.alternate_phone || '',
        country: user.user_detail?.country || '',
        date_of_birth: dateOfBirth,
        gender: user.user_detail?.gender || null,
        profile_picture_url: user.user_detail?.profile_picture_url || '',
        bio: user.user_detail?.bio || '',
      });

      // Mark as initialized after setting form values
      isInitializedRef.current = true;
    }
  }, [user, id, dispatch, reset]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const onSubmit = async (data) => {
    setErrMsg('');

    try {
      // Prepare data for API
      // Handle role_ids - convert comma-separated string to array
      let roleIdsArray = [];
      if (Array.isArray(data.role_ids)) {
        roleIdsArray = data.role_ids;
      } else if (typeof data.role_ids === 'string' && data.role_ids.trim()) {
        roleIdsArray = data.role_ids
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id);
      }

      // Convert Date object to YYYY-MM-DD format for API
      const dateOfBirth = formatDateForAPI(data.date_of_birth);

      const submitData = {
        name: data.name,
        email: data.email,
        role_ids: roleIdsArray,
        user_detail: {
          phone: data.phone || null,
          alternate_phone: data.alternate_phone || null,
          country: data.country || null,
          date_of_birth: dateOfBirth,
          gender: data.gender || null,
          profile_picture_url: data.profile_picture_url || null,
          bio: data.bio || null,
        },
      };

      if (user) {
        await dispatch(updateUser({ id: user.user_id, data: submitData })).unwrap();
        toast.success('User updated successfully!');
      } else {
        await dispatch(createUser(submitData)).unwrap();
        toast.success('User created successfully!');
      }

      dispatch(fetchUsers());
      dispatch(clearSelectedUser());
      dispatch(resetFormData());
      navigate(ROUTES.RBA.USER.ROOT);
    } catch (err) {
      setErrMsg(err || 'Something went wrong');
      toast.error(errMsg || err);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <UserFormStep1 />;
      case 1:
        return <UserFormStep2 />;
      case 2:
        return <UserFormStep3 />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 800,
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
          onClick={() => navigate(ROUTES.RBA.USER.ROOT)}
        ></Button>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {user ? 'Edit User' : 'Add New User'}
        </Typography>
      </Box>

      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        <Box
          onSubmit={handleSubmit(currentStep === steps.length - 1 ? onSubmit : handleNext)}
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {renderStepContent()}

          {errMsg && (
            <Typography color="error" variant="body2">
              {errMsg}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={currentStep === 0}
              onClick={handleBack}
              sx={{ textTransform: 'none' }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || loading}
              sx={{ textTransform: 'none', minWidth: 120 }}
            >
              {isSubmitting || loading ? (
                <CircularProgress size={24} />
              ) : currentStep === steps.length - 1 ? (
                user ? (
                  'Update User'
                ) : (
                  'Create User'
                )
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Paper>
  );
};

export default UserFormPage;
