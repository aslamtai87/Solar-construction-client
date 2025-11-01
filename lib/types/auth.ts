import { CompanyType } from "./user";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  status: string | null;
  companyName: string | null;
  companyType: CompanyType;
  updatedAt: string;
  createdAt: string;
}


export interface LoginFormData {
  email: string;
  password: string;
}


export interface SignupFormData {
  email: string;
  fullName: string;
  password: string;
  companyType: string;
  organizationName: string;
}

export interface GroupedPermissionsResponse {
  module: string;
  permissions: Permission[];
  count: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRole {
  name: string;
  description?: string;
  isActive?: boolean;
  permissionIds: string[];
}

export interface Roles {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  rolePermission: RolePermission[];
  _count: Count;
  permissions?: Permission[];
  userCount?: number;
}

export interface RoleByIdResponse {
  data: Roles;
}

interface Count {
  userRole: number;
}

interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: string;
  updatedAt: string;
  permission: Permission;
}

interface Creator {
  id: string;
  email: string;
  fullName: null;
  firstName: string;
  lastName: string;
}