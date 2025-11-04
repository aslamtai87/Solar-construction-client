"use client";
import AuthHeader from "./components/AuthHeader";
import ForgetPasswordForm from "./components/ForgetPasswordForm";
import AuthGuard from "@/components/auth/AuthGuard";

const ResetPasswordPage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <div>
        <AuthHeader />
        <div
          className="flex items-center justify-center bg-gray-50 px-4"
          style={{ minHeight: "calc(100vh - var(--auth-header-height, 100px))" }}
        >
          <ForgetPasswordForm />
        </div>
      </div>
    </AuthGuard>
  );
};

export default ResetPasswordPage;
