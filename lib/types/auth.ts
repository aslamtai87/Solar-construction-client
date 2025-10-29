import { CompanyType } from "./user";

export interface Role {
  id: string;
  name: string;
  slug: string;
  parent: {
    slug: string;
  };
  permissions: string[];
  createdAt: string | null;
  createdBy: string | null;
  _count: {
    User: number;
  } | null;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  status: string | null;
  companyName: string | null;
  companyType: CompanyType;
  role: Role;
  updatedAt: string;
  createdAt: string;
}


export interface LoginFormData {
  email: string;
  password: string;
}