import api from "./api";
import { API_ENDPOINTS } from "./endPoints";
import { APISuccessResponse } from "../types/api";
import { SignupFormData, UserProfile } from "../types/auth";

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

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>(API_ENDPOINTS.USER_PROFILE);
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