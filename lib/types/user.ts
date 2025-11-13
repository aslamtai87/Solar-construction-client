export enum CompanyType {
    DEVELOPER = 'DEVELOPER',
    CONTRACTOR = 'CONTRACTOR',
    EPC = 'EPC',
}

export interface CreateStaff {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
}

export interface UpdateStaff {
  firstName?: string;
  lastName?: string;
  roleId?: string;
  status?: string;
  labourerId?: string;
}

export interface StaffUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: null;
  status: string;
  companyType: string;
  verifiedAt: null;
  firstLoginAt: null;
  passwordChangedAt: null;
  lastLoginAt: null;
  createdAt: string;
  userRoles: UserRole[];
  labourerProfile?: {
    id: string;
    name: string;
  } | null;
}

export interface StaffUserByIdResponse {
  data: StaffUser;
}

interface UserRole {
  role: Role;
}

interface Role {
  id: string;
  name: string;
}