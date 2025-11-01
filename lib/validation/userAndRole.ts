import * as z from "zod";

const CreateUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(50),
});

type CreateUser = z.infer<typeof CreateUserSchema>;

export { CreateUserSchema, type CreateUser };


const RoleSchema = z.object({
  role: z.string().min(2).max(50),
  description: z.string().min(2,'Must be at least 2 characters').max(200,'Must be 200 characters or less').optional(),
  permissions: z.array(z.string()),
});

type Role = z.infer<typeof RoleSchema>;

export { RoleSchema, type Role };