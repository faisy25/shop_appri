import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../../../redux/rba/user/userSlice';
import CustomInput from '../../common/CustomInput';
import { validateEmail, validateMinLength } from '../../../utils/validation/commonValidation';

const UserFormStep2 = () => {
  const dispatch = useDispatch();
  const { watch, register, formState } = useFormContext();
  const { errors } = formState;

  const watchedValues = watch();

  // Sync form data to Redux
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

  return (
    <Grid container spacing={3}>
      {/* Row 1: Full Name and Email - 2 per row on larger screens */}
      <Grid item xs={12} md={6}>
        <CustomInput
          name="name"
          label="Full Name"
          type="text"
          isRequired={true}
          validation={{
            required: 'Full Name is required',
            validate: (value) => validateMinLength(value, 2, 'Full Name'),
          }}
          register={register}
          errors={errors}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomInput
          name="email"
          label="Email"
          type="email"
          isRequired={true}
          validation={{
            required: 'Email is required',
            validate: validateEmail,
          }}
          register={register}
          errors={errors}
        />
      </Grid>
    </Grid>
  );
};

export default UserFormStep2;

