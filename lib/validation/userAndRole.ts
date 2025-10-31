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
  permissions: z.array(z.string()),
});

type Role = z.infer<typeof RoleSchema>;

export { RoleSchema, type Role };