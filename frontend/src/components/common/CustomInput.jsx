import React from 'react';
import { TextField, Box, Typography, useTheme } from '@mui/material';

const CustomInput = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  isRequired = false,
  multiline = false,
  rows = 3,
  min,
  max,
  step,
  disabled = false,
  helperText,
  validation = {},
  register,
  errors = {},
  htmlInput,
  ...rest
}) => {
  const theme = useTheme();

  if (!register) {
    console.error(
      `CustomInput: register is required for field "${name}". Please pass register prop from useForm().`,
    );
    return null;
  }

  const error = errors?.[name];
  const fieldError = error?.message || helperText;

  // Determine input type based on type prop
  const getInputType = () => {
    if (type === 'decimal' || type === 'float') {
      return 'number';
    }
    return type;
  };

  // Get input props based on type
  const getInputProps = () => {
    const props = {};

    if (type === 'number' || type === 'decimal' || type === 'float') {
      if (min !== undefined) props.min = min;
      if (max !== undefined) props.max = max;
      if (step !== undefined) {
        props.step = step;
      } else if (type === 'decimal' || type === 'float') {
        props.step = '0.01';
      }
    }

    return props;
  };

  // Combine validation rules
  const validationRules = {
    ...validation,
    ...(isRequired && {
      required: `${label || 'This field'} is required`,
    }),
  };

  return (
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
      <TextField
        {...register(name, validationRules)}
        type={getInputType()}
        variant="outlined"
        fullWidth
        multiline={multiline}
        rows={multiline ? rows : undefined}
        placeholder={placeholder}
        disabled={disabled}
        error={!!error}
        helperText={fieldError}
        inputProps={getInputProps()}
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
          input: {
            ...(type === 'number' || type === 'decimal' || type === 'float'
              ? {
                  inputMode: 'numeric',
                  pattern: type === 'decimal' || type === 'float' ? '[0-9]*\\.?[0-9]*' : '[0-9]*',
                }
              : {}),
          },
          htmlInput: htmlInput || {},
        }}
        {...rest}
      />
    </Box>
  );
};

export default CustomInput;
