import React from 'react';
import { Box, Typography, FormHelperText, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller } from 'react-hook-form';

const CustomDatePicker = ({
  name,
  control,
  label,
  placeholder = 'Select date...',
  isRequired = false,
  error,
  helperText,
  disabled = false,
  validation = {},
  minDate,
  maxDate,
  ...rest
}) => {
  const theme = useTheme();

  if (!control) {
    console.error(
      `CustomDatePicker: control is required for field "${name}". Please pass control prop from useForm().`,
    );
    return null;
  }

  // Combine validation rules
  const validationRules = {
    ...validation,
    ...(isRequired && {
      required: `${label || 'This field'} is required`,
    }),
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%' }}>
        {label && (
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: error ? 'error.main' : 'text.secondary',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            {label}
            {isRequired && (
              <span style={{ color: theme.palette.error.main, marginLeft: '2px' }}> *</span>
            )}
          </Typography>
        )}
        <Controller
          name={name}
          control={control}
          rules={validationRules}
          render={({ field }) => (
            <DatePicker
              value={field.value || null}
              onChange={(date) => field.onChange(date)}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  error: !!error,
                  placeholder: placeholder,
                  slotProps: {
                    inputLabel: {
                      sx: {
                        display: 'none', // Hide default label since we have external label
                      },
                    },
                  },
                },
              }}
              {...rest}
            />
          )}
        />
        {error && (
          <FormHelperText error sx={{ mt: 0.5, ml: 1.75 }}>
            {error.message || helperText}
          </FormHelperText>
        )}
        {!error && helperText && (
          <FormHelperText sx={{ mt: 0.5, ml: 1.75 }}>{helperText}</FormHelperText>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;

