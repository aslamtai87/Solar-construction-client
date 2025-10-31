"use client";

import { Button } from "@/components/ui/button";
import PermissionSection from "./PermissionSection";
import PERMISSIONS from "@/lib/constants/Permissions";
import * as z from "zod";
import { RoleSchema } from "@/lib/validation/userAndRole";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";

export default function RoleCreation() {
  const form = useForm({
    defaultValues: {
      role: "",
      permissions: [] as string[],
    },
    resolver: zodResolver(RoleSchema),
    mode: "onSubmit",
  });


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
    if(!data.permissions || data.permissions.length === 0) {
      form.setError("permissions", {
        type: "manual",
        message: "At least one permission must be selected",
      });
      return;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Role Name Field */}
        <FormFieldWrapper label="Role Name" control={form.control} name="role" placeholder="e.g. Accountant, VP"/>

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
            {Object.entries(PERMISSIONS).map(([sectionTitle, permissions]) => (
              <PermissionSection
                key={sectionTitle}
                title={sectionTitle}
                permissions={permissions}
                selectedPermissions={selectedPermissions}
                onPermissionChange={handlePermissionChange}
              />
            ))}
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
            Create Role
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}