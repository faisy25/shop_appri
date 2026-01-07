import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { Close, FilterList } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import Select from 'react-select';

/**
 * Reusable Filter Modal Component
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Array} props.filterFields - Array of filter field configurations
 *   Each field should have:
 *   - key: string (required) - Unique identifier for the filter
 *   - label: string (required) - Label text
 *   - type: 'select' | 'text' | 'number' | 'date' | 'checkbox' | 'multiselect' (default: 'select')
 *   - options: array (for select/multiselect) - Array of {label, value} objects
 *   - placeholder: string - Placeholder text
 *   - value: any - Current value (for controlled components)
 *   - onChange: Function - Custom onChange handler (optional)
 * @param {Object} props.filters - Current filter values object
 * @param {Function} props.onFilterChange - Function to call when a filter changes (key, value)
 * @param {Function} props.onClearFilters - Function to call when clearing all filters
 * @param {string} props.title - Optional custom title (default: "Filters")
 */
const FilterModal = ({
  open,
  onClose,
  filterFields = [],
  filters = {},
  onFilterChange,
  onClearFilters,
  title = 'Filters',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0),
    ).length;
  }, [filters]);

  // Styles for react-select to match Material-UI TextField styling
  const selectStyles = useMemo(
    () => ({
      control: (base, state) => {
        const defaultBorderColor = isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)';
        const focusedBorderColor = theme.palette.primary.main;
        const hoverBorderColor = isDark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)';

        return {
          ...base,
          minHeight: '40px',
          backgroundColor: isDark ? '#313131' : theme.palette.background.paper,
          borderColor: state.isFocused ? focusedBorderColor : defaultBorderColor,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: theme.shape.borderRadius || '4px',
          boxShadow: state.isFocused ? `0 0 0 1px ${focusedBorderColor}` : 'none',
          '&:hover': {
            borderColor: hoverBorderColor,
          },
          cursor: 'pointer',
        };
      },
      placeholder: (base) => ({
        ...base,
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
      }),
      singleValue: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        fontSize: '0.875rem',
      }),
      multiValue: (base) => ({
        ...base,
        backgroundColor: theme.palette.primary.light || 'rgba(0, 82, 163, 0.1)',
        borderRadius: '4px',
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: theme.palette.primary.main,
        fontSize: '0.875rem',
      }),
      multiValueRemove: (base) => ({
        ...base,
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        },
      }),
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        fontSize: '0.875rem',
        margin: 0,
        padding: 0,
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
        zIndex: 1300,
      }),
      option: (base, state) => {
        const selectedBg = theme.palette.primary.main;
        const focusedBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';

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
          padding: '8px 12px',
          fontSize: '0.875rem',
          cursor: 'pointer',
          '&:active': {
            backgroundColor: selectedBg,
            color: theme.palette.primary.contrastText || (isDark ? '#1E1E1E' : '#fff'),
          },
        };
      },
      indicatorSeparator: (base) => ({
        ...base,
        backgroundColor:
          theme.palette.divider || (isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'),
        marginTop: '4px',
        marginBottom: '4px',
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? theme.palette.primary.main : theme.palette.text.secondary,
        padding: '6px',
        '&:hover': {
          color: theme.palette.primary.main,
        },
      }),
      clearIndicator: (base) => ({
        ...base,
        color: theme.palette.text.secondary,
        padding: '6px',
        '&:hover': {
          color: theme.palette.error.main,
          backgroundColor: isDark ? 'rgba(211, 47, 47, 0.08)' : 'rgba(211, 47, 47, 0.04)',
        },
      }),
    }),
    [theme, isDark],
  );

  const handleApplyFilters = () => {
    onClose();
  };

  const handleClearAll = () => {
    onClearFilters();
  };

  // Render field based on type
  const renderField = (field) => {
    const currentValue = filters[field.key];
    const fieldType = field.type || 'select';

    switch (fieldType) {
      case 'select':
      case 'multiselect': {
        const isMulti = fieldType === 'multiselect';
        let selectedOption = null;

        if (isMulti) {
          selectedOption = Array.isArray(currentValue)
            ? field.options?.filter((opt) => currentValue.includes(opt.value)) || []
            : [];
        } else {
          selectedOption = field.options?.find((opt) => opt.value === currentValue) || null;
        }

        return (
          <Select
            value={selectedOption}
            onChange={(selected) => {
              const value = isMulti
                ? (selected || []).map((opt) => opt.value)
                : selected?.value || null;

              if (onFilterChange) {
                onFilterChange(field.key, value);
              } else if (field.onChange) {
                field.onChange(value);
              }
            }}
            options={field.options || []}
            placeholder={field.placeholder || `Select ${field.label.toLowerCase()}...`}
            isClearable
            isMulti={isMulti}
            styles={selectStyles}
            classNamePrefix="filter-select"
          />
        );
      }

      case 'text':
      case 'number':
      case 'date': {
        return (
          <TextField
            fullWidth
            size="small"
            type={fieldType}
            value={currentValue || ''}
            onChange={(e) => {
              const value =
                fieldType === 'number' ? Number(e.target.value) || null : e.target.value;
              if (onFilterChange) {
                onFilterChange(field.key, value);
              } else if (field.onChange) {
                field.onChange(value);
              }
            }}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            slotProps={{
              input: {
                sx: {
                  fontSize: '0.875rem',
                },
              },
              inputLabel: {
                sx: {
                  fontSize: '0.8125rem',
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
        );
      }

      case 'checkbox': {
        const checked = Array.isArray(currentValue)
          ? currentValue
          : currentValue === true || currentValue === 1 || currentValue === 'true';

        return (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => {
                    const value = e.target.checked;
                    if (onFilterChange) {
                      onFilterChange(field.key, value);
                    } else if (field.onChange) {
                      field.onChange(value);
                    }
                  }}
                  size="small"
                />
              }
              label={
                <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                  {field.checkboxLabel || field.label}
                </Typography>
              }
            />
          </FormGroup>
        );
      }

      case 'checkbox-group': {
        const selectedValues = Array.isArray(currentValue) ? currentValue : [];

        return (
          <FormGroup>
            {field.options?.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => {
                        let newValues = [...selectedValues];
                        if (e.target.checked) {
                          newValues.push(option.value);
                        } else {
                          newValues = newValues.filter((v) => v !== option.value);
                        }
                        if (onFilterChange) {
                          onFilterChange(field.key, newValues);
                        } else if (field.onChange) {
                          field.onChange(newValues);
                        }
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                      {option.label}
                    </Typography>
                  }
                />
              );
            })}
          </FormGroup>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            maxHeight: '90vh',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1.5,
          pt: 2,
          px: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList sx={{ color: 'primary.main', fontSize: '1.25rem' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {title}
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              label={activeFilterCount}
              size="small"
              color="primary"
              sx={{ ml: 0.5, minWidth: '20px', height: '20px', fontSize: '0.75rem' }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: 2.5, pb: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
          {filterFields.map((field) => {
            // Don't show label for checkbox (single) as it's inline
            const showLabel = field.type !== 'checkbox';

            return (
              <Box key={field.key}>
                {showLabel && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: 'text.secondary',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                    }}
                  >
                    {field.label}
                  </Typography>
                )}
                {renderField(field)}
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1 }}>
        <Button
          onClick={handleClearAll}
          variant="outlined"
          disabled={activeFilterCount === 0}
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            px: 2,
            py: 0.75,
          }}
        >
          Clear All
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={handleApplyFilters}
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            px: 2,
            py: 0.75,
          }}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;
