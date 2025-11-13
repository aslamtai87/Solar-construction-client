import api from "./api";
import { API_ENDPOINTS } from "./endPoints";
import { APISuccessResponse } from "../types/api";
import { SignupFormData, UserProfile, GroupedPermissionsResponse, CreateRole, Roles, RoleByIdResponse } from "../types/auth";
import { PaginationResponse } from "../types/pagination";

export const loginUser = async (
  email: string,
  password: string
): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<{data:UserProfile}> => {
  try {
    const response = await api.get<{data:UserProfile}>(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  } catch (error) {
    console.error("Get User Profile Error:", error);
    throw error;
  }
};

export const signupUser = async (
  data: SignupFormData
): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.SIGNUP, data);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

export const verifyOtpToken = async (
  otpToken: string
): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.VERIFY_OTP, {
      type: "SIGN_UP",
      token: otpToken,
    });
    return response.data;
  } catch (error) {
    console.error("Verify OTP Error:", error);
    throw error;
  }
};

export const resendOtp = async (
  email: string
): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.RESEND_OTP, { email });
    return response.data;
  } catch (error) {
    console.error("Resend OTP Error:", error);
    throw error;
  }
}

export const logoutUser = async (): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

export const forgotPassword = async (
  email: string
): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    throw error;
  }
}
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    throw error;
  }
}


export const getGroupedPermissions = async (): Promise<GroupedPermissionsResponse[]> => {
  try {
    const response = await api.get<{ data: GroupedPermissionsResponse[] }>(API_ENDPOINTS.GROUPED_PERMISSIONS);
    return response.data.data;
  } catch (error) {
    console.error("Get Grouped Permissions Error:", error);
    throw error;
  }
};

export const createRole = async (data: CreateRole): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.CREATE_ROLE, data);
    return response.data;
  } catch (error) {
    console.error("Create Role Error:", error);
    throw error;
  }
};

export const updateRole = async (id: string, data: CreateRole): Promise<APISuccessResponse> => {
  try {
    const response = await api.patch(`${API_ENDPOINTS.UPDATE_ROLE}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Role Error:", error);
    throw error;
  }
};

export const getRoles = async (cursor?: string | null, limit: number = 10): Promise<PaginationResponse<Roles>> => {
  try {
    const params = new URLSearchParams();
    if (cursor) {
      params.append('cursor', cursor);
    }
    params.append('limit', limit.toString());
    
    const response = await api.get<PaginationResponse<Roles>>(`/roles?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Get Roles Error:", error);
    throw error;
  }
}

export const getRolesById = async (id: string): Promise<RoleByIdResponse> => {
  try {
    const response = await api.get<RoleByIdResponse>(`/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Role By ID Error:", error);
    throw error;
  }
}

export const deleteRole = async (id: string): Promise<APISuccessResponse> => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.CREATE_ROLE}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Role Error:", error);
    throw error;
  }
}