import * as z from "zod"

const LoginSchema = z.object({
  email: z
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(50, "Email must not exceed 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),
})


type LoginFormData = z.infer<typeof LoginSchema>
export { LoginSchema, type LoginFormData }

