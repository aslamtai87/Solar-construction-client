import * as z from "zod";
import { CompanyType } from "@/lib/types/user";

const SignupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .max(100, "Full name must not exceed 100 characters"),
    companyType: z.enum(
      [CompanyType.DEVELOPER, CompanyType.CONTRACTOR, CompanyType.EPC],
      {
        message: "Please select a company type",
      }
    ),
    companyName: z
      .string()
      .min(1, "Company name is required")
      .max(100, "Company name must not exceed 100 characters"),
    email: z
      .email("Invalid email address")
      .min(1, "Email is required")
      .max(50, "Email must not exceed 50 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must not exceed 50 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof SignupSchema>;
export { SignupSchema, type SignupFormData };


