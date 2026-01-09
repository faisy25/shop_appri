import React, { useMemo } from 'react';
import Select from 'react-select';
import { Box, FormHelperText, Typography, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

const CustomSelect = ({
  name,
  control,
  options = [],
  label,
  placeholder = 'Select...',
  isMulti = false,
  isRequired = false,
  error,
  helperText,
  isLoading = false,
  isDisabled = false,
  ...rest
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Dynamic styles based on theme mode - matches Material-UI TextField styling
  const customStyles = useMemo(
    () => ({
      control: (base, state) => {
        // Material-UI TextField border colors
        const defaultBorderColor = isDark
          ? 'rgba(255, 255, 255, 0.23)' // Dark mode default border
          : 'rgba(0, 0, 0, 0.23)'; // Light mode default border

        const focusedBorderColor = error ? theme.palette.error.main : theme.palette.primary.main;

        const hoverBorderColor = error
          ? theme.palette.error.main
          : isDark
          ? 'rgba(255, 255, 255, 0.87)' // Dark mode hover
          : 'rgba(0, 0, 0, 0.87)'; // Light mode hover

        return {
          ...base,
          minHeight: '56px',
          // Light mode: background.paper, Dark mode: background.default
          backgroundColor: isDark ? '#313131' : theme.palette.background.paper,
          borderColor: error
            ? theme.palette.error.main
            : state.isFocused
            ? focusedBorderColor
            : defaultBorderColor,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: theme.shape.borderRadius || '4px',
          boxShadow: state.isFocused
            ? error
              ? `0 0 0 1px ${theme.palette.error.main}`
              : `0 0 0 1px ${focusedBorderColor}`
            : 'none',
          opacity: isDisabled ? (isDark ? 0.5 : 0.6) : 1,
          '&:hover': {
            borderColor: isDisabled ? defaultBorderColor : hoverBorderColor,
          },
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        };
      },
      placeholder: (base) => ({
        ...base,
        color: theme.palette.text.secondary,
        fontSize: '1rem',
      }),
      singleValue: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        fontSize: '1rem',
      }),
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${
          theme.palette.divider || (isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)')
        }`,
        boxShadow: isDark ? theme.shadows[8] : theme.shadows[4],
        marginTop: '4px',
        borderRadius: theme.shape.borderRadius || '4px',
        zIndex: 1300, // Match Material-UI dropdown z-index
      }),
      option: (base, state) => {
        const selectedBg = theme.palette.primary.main;
        const focusedBg = isDark
          ? 'rgba(255, 255, 255, 0.08)' // Material-UI dark mode hover
          : 'rgba(0, 0, 0, 0.04)'; // Material-UI light mode hover

        return {
          ...base,
          backgroundColor: state.isSelected
            ? selectedBg
            : state.isFocused
            ? focusedBg
            : 'transparent',
          color: state.isSelected
            ? theme.palette.primary.contrastText || (isDark ? '#1E1E1E' : '#fff')
            : theme.palette.text.primary,
          padding: '10px 14px',
          cursor: 'pointer',
          '&:active': {
            backgroundColor: selectedBg,
            color: theme.palette.primary.contrastText || (isDark ? '#1E1E1E' : '#fff'),
          },
        };
      },
      multiValue: (base) => ({
        ...base,
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius || '16px',
        padding: '2px 4px',
        margin: '2px',
        fontSize: '0.75rem',
        fontWeight: 500,
        minHeight: '24px',
        display: 'flex',
        alignItems: 'center',
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: theme.palette.primary.contrastText || '#ffffff',
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '2px 4px',
        lineHeight: 1.5,
      }),
      multiValueRemove: (base) => ({
        ...base,
        color: theme.palette.primary.contrastText || '#ffffff',
        padding: '0 4px',
        borderRadius: '0 16px 16px 0',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.1)',
          color: theme.palette.primary.contrastText || '#ffffff',
        },
        svg: {
          width: '14px',
          height: '14px',
        },
      }),
      indicatorSeparator: (base) => ({
        ...base,
        backgroundColor:
          theme.palette.divider || (isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'),
        marginTop: '8px',
        marginBottom: '8px',
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? theme.palette.primary.main : theme.palette.text.secondary,
        padding: '8px',
        '&:hover': {
          color: theme.palette.primary.main,
        },
      }),
      clearIndicator: (base) => ({
        ...base,
        color: theme.palette.text.secondary,
        padding: '8px',
        '&:hover': {
          color: theme.palette.error.main,
          backgroundColor: isDark ? 'rgba(211, 47, 47, 0.08)' : 'rgba(211, 47, 47, 0.04)',
        },
      }),
      loadingIndicator: (base) => ({
        ...base,
        color: theme.palette.primary.main,
      }),
      loadingMessage: (base) => ({
        ...base,
        color: theme.palette.text.secondary,
      }),
      noOptionsMessage: (base) => ({
        ...base,
        color: theme.palette.text.secondary,
      }),
    }),
    [theme, isDark, error, isDisabled],
  );

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
      <Controller
        name={name}
        control={control}
        rules={isRequired ? { required: `${label || 'This field'} is required` } : {}}
        render={({ field }) => {
          // Ensure value is always controlled (never undefined)
          // This prevents the "uncontrolled to controlled" React warning
          const getValue = () => {
            if (isMulti) {
              // For multi-select: handle comma-separated string or array
              if (typeof field.value === 'string' && field.value) {
                return options.filter((option) =>
                  field.value
                    .split(',')
                    .map((v) => String(v.trim()))
                    .includes(String(option.value)),
                );
              }
              if (Array.isArray(field.value) && field.value.length > 0) {
                return options.filter((option) => field.value.includes(option.value));
              }
              return [];
            } else {
              // For single select: ensure value is never undefined
              if (field.value === null || field.value === undefined || field.value === '') {
                return null;
              }
              return (
                options.find(
                  (option) =>
                    String(option.value) === String(field.value) ||
                    Number(option.value) === Number(field.value),
                ) || null
              );
            }
          };

          return (
            <Select
              {...field}
              options={options}
              placeholder={placeholder}
              isMulti={isMulti}
              isLoading={isLoading}
              isDisabled={isDisabled}
              isClearable={true} // Always show clear button
              styles={customStyles}
              value={getValue()}
              classNamePrefix="custom-select"
              onChange={(selected) => {
                if (isMulti) {
                  // For multi-select: return comma-separated string
                  const values = selected ? selected.map((item) => item.value) : [];
                  field.onChange(values.length > 0 ? values.join(',') : '');
                } else {
                  // For single select: return null when cleared (optional field)
                  field.onChange(selected ? selected.value : null);
                }
              }}
              {...rest}
            />
          );
        }}
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
  );
};

export default CustomSelect;
