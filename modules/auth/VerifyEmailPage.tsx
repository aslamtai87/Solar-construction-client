"use client";

import AuthHeader from "./components/AuthHeader";
import VerifyOTPForm from "./components/VerifyOtp";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramEmail = searchParams.get("email");
  const email = paramEmail || sessionStorage.getItem("signupEmail") || "";

  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  return (
    <>
      <AuthHeader />
      <main
        className="bg-background flex items-center justify-center p-4"
        style={{ minHeight: "calc(100vh - var(--auth-header-height, 100px))" }}
      >
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Verify Email</h1>
            <p className="text-muted-foreground">
              Enter the OTP sent to your email
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <VerifyOTPForm emailValue={email} />
          </Suspense>
        </Card>
      </main>
    </>
  );
};

export default VerifyEmailPage;
