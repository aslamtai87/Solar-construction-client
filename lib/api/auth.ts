import api from "./api";
import { API_ENDPOINTS } from "./endPoints";
import { APISuccessResponse } from "../types/api";
import { UserProfile } from "../types/auth";

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
}
