"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloatingLabelInputWrapper } from "@/components/global/Form/FloatingLabelInputWrapper";
import { SignupSchema, type SignupFormData } from "../validation/signup";
import { FloatingLabelSelectWrapper } from "@/components/global/Form/FloatingLabelSelectWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignupForm = () => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignupFormData) => {
    // Handle signup logic here
  };

  return (
    <div className="min-h-[89vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full grid md:grid-cols-2 gap-6 ">
              <FloatingLabelInputWrapper
                name="fullName"
                control={form.control}
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
              />
              <FloatingLabelInputWrapper
                name="email"
                control={form.control}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
              <FloatingLabelInputWrapper
                name="companyName"
                control={form.control}
                label="Company Name"
                type="text"
                placeholder="Enter your company name"
              />

              <FloatingLabelSelectWrapper
                name="companyType"
                control={form.control}
                label="Company Type"
                placeholder="Select your company type"
                options={[
                  { value: "DEVELOPER", label: "Developer" },
                  { value: "CONTRACTOR", label: "Contractor" },
                  { value: "EPC", label: "EPC" },
                ]}
              />
              <FloatingLabelInputWrapper
                name="password"
                control={form.control}
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <FloatingLabelInputWrapper
                name="confirmPassword"
                control={form.control}
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-12 md:h-14 text-base font-medium rounded-xl cursor-pointer bg-black hover:bg-gray-800"
              type="submit"
              // disabled={loginMutation.isPending}
            >
              {/* {loginMutation.isPending ? "Logging in..." : "Login"} */}
              SignUp
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {/* already have an account? */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupForm;
