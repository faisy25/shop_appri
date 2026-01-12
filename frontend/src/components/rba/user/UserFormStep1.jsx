import React, { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData } from '../../../redux/rba/user/userSlice';
import { fetchRoles } from '../../../redux/rba/role/roleThunk';
import CustomSelect from '../../common/CustomSelect';
import OrganizationDepartmentDesignationFilter from '../../common/OrganizationDepartmentDesignationFilter';

const UserFormStep1 = () => {
  const dispatch = useDispatch();
  const { watch, control, formState } = useFormContext();
  const { errors } = formState;

  const { formData } = useSelector((state) => state.users);
  const { list: roles } = useSelector((state) => state.roles);

  const watchedValues = watch();

  // Sync form data to Redux
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

  return (
    <>
      <OrganizationDepartmentDesignationFilter
        organizationRequired={false}
        departmentRequired={false}
        designationRequired={false}
        direction="row"
        spacing={3}
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
    </>
  );
};

export default UserFormStep1;
