import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../../../redux/rba/user/userSlice';
import CustomInput from '../../common/CustomInput';
import CustomSelect from '../../common/CustomSelect';
import CustomDatePicker from '../../common/CustomDatePicker';
import { validatePhone, validateURL, validateDateOfBirth } from '../../../utils/validation/commonValidation';
import { serializeDateForRedux } from '../../../utils/common/dateHelpers';

const UserFormStep3 = () => {
  const dispatch = useDispatch();
  const { watch, register, control, formState } = useFormContext();
  const { errors } = formState;

  const watchedValues = watch();

  // Sync form data to Redux (convert Date to ISO string for serialization)
  useEffect(() => {
    dispatch(
      updateFormData({
        step: 'step3',
        data: {
          phone: watchedValues.phone,
          alternate_phone: watchedValues.alternate_phone,
          country: watchedValues.country,
          date_of_birth: serializeDateForRedux(watchedValues.date_of_birth),
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <CustomInput
        name="phone"
        label="Phone"
        type="text"
        validation={{
          validate: validatePhone,
        }}
        register={register}
        errors={errors}
      />

      <CustomInput
        name="alternate_phone"
        label="Alternate Phone"
        type="text"
        validation={{
          validate: validatePhone,
        }}
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

      <CustomDatePicker
        name="date_of_birth"
        control={control}
        label="Date of Birth"
        placeholder="Select date..."
        isRequired={false}
        error={errors.date_of_birth}
        helperText={errors.date_of_birth?.message}
        validation={{
          validate: validateDateOfBirth,
        }}
        maxDate={new Date()} // Prevent future dates
      />

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
        validation={{
          validate: validateURL,
        }}
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
};

export default UserFormStep3;

