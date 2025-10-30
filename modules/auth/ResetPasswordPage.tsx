"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import AuthHeader from "./components/AuthHeader";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/api/auth";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

// ResetPasswordPage.tsx to enter password and confirm password after clicking link in reset email
const ResetPasswordPage = () => {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(3);
  const ResetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z
        .string()
        .min(8, "Confirm Password must be at least 8 characters long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
    });
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isSubmitted) return;

    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          window.location.href = "/signin";
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [isSubmitted, router]);

  useEffect(() => {
    if (!token) {
      window.location.href = "/forgot-password";
    }
  }, [token]);

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
      if (!token) {
        toast.error("Invalid or missing token.");
        return;
      }
      await resetPassword(token, data.password);
      setIsSubmitted(true);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  if (isSubmitted) {
    return (
      <>
        <AuthHeader />
        <div
          className="flex items-center justify-center bg-gray-50 px-4"
          style={{
            minHeight: "calc(100vh - var(--auth-header-height, 100px))",
          }}
        >
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle>Password Reset Successful</CardTitle>
              <CardDescription>
                Your password has been reset successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-orange-50 border-orange-200 flex gap-4 items-center">
                <AlertDescription className="text-orange-800 flex gap-2 items-center">
                  You can now log in with your new password. Redirecting to sign
                  in {secondsLeft}s… <ClipLoader size={16} color="#FFA500" />
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div>
      <AuthHeader />
      <div
        className="flex items-center justify-center bg-gray-50 px-4"
        style={{ minHeight: "calc(100vh - var(--auth-header-height, 100px))" }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormFieldWrapper
                label="New Password"
                name="password"
                control={form.control}
                type="password"
                placeholder="Enter your new password"
              />
              <FormFieldWrapper
                label="Confirm New Password"
                name="confirmPassword"
                control={form.control}
                type="password"
                placeholder="Confirm your new password"
              />
              <Button type="submit" className="w-full mt-2 cursor-pointer">
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
