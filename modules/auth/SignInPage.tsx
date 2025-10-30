"use client";
import { useEffect } from "react";
import AuthHeader from "./components/AuthHeader";
import LoginForm from "./components/LoginForm";
import { useGetUserProfile } from "@/hooks/ReactQuery/useAuth";
import LoadingState from "@/components/global/LoadingState";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const { data: userProfile, isLoading } = useGetUserProfile();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && userProfile) {
      router.push("/dashboard");
    }
  }, [isLoading, userProfile, router]);

  if (isLoading) {
    return <LoadingState />;
  }

  // prevent rendering while client redirect is happening
  if (userProfile) {
    return null;
  }
  return (
    <div>
      <AuthHeader />
      <div
        className="flex items-center justify-center bg-gray-50 px-4"
        style={{ minHeight: "calc(100vh - var(--auth-header-height, 100px))" }}
      >
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
