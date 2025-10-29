import AuthHeader from "./components/AuthHeader";
import SignupForm from "./components/SignupForm";

const SignUpPage = () => {
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
