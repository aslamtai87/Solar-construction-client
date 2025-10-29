"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useVerifyOtp,useResendOtp } from "@/hooks/ReactQuery/useAuth"

export default function VerifyOTPForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const verifyOtpMutation = useVerifyOtp()
  const resendOtpMutation = useResendOtp()

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signupEmail")
    const paramEmail = searchParams.get("email")
    setEmail(storedEmail || paramEmail || "")
  }, [searchParams])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      setLoading(false)
      return
    }

    try {
      verifyOtpMutation.mutateAsync(otp);
      setSuccess(true)
      sessionStorage.removeItem("signupEmail")
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setLoading(true)

    try {
      await resendOtpMutation.mutateAsync(email);
      setResendTimer(60)
      setOtp("")
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Email Verified!</h2>
          <p className="text-sm text-muted-foreground">Redirecting to Login...</p>
        </div>
      </div>
    )
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
        <p className="text-xs text-muted-foreground text-center">Enter the 6-digit code sent to your email</p>
      </div>

      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
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
  )
}
