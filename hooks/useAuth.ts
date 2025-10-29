
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserProfile } from "@/lib/types/auth";
import { ApiError } from "@/lib/types/api";
import { loginUser, getUserProfile } from "@/lib/api/auth";
import { useUserStore } from "@/store/authStore";
import { LoginFormData } from "@/lib/types/auth";


export const useLogin = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { setUserProfile } = useUserStore();
    
    return useMutation<UserProfile, ApiError, LoginFormData>({
        mutationFn: async ({ email, password }) => {
            const loginResponse = await loginUser(email, password);
            console.log(' Login response:', loginResponse);
             if (loginResponse.message !== 'Login successful') {
                throw new Error(loginResponse.message);
            }
            const userProfile = await getUserProfile();
            if (!userProfile) {
                throw new Error('Failed to fetch user profile after login');
            }
            
            return userProfile;
        },
        
        onSuccess: (userProfile) => {
            queryClient.setQueryData<UserProfile>(['user', 'profile'], userProfile);
            setUserProfile(userProfile);
            router.push('/dashboard');
            toast.success('Login successful!');
        },
        
        onError: (error) => {
            toast.error(`Login Error: ${error.response?.data?.message || error.message}`);
        },
    });
};