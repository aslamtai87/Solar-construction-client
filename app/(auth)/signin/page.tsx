"use client"

import SignInPage from '../../../modules/auth/SignInPage'
import { useGetUserProfile } from '@/hooks/ReactQuery/useAuth'
import LoadingState from '@/components/global/LoadingState'

const page = () => {
  const {data: userProfile, isLoading} = useGetUserProfile();
  if (isLoading) {
    return <LoadingState />;
  }
  if (userProfile) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  }
  return (
    <SignInPage />
  )
}

export default page