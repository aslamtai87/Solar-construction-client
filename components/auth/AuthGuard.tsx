"use client";

import { useGetUserProfile } from "@/hooks/ReactQuery/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingState from "@/components/global/LoadingState";
import { useUserStore } from "@/store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * AuthGuard component to protect routes and manage authentication state
 * @param children - Child components to render
 * @param requireAuth - Whether authentication is required (default: true)
 */
export default function AuthGuard({ 
  children, 
  requireAuth = true 
}: AuthGuardProps) {
  // Only fetch user profile when auth is required
  const { data: userProfile, isLoading, error, isError } = useGetUserProfile(requireAuth);
  const { userProfile: storeUserProfile, setUserProfile, clearUserProfile } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (isError && error) {
      clearUserProfile();
    }
  }, [isError, error, clearUserProfile]);
  
  useEffect(() => {
    if (!isLoading && requireAuth) {
      if (userProfile) {
        setUserProfile(userProfile);
      } else {
        clearUserProfile();
      }
    }
  }, [userProfile, isLoading, setUserProfile, clearUserProfile, requireAuth]);
  
  useEffect(() => {
    if (requireAuth) {
      // For protected routes, redirect if no user after loading
      if (!isLoading && !userProfile) {
        router.replace("/signin");
      }
    } else {
      // For auth pages (signin, signup, etc.), redirect if user exists in store
      // Don't fetch from API to avoid the infinite loop issue
      if (storeUserProfile) {
        window.location.href = "/dashboard";
      }
    }
  }, [userProfile, storeUserProfile, isLoading, requireAuth, router]);
  
  // Show loading only when auth is required and we're fetching
  if (requireAuth && isLoading) {
    return <LoadingState />;
  }

  // If auth is required but user is not authenticated, don't render
  if (requireAuth && !userProfile) {
    return null;
  }

  // If auth is not required but user is authenticated (in store), don't render (redirect happening)
  if (!requireAuth && storeUserProfile) {
    return null;
  }

  return <>{children}</>;
}
