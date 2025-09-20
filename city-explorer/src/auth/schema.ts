import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email. Email must be a valid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(4, "Minimum of 4 characters is required"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .nonempty("Email is required")
      .min(1, "Email is required")
      .email("Invalid email. Email must be a valid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Minimum of 6 characters is required"),
    confirm_password: z.string().nonempty("Confirm Password is required"),
    company_name: z.string().nonempty("Username is required"),
    address: z.string().nonempty("Username is required"),
    description: z.string().nonempty("Username is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
