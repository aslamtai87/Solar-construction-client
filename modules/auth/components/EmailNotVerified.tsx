'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {  Mail } from 'lucide-react';
import { useResendOtp } from '@/hooks/ReactQuery/useAuth';

export default function EmailNotVerified({ email }: { email: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const resendOtpMutation = useResendOtp();


  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await resendOtpMutation.mutateAsync(email);
      sessionStorage.setItem("signupEmail", email);
      setSuccess(true);
      setLoading(false);
      router.push('/verify-email');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We need to verify your email address to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Info Text */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-900">
              We'll send a one-time password (OTP) to your email address. Check your inbox and spam folder.
            </p>
          </div>

          {/* Send OTP Button */}
          <Button
            onClick={handleSendOTP}
            disabled={loading || success}
            className="w-full"
            size="lg"
          >
            {loading ? 'Sending...' : success ? 'OTP Sent!' : 'Send OTP'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}