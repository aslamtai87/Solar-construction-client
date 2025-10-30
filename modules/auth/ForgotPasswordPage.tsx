import AuthHeader from "./components/AuthHeader";
import ForgetPasswordForm from "./components/ForgetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div>
      <AuthHeader />
      <div
        className="flex items-center justify-center bg-gray-50 px-4"
        style={{ minHeight: "calc(100vh - var(--auth-header-height, 100px))" }}
      >
        <ForgetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
