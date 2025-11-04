'use client';

import AuthHeader from "./components/AuthHeader";
import SignupForm from "./components/SignupForm";
import AuthGuard from "@/components/auth/AuthGuard";

const SignUpPage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <div>
        <AuthHeader />
        <div className="bg-gray-50">
          <SignupForm />
        </div>
      </div>
    </AuthGuard>
  );
};

export default SignUpPage;
