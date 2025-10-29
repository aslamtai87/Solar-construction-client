import React from "react";
import AuthHeader from "./components/AuthHeader";
import LoginForm from "./components/LoginForm";

const SignInPage = () => {
  return (
    <div>
      <AuthHeader />
      <div
        className="flex items-center justify-center bg-gray-50 px-4"
        style={{ minHeight: 'calc(100vh - var(--auth-header-height, 100px))' }}
      >
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
