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
  const { data: userProfile, isLoading, error, isError } = useGetUserProfile();
  const { setUserProfile, clearUserProfile } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (isError && error) {
      clearUserProfile();
    }
  }, [isError, error, clearUserProfile]);
  useEffect(() => {
    if (!isLoading) {
      if (userProfile) {
        setUserProfile(userProfile);
      } else {
        clearUserProfile();
      }
    }
  }, [userProfile, isLoading, setUserProfile, clearUserProfile]);
  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !userProfile) {
        router.replace("/signin");
      }
      if (!requireAuth && userProfile) {
        window.location.href = "/dashboard";
      }
    }
  }, [userProfile, isLoading, requireAuth, router]);
  if (isLoading) {
    return <LoadingState />;
  }

  // If auth is required but user is not authenticated, don't render
  if (requireAuth && !userProfile) {
    return null;
  }

  // If auth is not required but user is authenticated, don't render (redirect happening)
  if (!requireAuth && userProfile) {
    return null;
  }

  return <>{children}</>;
}
