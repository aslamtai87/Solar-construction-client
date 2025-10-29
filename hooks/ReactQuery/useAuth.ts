import { useQuery, useMutation } from "@tanstack/react-query";
import {
  loginUser,
  resendOtp,
  signupUser,
  verifyOtpToken,
} from "@/lib/api/auth";
import { QUERY_KEYS } from "@/lib/api/endPoints";
import { LoginFormData } from "@/lib/types/auth";
import { SignupFormData } from "@/lib/types/auth";
import { toast } from "sonner";
import { APISuccessResponse, ApiError } from "@/lib/types/api";

export const useLogin = () => {
  return useMutation<APISuccessResponse, ApiError, LoginFormData>({
    mutationFn: ({ email, password }: LoginFormData) =>
      loginUser(email, password),
    onSuccess: (data) => {
      toast.success(data.message || "Login successful");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message[0] || "Login failed";
      toast.error(errorMessage);
    },
  });
};

export const useSignup = () => {
  return useMutation<APISuccessResponse, ApiError, SignupFormData>({
    mutationFn: (data: SignupFormData) => signupUser(data),
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message[0] || "Signup failed";
      toast.error(errorMessage);
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation<APISuccessResponse, ApiError, string>({
    mutationFn: (otpToken: string) => verifyOtpToken(otpToken),
    onSuccess: (data) => {
      toast.success(data.message || "OTP verified successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data.message[0] || "OTP verification failed";
      toast.error(errorMessage);
    },
  });
};

export const useResendOtp = () => {
  return useMutation<APISuccessResponse, ApiError, string>({
    mutationFn: (email: string) => resendOtp(email),
    onSuccess: (data) => {
      toast.success(data.message || "OTP resent successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data.message[0] || "Resend OTP failed";
      toast.error(errorMessage);
    },
  });
};
