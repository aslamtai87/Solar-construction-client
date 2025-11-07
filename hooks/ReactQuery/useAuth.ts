import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/authStore";
import {
  loginUser,
  resendOtp,
  signupUser,
  verifyOtpToken,
  logoutUser,
  getGroupedPermissions,
  createRole,
  getRoles,
  getRolesById,
  updateRole,
  deleteRole,
} from "@/lib/api/auth";
import { QUERY_KEYS } from "@/lib/api/endPoints";
import {
  CreateRole,
  GroupedPermissionsResponse,
  LoginFormData,
  Roles,
  RoleByIdResponse,
} from "@/lib/types/auth";
import { SignupFormData } from "@/lib/types/auth";
import { toast } from "sonner";
import { APISuccessResponse, ApiError } from "@/lib/types/api";
import { getUserProfile } from "@/lib/api/auth";
import { PaginationResponse } from "@/lib/types/pagination";
import { useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation<APISuccessResponse, ApiError, LoginFormData>({
    mutationFn: ({ email, password }: LoginFormData) =>
      loginUser(email, password),
    onSuccess: (data) => {
      toast.success(data.message || "Login successful");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message || "Login failed";
      if (error.response?.data.error === "User is not active") {
        toast.error("Email not verified. Please verify your email.");
      } else {
        toast.error(errorMessage);
      }
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
      const errorMessage = error.response?.data.message || "Signup failed";
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
        error.response?.data.message || "OTP verification failed";
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
      const errorMessage = error.response?.data.message || "Resend OTP failed";
      toast.error(errorMessage);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { clearUserProfile } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation<APISuccessResponse, ApiError>({
    mutationFn: () => logoutUser(),
    onSuccess: (data) => {
      clearUserProfile();
      queryClient.clear();
      toast.success(data.message || "Logout successful");
      setTimeout(() => {
        router.replace("/signin");
      }, 500);
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message[0] || "Logout failed";
      toast.error(errorMessage);
      clearUserProfile();
      queryClient.clear();
      setTimeout(() => {
        router.replace("/signin");
      }, 500);
    },
  });
};

export const useGetUserProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: () => getUserProfile(),
    retry: false, 
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: enabled,
  });
};

export const useGetGroupedPermissions = () => {
  return useQuery<GroupedPermissionsResponse[]>({
    queryKey: [QUERY_KEYS.GROUPED_PERMISSIONS],
    queryFn: () => getGroupedPermissions(),
  });
};

export const useCreateRole = () => {
  return useMutation<APISuccessResponse, ApiError, CreateRole>({
    mutationFn: (data) => createRole(data),
    onSuccess: (data) => {
      toast.success(data.message || "Role created successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message || "Create role failed";
      toast.error(errorMessage);
    },
  });
};

export const useGetRoles = (cursor?: string | null, limit: number = 10) => {
  return useQuery<PaginationResponse<Roles>>({
    queryKey: [QUERY_KEYS.ROLE, cursor, limit],
    queryFn: () => getRoles(cursor, limit),
  });
};

export const useGetRolesById = (id: string) => {
  return useQuery<RoleByIdResponse>({
    queryKey: [QUERY_KEYS.ROLE, id],
    queryFn: () => getRolesById(id),
    enabled: !!id,
  });
};

export const useUpateRole = (id: string) => {
  return useMutation<APISuccessResponse, ApiError, CreateRole>({
    mutationFn: (data) => updateRole(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Role updated successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message || "Update role failed";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, string>({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: (data) => {
      toast.success(data.message || "Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLE] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message || "Delete role failed";
      toast.error(errorMessage);
    },
  });
};
