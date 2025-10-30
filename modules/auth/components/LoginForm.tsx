"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/ReactQuery/useAuth";
import { LoginSchema, type LoginFormData } from "../../../lib/validation/login";
import { FloatingLabelInputWrapper } from "@/components/global/Form/FloatingLabelInputWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import EmailNotVerified from "./EmailNotVerified";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const loginMutation = useLogin();
  const router = useRouter();
  const [showEmailNotVerified, setShowEmailNotVerified] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      setRememberMe(true);
    }
  }, [form]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      router.push("/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      if (error.response?.data?.message === "User is not active") {
        setShowEmailNotVerified(true);
      }
    }
  };

  if (showEmailNotVerified) {
    return <EmailNotVerified email={form.getValues("email")} />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Content */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="max-w-xl mx-auto">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 md:space-y-6"
              >
                <div className="space-y-4 md:space-y-6">
                  <FloatingLabelInputWrapper
                    name="email"
                    control={form.control}
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    disabled={loginMutation.isPending}
                    autoComplete="email"
                  />

                  <FloatingLabelInputWrapper
                    name="password"
                    control={form.control}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    disabled={loginMutation.isPending}
                    autoComplete="current-password"
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                      disabled={loginMutation.isPending}
                    />
                    <label
                      className="text-text text-sm md:text-base font-medium cursor-pointer"
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    className="text-sm md:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer text-left sm:text-right underline sm:no-underline sm:hover:underline"
                    disabled={loginMutation.isPending}
                    onClick={() => {
                      form.reset();
                      window.location.href = "/forgotPassword";
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full h-12 md:h-14 text-base font-medium rounded-xl cursor-pointer bg-black hover:bg-gray-800"
                  type="submit"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* already have an account? */}
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
