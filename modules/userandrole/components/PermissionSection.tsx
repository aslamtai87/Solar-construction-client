"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Permission } from "@/lib/types/auth";

// Permission labels for display
const permissionLabels: Record<string, string> = {
  BROWSE: "Browse",
  ADD: "Create",
  UPDATE: "Edit",
  DELETE: "Delete",
  READ: "View",
};

interface PermissionSectionProps {
  title: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionChange: (permissionKey: string, value: boolean) => void;
}

const PermissionSection = ({
  title,
  permissions,
  selectedPermissions,
  onPermissionChange,
}: PermissionSectionProps) => {
  const isAllSelected = permissions.every((permission) =>
    selectedPermissions.includes(permission.id)
  );

  const handleSelectAll = (checked: boolean) => {
    permissions.forEach((permission) => {
      if (checked && !selectedPermissions.includes(permission.id)) {
        onPermissionChange(permission.id, true);
      } else if (!checked && selectedPermissions.includes(permission.id)) {
        onPermissionChange(permission.id, false);
      }
    });
  };

  return (
    <Card className="border-gray-200 overflow-hidden mb-4 p-0">
      <CardHeader className="bg-gray-50 border-b border-gray-200 p-4 m-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base text-gray-900">{title}</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600">
              Manage {title.toLowerCase()} permissions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`select-all-${title}`}
              checked={isAllSelected}
              onCheckedChange={(checked) => {
                handleSelectAll(!!checked);
              }}
            />
            <Label
              htmlFor={`select-all-${title}`}
              className="text-sm font-medium cursor-pointer"
            >
              Select All
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4 bg-white">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(permissions).map(([permissionKey, permissionValue]) => (
            <div
              key={permissionKey}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <Checkbox
                id={`${title}-${permissionKey}`}
                checked={selectedPermissions.includes(permissionValue.id)}
                onCheckedChange={(checked) =>
                  onPermissionChange(permissionValue.id, checked as boolean)
                }
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={`${title}-${permissionKey}`}
                  className="cursor-pointer text-sm font-medium text-gray-700 leading-tight block"
                >
                  {permissionLabels[permissionValue.name.split(".")[1]] || permissionValue.name}
                </Label>
                <p className="text-xs text-gray-500 mt-1 leading-tight">
                  {permissionValue.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionSection;