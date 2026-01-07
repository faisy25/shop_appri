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
import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchUserById,
  createUser,
  updateUser,
  fetchUsers,
} from '../../../redux/rba/user/userThunk';
import {
  clearSelectedUser,
  updateFormData,
  setCurrentStep,
  resetFormData,
  initializeFormFromUser,
} from '../../../redux/rba/user/userSlice';
import { fetchOrganizations } from '../../../redux/rba/organization/organizationThunk';
import { fetchDepartments } from '../../../redux/rba/department/departmentThunk';
import { fetchDesignations } from '../../../redux/rba/designation/designationThunk';
import { fetchRoles } from '../../../redux/rba/role/roleThunk';
import { ROUTES } from '../../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import CustomSelect from '../../../components/common/CustomSelect';
import CustomInput from '../../../components/common/CustomInput';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const steps = ['Role Assignment', 'Basic Information', 'User Details'];

const UserFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { user, formData, currentStep, loading } = useSelector((state) => state.users);
  const { list: organizations } = useSelector((state) => state.organizations);
  const { list: departments } = useSelector((state) => state.departments);
  const { list: designations } = useSelector((state) => state.designations);
  const { list: roles } = useSelector((state) => state.roles);

  const [errMsg, setErrMsg] = useState('');

  // Initialize react-hook-form with Redux formData
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
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
      date_of_birth: formData.step3.date_of_birth,
      gender: formData.step3.gender,
      profile_picture_url: formData.step3.profile_picture_url,
      bio: formData.step3.bio,
    },
  });

  // Watch form values to sync with Redux
  const watchedValues = watch();

  // Sync form data to Redux when form values change
  useEffect(() => {
    dispatch(
      updateFormData({
        step: 'step1',
        data: {
          organization_id: watchedValues.organization_id,
          department_id: watchedValues.department_id,
          designation_id: watchedValues.designation_id,
          role_ids: watchedValues.role_ids,
        },
      }),
    );
  }, [
    watchedValues.organization_id,
    watchedValues.department_id,
    watchedValues.designation_id,
    watchedValues.role_ids,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 'step2',
        data: {
          name: watchedValues.name,
          email: watchedValues.email,
        },
      }),
    );
  }, [watchedValues.name, watchedValues.email, dispatch]);

  useEffect(() => {
    dispatch(
      updateFormData({
        step: 'step3',
        data: {
          phone: watchedValues.phone,
          alternate_phone: watchedValues.alternate_phone,
          country: watchedValues.country,
          date_of_birth: watchedValues.date_of_birth,
          gender: watchedValues.gender,
          profile_picture_url: watchedValues.profile_picture_url,
          bio: watchedValues.bio,
        },
      }),
    );
  }, [
    watchedValues.phone,
    watchedValues.alternate_phone,
    watchedValues.country,
    watchedValues.date_of_birth,
    watchedValues.gender,
    watchedValues.profile_picture_url,
    watchedValues.bio,
    dispatch,
  ]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchOrganizations());
    dispatch(fetchDepartments());
    dispatch(fetchDesignations());
  }, [dispatch]);

  // Fetch roles when filters change
  useEffect(() => {
    const filters = {};
    if (formData.step1.organization_id) filters.organization_id = formData.step1.organization_id;
    if (formData.step1.department_id) filters.department_id = formData.step1.department_id;
    if (formData.step1.designation_id) filters.designation_id = formData.step1.designation_id;
    dispatch(fetchRoles(filters));
  }, [
    formData.step1.organization_id,
    formData.step1.department_id,
    formData.step1.designation_id,
    dispatch,
  ]);

  // Fetch user if editing
  useEffect(() => {
    if (!id) {
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
    } else {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch, reset]);

  // Initialize form from user data
  useEffect(() => {
    if (user && id) {
      dispatch(initializeFormFromUser(user));
    }
  }, [user, id, dispatch]);

  // Reset form when formData changes (after initialization)
  useEffect(() => {
    if (user && id && formData.step2.name) {
      reset({
        organization_id: formData.step1.organization_id,
        department_id: formData.step1.department_id,
        designation_id: formData.step1.designation_id,
        role_ids: Array.isArray(formData.step1.role_ids)
          ? formData.step1.role_ids.join(',')
          : formData.step1.role_ids || '',
        name: formData.step2.name,
        email: formData.step2.email,
        phone: formData.step3.phone,
        alternate_phone: formData.step3.alternate_phone,
        country: formData.step3.country,
        date_of_birth: formData.step3.date_of_birth,
        gender: formData.step3.gender,
        profile_picture_url: formData.step3.profile_picture_url,
        bio: formData.step3.bio,
      });
    }
  }, [formData.step2.name, formData.step1, formData.step3, user, id, reset]);

  // Format options for dropdowns
  const organizationOptions = useMemo(() => {
    if (!organizations || !Array.isArray(organizations)) return [];
    return organizations.map((org) => ({
      label: org.name,
      value: org.organization_id,
    }));
  }, [organizations]);

  const departmentOptions = useMemo(() => {
    if (!departments || !Array.isArray(departments)) return [];
    return departments.map((dept) => ({
      label: dept.name,
      value: dept.department_id,
    }));
  }, [departments]);

  const designationOptions = useMemo(() => {
    if (!designations || !Array.isArray(designations)) return [];
    return designations.map((desig) => ({
      label: desig.name,
      value: desig.designation_id,
    }));
  }, [designations]);

  // Filter roles based on selected organization, department, designation
  const filteredRoleOptions = useMemo(() => {
    if (!roles || !Array.isArray(roles)) return [];
    return roles
      .filter((role) => {
        const orgMatch =
          !formData.step1.organization_id ||
          role.organization?.organization_id === formData.step1.organization_id;
        const deptMatch =
          !formData.step1.department_id ||
          role.department?.department_id === formData.step1.department_id;
        const desigMatch =
          !formData.step1.designation_id ||
          role.designation?.designation_id === formData.step1.designation_id;
        return orgMatch && deptMatch && desigMatch;
      })
      .map((role) => ({
        label: role.name,
        value: role.role_id,
      }));
  }, [roles, formData.step1]);

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

      const submitData = {
        name: data.name,
        email: data.email,
        role_ids: roleIdsArray,
        user_detail: {
          phone: data.phone || null,
          alternate_phone: data.alternate_phone || null,
          country: data.country || null,
          date_of_birth: data.date_of_birth || null,
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
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CustomSelect
              name="organization_id"
              control={control}
              options={organizationOptions}
              label="Organization"
              placeholder="Select organization..."
              isMulti={false}
              isRequired={false}
              error={errors.organization_id}
              helperText={errors.organization_id?.message}
            />

            <CustomSelect
              name="department_id"
              control={control}
              options={departmentOptions}
              label="Department"
              placeholder="Select department..."
              isMulti={false}
              isRequired={false}
              error={errors.department_id}
              helperText={errors.department_id?.message}
            />

            <CustomSelect
              name="designation_id"
              control={control}
              options={designationOptions}
              label="Designation"
              placeholder="Select designation..."
              isMulti={false}
              isRequired={false}
              error={errors.designation_id}
              helperText={errors.designation_id?.message}
            />

            <CustomSelect
              name="role_ids"
              control={control}
              options={filteredRoleOptions}
              label="Assign Roles"
              placeholder="Select roles..."
              isMulti={true}
              isRequired={true}
              error={errors.role_ids}
              helperText={errors.role_ids?.message}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CustomInput
              name="name"
              label="Full Name"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <CustomInput
              name="email"
              label="Email"
              type="email"
              isRequired={true}
              validation={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              register={register}
              errors={errors}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CustomInput
              name="phone"
              label="Phone"
              type="text"
              register={register}
              errors={errors}
            />

            <CustomInput
              name="alternate_phone"
              label="Alternate Phone"
              type="text"
              register={register}
              errors={errors}
            />

            <CustomInput
              name="country"
              label="Country"
              type="text"
              register={register}
              errors={errors}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Date of Birth"
                    value={field.value || null}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        error: !!errors.date_of_birth,
                        helperText: errors.date_of_birth?.message,
                        slotProps: {
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
                        },
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <CustomSelect
              name="gender"
              control={control}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
              label="Gender"
              placeholder="Select gender..."
              isMulti={false}
              isRequired={false}
              error={errors.gender}
              helperText={errors.gender?.message}
            />

            <CustomInput
              name="profile_picture_url"
              label="Profile Picture URL"
              type="text"
              register={register}
              errors={errors}
            />

            <CustomInput
              name="bio"
              label="Bio"
              type="text"
              multiline={true}
              rows={4}
              register={register}
              errors={errors}
            />
          </Box>
        );

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
    </Paper>
  );
};

export default UserFormPage;

