"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyOtp, useResendOtp } from "@/hooks/ReactQuery/useAuth";

export default function VerifyOTPForm({ emailValue }: { emailValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(true);
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const tokenParams = searchParams.get("token");

  useEffect(() => {
    setEmail(emailValue);
    setIsCheckingEmail(false);
    if (tokenParams && tokenParams.length === 6 && emailValue) {
      setOtp(tokenParams);
      submitOtp(tokenParams);
    }
  }, [searchParams, tokenParams]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const submitOtp = async (otpValue: string) => {
    setError("");
    setLoading(true);
    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }
    try {
      await verifyOtpMutation.mutateAsync(otpValue);
      setSuccess(true);
      sessionStorage.removeItem("signupEmail");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitOtp(otp);
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await resendOtpMutation.mutateAsync(email);
      setResendTimer(60);
      setOtp("");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      if (error.response?.data?.message === "User is already verified") {
        setSuccess(true);
        sessionStorage.removeItem("signupEmail");
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Move conditional renders AFTER all hooks
  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Email Verified!
          </h2>
          <p className="text-sm text-muted-foreground">
            Redirecting to Login...
          </p>
        </div>
      </div>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-sm text-blue-900 dark:text-blue-100">
        <p>We sent a verification code to:</p>
        <p className="font-semibold">{email}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          value={otp}
          onChange={handleOtpChange}
          disabled={loading}
          maxLength={6}
          className="text-center text-2xl tracking-widest font-mono"
          required
        />
        <p className="text-xs text-muted-foreground text-center">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || otp.length !== 6}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendTimer > 0 || loading}
            className="text-primary hover:underline disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </form>
  );
}
