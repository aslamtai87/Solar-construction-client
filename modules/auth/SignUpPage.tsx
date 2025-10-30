'use client';

import AuthHeader from "./components/AuthHeader";
import SignupForm from "./components/SignupForm";
import { useGetUserProfile } from "@/hooks/ReactQuery/useAuth";
import LoadingState from "@/components/global/LoadingState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignUpPage = () => {
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
      <div className="bg-gray-50">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
