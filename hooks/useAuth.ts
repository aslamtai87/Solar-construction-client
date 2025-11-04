import { useGetUserProfile } from "@/hooks/ReactQuery/useAuth";
import { useUserStore } from "@/store/authStore";

/**
 * Custom hook to check authentication status and get user info
 * 
 * @returns {Object} Authentication state
 * @property {boolean} isAuthenticated - Whether user is logged in
 * @property {boolean} isLoading - Whether auth check is in progress
 * @property {UserProfile | null} user - Current user profile
 * @property {boolean} isError - Whether there was an error fetching user
 */
export const useAuth = () => {
  const { data: userProfile, isLoading, isError } = useGetUserProfile();
  const { userProfile: storeUserProfile } = useUserStore();

  return {
    isAuthenticated: !!userProfile || !!storeUserProfile,
    isLoading,
    user: userProfile || storeUserProfile,
    isError,
  };
};
