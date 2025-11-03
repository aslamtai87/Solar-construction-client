import VerifyEmailPage from "@/modules/auth/VerifyEmailPage"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  )
}

export default page