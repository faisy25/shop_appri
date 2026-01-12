import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import OrganizationDepartmentDesignationFilter from '../../../components/common/OrganizationDepartmentDesignationFilter';
import { fetchRoles } from '../../../redux/rba/role/roleThunk';
import { fetchFeatures } from '../../../redux/rba/feature/featureThunk';
import { fetchPermissions } from '../../../redux/rba/permission/permissionThunk';
import {
  fetchPermissionsByRole,
  bulkAssignPermissions,
  bulkRemovePermissions,
} from '../../../redux/rba/roleFeaturePermission/roleFeaturePermissionThunk';
import { toast } from 'react-toastify';

// Helper function to create consistent permission keys
const createPermissionKey = (featureId, permissionId) => {
  return `${String(featureId)}_${String(permissionId)}`;
};

const AccessListPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { list: roles } = useSelector((state) => state.roles);
  const { list: features } = useSelector((state) => state.features);
  const { list: permissions } = useSelector((state) => state.permissions);
  const { rolePermissions, loading } = useSelector((state) => state.roleFeaturePermissions);

  const methods = useForm({
    defaultValues: {
      organization_id: null,
      department_id: null,
      designation_id: null,
    },
  });

  const { watch } = methods;
  const watchedOrg = watch('organization_id');
  const watchedDept = watch('department_id');
  const watchedDesig = watch('designation_id');

  // Generate roleId from organization, department, and designation (like backend)
  const generateRoleId = (orgId, deptId, desigId) => {
    if (!orgId || !deptId || !desigId) return null;
    return `${orgId}${deptId}${desigId}`;
  };

  // Computed roleId from dropdowns
  const computedRoleId = useMemo(() => {
    return generateRoleId(watchedOrg, watchedDept, watchedDesig);
  }, [watchedOrg, watchedDept, watchedDesig]);

  // Check if role exists
  const roleExists = useMemo(() => {
    if (!computedRoleId || !roles || !Array.isArray(roles)) return false;
    return roles.some((role) => role.role_id === computedRoleId);
  }, [computedRoleId, roles]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchFeatures());
    dispatch(fetchPermissions());
    dispatch(fetchRoles());
  }, [dispatch]);

  // When roleId is computed and role exists, fetch its permissions
  useEffect(() => {
    if (computedRoleId && roleExists) {
      setSelectedRoleId(computedRoleId);
      dispatch(fetchPermissionsByRole(computedRoleId));
    } else {
      setSelectedRoleId(null);
      setSelectedPermissions(new Set());
    }
  }, [computedRoleId, roleExists, dispatch]);

  // Update selected permissions when rolePermissions change
  useEffect(() => {
    if (rolePermissions && Array.isArray(rolePermissions) && rolePermissions.length > 0) {
      const permissionSet = new Set();
      rolePermissions.forEach((perm) => {
        // Use helper function to ensure consistent key format
        // The API returns snake_case: feature_id and permission_id
        const featureId = perm.feature_id;
        const permissionId = perm.permission_id;

        // Ensure we have valid values (checking for null/undefined, but allowing 0)
        if (featureId != null && permissionId != null && featureId !== '' && permissionId !== '') {
          const key = createPermissionKey(featureId, permissionId);
          permissionSet.add(key);
        }
      });
      setSelectedPermissions(permissionSet);
    } else if (rolePermissions && Array.isArray(rolePermissions) && rolePermissions.length === 0) {
      // Explicitly handle empty array case
      setSelectedPermissions(new Set());
    } else {
      setSelectedPermissions(new Set());
    }
  }, [rolePermissions]);

  // Sort features: parents first, then their children nested immediately after
  const sortedFeatures = useMemo(() => {
    if (!features || !Array.isArray(features)) return [];

    // Separate root features (parent_id === 0) and child features
    const rootFeatures = features.filter(
      (f) => f.parent_id === 0 || f.parent_id === null || f.parent_id === undefined,
    );
    const childFeatures = features.filter(
      (f) => f.parent_id !== 0 && f.parent_id !== null && f.parent_id !== undefined,
    );

    // Sort root features by sort_order
    const sortedRoots = [...rootFeatures].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Create a map of parent_id to children for quick lookup
    const childrenMap = new Map();
    childFeatures.forEach((child) => {
      const parentId = child.parent_id;
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }
      childrenMap.get(parentId).push(child);
    });

    // Sort children within each parent group by sort_order
    childrenMap.forEach((children) => {
      children.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    });

    // Build final sorted array: for each root feature, add it followed by its children
    const sorted = [];
    sortedRoots.forEach((root) => {
      // Add the root feature
      sorted.push(root);

      // Add its children immediately after
      const children = childrenMap.get(root.feature_id) || [];
      sorted.push(...children);
    });

    return sorted;
  }, [features]);

  // Prepare table data: features as rows, permissions as columns
  const tableData = useMemo(() => {
    if (!sortedFeatures || !permissions) return [];

    return sortedFeatures.map((feature) => {
      const isRootFeature =
        feature.parent_id === 0 || feature.parent_id === null || feature.parent_id === undefined;
      const row = {
        feature_id: feature.feature_id,
        feature_name: feature.name,
        parent_id: feature.parent_id || 0,
        isRootFeature,
        permissions: {},
      };

      // Create a map of permission_id -> key for quick lookup
      permissions.forEach((permission) => {
        // Use helper function to ensure consistent key format
        // Normalize permission_id to string for consistent lookup
        const permissionId = String(permission.permission_id);
        const key = createPermissionKey(feature.feature_id, permissionId);
        row.permissions[permissionId] = {
          permission_id: permissionId,
          permission_name: permission.name,
          key,
        };
      });

      return row;
    });
  }, [sortedFeatures, permissions]);

  const handlePermissionToggle = (key) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!selectedRoleId || !roleExists) {
      toast.error('Please select a valid role first');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get current permissions
      const currentPermissionSet = new Set();
      if (rolePermissions) {
        rolePermissions.forEach((perm) => {
          // Use helper function to ensure consistent key format
          const key = createPermissionKey(perm.feature_id, perm.permission_id);
          currentPermissionSet.add(key);
        });
      }

      // Find permissions to add
      const toAdd = [];
      selectedPermissions.forEach((key) => {
        if (!currentPermissionSet.has(key)) {
          const [featureId, permissionId] = key.split('_');
          toAdd.push({
            feature_id: parseInt(featureId),
            permission_id: String(permissionId), // Convert to string as backend expects
          });
        }
      });

      // Find permissions to remove
      const toRemove = [];
      currentPermissionSet.forEach((key) => {
        if (!selectedPermissions.has(key)) {
          const [featureId, permissionId] = key.split('_');
          toRemove.push({
            feature_id: parseInt(featureId),
            permission_id: String(permissionId), // Convert to string as backend expects
          });
        }
      });

      // Execute bulk operations
      const promises = [];
      if (toAdd.length > 0) {
        promises.push(
          dispatch(bulkAssignPermissions({ roleId: selectedRoleId, permissions: toAdd })),
        );
      }
      if (toRemove.length > 0) {
        promises.push(
          dispatch(bulkRemovePermissions({ roleId: selectedRoleId, permissions: toRemove })),
        );
      }

      await Promise.all(promises);
      toast.success('Permissions updated successfully');

      // Refresh permissions after a short delay to ensure DB is updated
      setTimeout(() => {
        dispatch(fetchPermissionsByRole(selectedRoleId));
      }, 100);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || error || 'Failed to update permissions';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Access Management
      </Typography>

      <FormProvider {...methods}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Select Role
          </Typography>
          <OrganizationDepartmentDesignationFilter
            organizationRequired={true}
            departmentRequired={true}
            designationRequired={true}
            direction="row"
            spacing={2}
          />
        </Box>

        {/* Show message when all dropdowns are selected but role doesn't exist */}
        {computedRoleId && !roleExists && (
          <Box
            sx={{
              p: 3,
              mb: 3,
              backgroundColor:
                theme.palette.mode === 'light'
                  ? 'rgba(150, 44, 84, 0.08)'
                  : 'rgba(150, 44, 84, 0.15)',
              borderRadius: 2,
              border: `1px solid ${
                theme.palette.mode === 'light' ? 'rgba(150, 44, 84, 0.2)' : 'rgba(150, 44, 84, 0.4)'
              }`,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 500,
                lineHeight: 1.6,
                m: 0,
              }}
            >
              Role does not exist for the selected Organization, Department, and Designation
              combination. Please create the role first or select a different combination.
            </Typography>
          </Box>
        )}

        {computedRoleId && roleExists && selectedRoleId && (
          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Permissions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSubmitting || loading}
                sx={{ textTransform: 'none' }}
              >
                {isSubmitting || loading ? <CircularProgress size={24} /> : 'Save Permissions'}
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Feature</TableCell>
                      {permissions.map((permission) => (
                        <TableCell
                          key={permission.permission_id}
                          align="center"
                          sx={{ fontWeight: 600 }}
                        >
                          {permission.name}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row) => {
                      const isRootFeature = row.isRootFeature;
                      return (
                        <TableRow
                          key={row.feature_id}
                          sx={{
                            backgroundColor: isRootFeature ? 'action.hover' : 'background.paper',
                            '&:hover': {
                              backgroundColor: isRootFeature ? 'action.selected' : 'action.hover',
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: isRootFeature ? 600 : 400,
                              color: isRootFeature ? 'primary.main' : 'text.primary',
                              pl: isRootFeature ? 2 : 6, // Indent child features
                            }}
                          >
                            {!isRootFeature && '└─ '}
                            {row.feature_name}
                          </TableCell>
                          {permissions.map((permission) => {
                            // Ensure we use the same permission_id format (string) for lookup
                            const permissionId = String(permission.permission_id);
                            const permData = row.permissions[permissionId];
                            if (!permData) return null;
                            const key = permData.key;
                            const isChecked = selectedPermissions.has(key);
                            return (
                              <TableCell key={permission.permission_id} align="center">
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() => handlePermissionToggle(key)}
                                  color="primary"
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </FormProvider>
    </Paper>
  );
};

export default AccessListPage;
