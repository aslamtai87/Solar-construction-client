import ResetPasswordPage from "@/modules/auth/ResetPasswordPage"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  )
}

export default page