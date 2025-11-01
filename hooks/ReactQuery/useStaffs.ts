import { useQuery, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/endPoints";
import { getStaffUsers, createStaffUser, deleteStaffUser, getStaffUserById, updateStaffUser } from "@/lib/api/user";
import { CreateStaff, StaffUser, UpdateStaff, StaffUserByIdResponse } from "@/lib/types/user";
import { APISuccessResponse, ApiError } from "@/lib/types/api";
import { toast } from "sonner";
import { PaginationResponse } from "@/lib/types/pagination";

export const useGetStaffs = (cursor?: string | null, limit: number = 10) => {
  return useQuery<PaginationResponse<StaffUser>, ApiError>({
    queryKey: [QUERY_KEYS.STAFF_USERS, cursor, limit],
    queryFn: () => getStaffUsers(cursor, limit),
  });
};

export const useGetStaffById = (id: string) => {
  return useQuery<StaffUserByIdResponse, ApiError>({
    queryKey: [QUERY_KEYS.STAFF_USERS, id],
    queryFn: () => getStaffUserById(id),
    enabled: !!id,
  });
};

export const useCreateStaff = () => {
  return useMutation<APISuccessResponse, ApiError, CreateStaff>({
    mutationFn: (data: CreateStaff) => createStaffUser(data),
    onSuccess: (data) => {
      toast.success(data.message || "Staff user created successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message || "Failed to create staff user";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateStaff = (id: string) => {
  return useMutation<APISuccessResponse, ApiError, UpdateStaff>({
    mutationFn: (data: UpdateStaff) => updateStaffUser(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Staff user updated successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message || "Failed to update staff user";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteStaff = () => {
  return useMutation<APISuccessResponse, ApiError, string>({
    mutationFn: (id: string) => deleteStaffUser(id),
    onSuccess: (data) => {
      toast.success(data.message || "Staff user deleted successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data.message || "Failed to delete staff user";
      toast.error(errorMessage);
    },
  });
};