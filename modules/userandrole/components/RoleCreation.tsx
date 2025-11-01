"use client";

import { Button } from "@/components/ui/button";
import PermissionSection from "./PermissionSection";
import * as z from "zod";
import { RoleSchema } from "@/lib/validation/userAndRole";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import {
  useGetGroupedPermissions,
  useGetRoles,
  useCreateRole,
  useGetRolesById,
} from "@/hooks/ReactQuery/useAuth";
import { GroupedPermissionsResponse } from "@/lib/types/auth";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function RoleCreation() {
  const form = useForm({
    defaultValues: {
      role: "",
      description: "",
      permissions: [] as string[],
    },
    resolver: zodResolver(RoleSchema),
    mode: "onSubmit",
  });
  const { mutate: createRole } = useCreateRole();
  const { id } = useParams();

  const {
    data: groupedPermissionsDataApi,
    isLoading: isLoadingGroupedPermissions,
    isError: isErrorGroupedPermissions,
  } = useGetGroupedPermissions();

  const {
    data: roleData,
    isLoading: isLoadingRoleData,
    isError: isErrorRoleData,
  } = useGetRolesById(id as string);

  // Populate form when role data is loaded
  useEffect(() => {
    console.log("Fetched Role Data:", roleData);
    if (roleData?.data) {
      const role = roleData.data;
      
      // Set role name and description
      form.setValue("role", role.name);
      if (role.description) {
        form.setValue("description", role.description);
      }
      
      // Set permissions - use the flattened permissions array from API
      if (role.permissions && role.permissions.length > 0) {
        const permissionIds = role.permissions.map((permission: { id: string }) => permission.id);
        form.setValue("permissions", permissionIds);
        console.log("Loaded permissions:", permissionIds);
      }
    }
  }, [roleData, form]);


  if (id && isLoadingRoleData) {
    return <div className="p-4 text-gray-500">Loading role data...</div>;
  }

  if (id && isErrorRoleData) {
    return <div className="p-4 text-red-500">Error loading role data.</div>;
  }
  console.log("Grouped Permissions Data:", roleData);

  // first i have to create normal role permissions to grouped permissions then edit role with grouped permissions

  const selectedPermissions = form.watch("permissions");
  const handlePermissionChange = (permissionKey: string, value: boolean) => {
    const currentPermissions = form.getValues("permissions");
    if (value) {
      if (!currentPermissions.includes(permissionKey)) {
        form.setValue("permissions", [...currentPermissions, permissionKey], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } else {
      form.setValue(
        "permissions",
        currentPermissions.filter((perm) => perm !== permissionKey),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  };

  const onSubmit = (data: z.infer<typeof RoleSchema>) => {
    if (!data.permissions || data.permissions.length === 0) {
      form.setError("permissions", {
        type: "manual",
        message: "At least one permission must be selected",
      });
      return;
    }
    createRole(
      {
        name: data.role,
        description: data.description,
        permissionIds: data.permissions,
      },
      {
        onSuccess: () => {
          form.reset();
          window.location.href = "/user-management?tab=roles";
        },
        onError: (error) => {
          console.error("Error creating/updating role:", error);
        },
      }
    );
  };

  const groupedPermissionsData = groupedPermissionsDataApi || [];
  const isEditMode = !!id;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Role Name Field */}
        <FormFieldWrapper
          label="Role Name"
          control={form.control}
          name="role"
          placeholder="e.g. Accountant, VP"
        />
        <FormFieldWrapper
          label="Role Description"
          control={form.control}
          name="description"
          placeholder="e.g. Responsible for managing accounts"
        />
        {/* Permissions Section */}
        <div className="space-y-3">
          <div>
            <h2 className="font-medium text-lg text-gray-900">Permissions</h2>
            <p className="text-gray-600 text-sm mt-1">
              Select the permissions for this role{" "}
              <span className="text-red-500">*</span>
            </p>
          </div>

          <div className="max-h-[500px] overflow-y-auto border border-gray-200 p-4 rounded-md bg-gray-50">
            {groupedPermissionsData?.map(
              (moduleGroup: GroupedPermissionsResponse) => (
                <PermissionSection
                  key={moduleGroup.module}
                  title={moduleGroup.module}
                  permissions={moduleGroup.permissions}
                  selectedPermissions={selectedPermissions}
                  onPermissionChange={handlePermissionChange}
                />
              )
            )}
          </div>
          {form.formState.errors.permissions && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.permissions.message}
            </p>
          )}
          {selectedPermissions.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm font-medium text-orange-900">
                {selectedPermissions.length} permission
                {selectedPermissions.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row-reverse gap-3 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            className="bg-[#1a1d29] hover:bg-[#1a1d29]/90 text-white"
          >
            {isEditMode ? "Update Role" : "Create Role"}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
      {isLoadingGroupedPermissions && (
        <div className="p-4 text-gray-500">Loading permissions...</div>
      )}
      {isErrorGroupedPermissions && (
        <div className="p-4 text-red-500">Error loading permissions.</div>
      )}
    </div>
  );
}
