import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Close, ExpandMore, ArrowForward } from '@mui/icons-material';
import { useMemo } from 'react';

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
      case 'select': {
        // Render as radio buttons for single select
        return (
          <RadioGroup
            value={currentValue !== null && currentValue !== undefined ? String(currentValue) : ''}
            onChange={(e) => {
              let value = e.target.value;
              // Try to convert to number if it's a numeric string
              if (value && !isNaN(value)) {
                value = Number(value);
              }
              // Set null if empty string
              if (value === '') {
                value = null;
              }
              if (onFilterChange) {
                onFilterChange(field.key, value);
              } else if (field.onChange) {
                field.onChange(value);
              }
            }}
          >
            {field.options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                      '&:hover': {
                        bgcolor: (theme) => `${theme.palette.primary.main}08`,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                    {option.label}
                  </Typography>
                }
                sx={{
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: (theme) => `${theme.palette.primary.main}04`,
                    borderRadius: 1,
                  },
                }}
              />
            ))}
          </RadioGroup>
        );
      }

      case 'multiselect': {
        // Render as checkboxes for multi-select
        const selectedValues = Array.isArray(currentValue) ? currentValue : [];

        return (
          <FormGroup>
            {field.options?.map((option) => {
              // Use loose comparison to handle type mismatches
              const isChecked = selectedValues.some((v) => v == option.value);
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
                          // Use loose comparison to handle type mismatches
                          newValues = newValues.filter((v) => v != option.value);
                        }
                        if (onFilterChange) {
                          onFilterChange(field.key, newValues.length > 0 ? newValues : null);
                        } else if (field.onChange) {
                          field.onChange(newValues.length > 0 ? newValues : null);
                        }
                      }}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                        '&:hover': {
                          bgcolor: (theme) => `${theme.palette.primary.main}08`,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                      {option.label}
                    </Typography>
                  }
                  sx={{
                    mb: 0.5,
                    '&:hover': {
                      bgcolor: (theme) => `${theme.palette.primary.main}04`,
                      borderRadius: 1,
                    },
                  }}
                />
              );
            })}
          </FormGroup>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                fontSize: '0.875rem',
                '& fieldset': {
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.12)',
                },
                '&:hover fieldset': {
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.23)'
                      : 'rgba(0, 0, 0, 0.23)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'text.primary',
                  borderWidth: '1px',
                },
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '0.875rem',
                fontWeight: 400,
                padding: '10px 12px',
                '&::placeholder': {
                  color: 'text.secondary',
                  opacity: 1,
                },
              },
            }}
          />
        );
      }

      case 'radio': {
        return (
          <RadioGroup
            value={currentValue !== null && currentValue !== undefined ? String(currentValue) : ''}
            onChange={(e) => {
              let value = e.target.value;
              // Try to convert to number if it's a numeric string
              if (value && !isNaN(value)) {
                value = Number(value);
              }
              // Set null if empty string
              if (value === '') {
                value = null;
              }
              if (onFilterChange) {
                onFilterChange(field.key, value);
              } else if (field.onChange) {
                field.onChange(value);
              }
            }}
          >
            {field.options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={String(option.value)}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                      '&:hover': {
                        bgcolor: (theme) => `${theme.palette.primary.main}08`,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                    {option.label}
                  </Typography>
                }
                sx={{
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: (theme) => `${theme.palette.primary.main}04`,
                    borderRadius: 1,
                  },
                }}
              />
            ))}
          </RadioGroup>
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
                  sx={{
                    color: 'text.secondary',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: (theme) => `${theme.palette.primary.main}08`,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                  {field.checkboxLabel || field.label}
                </Typography>
              }
              sx={{
                mb: 0.5,
                '&:hover': {
                  bgcolor: (theme) => `${theme.palette.primary.main}04`,
                  borderRadius: 1,
                },
              }}
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
                      sx={{
                        color: 'text.secondary',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                        '&:hover': {
                          bgcolor: (theme) => `${theme.palette.primary.main}08`,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                      {option.label}
                    </Typography>
                  }
                  sx={{
                    mb: 0.5,
                    '&:hover': {
                      bgcolor: (theme) => `${theme.palette.primary.main}04`,
                      borderRadius: 1,
                    },
                  }}
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

  // Get applied filter labels for display
  const appliedFilters = useMemo(() => {
    const applied = [];
    filterFields.forEach((field) => {
      const value = filters[field.key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((val) => {
            const option = field.options?.find((opt) => opt.value == val); // Use == for loose comparison
            if (option) {
              applied.push({ key: field.key, value: val, label: option.label });
            }
          });
        } else {
          // Don't use "if (value)" as 0 is falsy but valid
          const option = field.options?.find((opt) => opt.value == value); // Use == for loose comparison
          applied.push({
            key: field.key,
            value: value,
            label: option ? option.label : value,
          });
        }
      }
    });
    return applied;
  }, [filters, filterFields]);

  const handleRemoveFilter = (key, value) => {
    const currentValue = filters[key];

    if (Array.isArray(currentValue)) {
      const newValue = currentValue.filter((v) => v !== value);
      onFilterChange(key, newValue.length > 0 ? newValue : null);
    } else {
      onFilterChange(key, null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 0,
            bgcolor: 'background.paper',
            height: '100vh',
            maxHeight: '100vh',
            m: 0,
            position: 'fixed',
            right: 0,
            top: 0,
          },
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          justifyContent: 'flex-end',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={handleClearAll}
            disabled={activeFilterCount === 0}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: 'primary.main',
              textDecoration: 'underline',
              minWidth: 'auto',
              p: 0.5,
              '&:hover': {
                bgcolor: 'transparent',
                textDecoration: 'underline',
                color: 'primary.dark',
              },
              '&:disabled': {
                color: 'text.disabled',
                textDecoration: 'none',
              },
            }}
          >
            Clear all
          </Button>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'text.primary',
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            Applied filters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {appliedFilters.map((filter, idx) => (
              <Chip
                key={`${filter.key}-${filter.value}-${idx}`}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter.key, filter.value)}
                size="medium"
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  '& .MuiChip-deleteIcon': {
                    fontSize: '1rem',
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Content */}
      <DialogContent sx={{ p: 0, overflow: 'auto' }}>
        {filterFields.map((field, index) => {
          const isLast = index === filterFields.length - 1;

          return (
            <Accordion
              key={field.key}
              disableGutters
              elevation={0}
              defaultExpanded={index === 0}
              sx={{
                '&:before': { display: 'none' },
                borderBottom: isLast ? 'none' : '1px solid',
                borderColor: 'divider',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  px: 2,
                  py: 1.5,
                  minHeight: 'auto',
                  '&.Mui-expanded': {
                    minHeight: 'auto',
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: '8px 0',
                    '&.Mui-expanded': {
                      margin: '8px 0',
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'text.primary',
                  }}
                >
                  {field.label}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>{renderField(field)}</AccordionDetails>
            </Accordion>
          );
        })}

        {filterFields.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No filter options available
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* Footer with item count and Apply button */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Button
          onClick={handleApplyFilters}
          variant="contained"
          color="primary"
          fullWidth
          endIcon={<ArrowForward />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
            py: 1.5,
            borderRadius: 0,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              filter: 'brightness(0.95)',
            },
          }}
        >
          Apply
        </Button>
      </Box>
    </Dialog>
  );
};

export default FilterModal;
