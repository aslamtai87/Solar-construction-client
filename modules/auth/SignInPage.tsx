"use client";
import AuthHeader from "./components/AuthHeader";
import LoginForm from "./components/LoginForm";
import AuthGuard from "@/components/auth/AuthGuard";

const SignInPage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <div>
        <AuthHeader />
        <div
          className="flex items-center justify-center bg-gray-50 px-4"
          style={{ minHeight: "calc(100vh - var(--auth-header-height, 100px))" }}
        >
          <LoginForm />
        </div>
      </div>
    </AuthGuard>
  );
};

export default SignInPage;
