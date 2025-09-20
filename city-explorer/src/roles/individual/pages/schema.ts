import { z } from "zod";

export const messageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type MessageSchema = z.infer<typeof messageSchema>;
export type EditProfileSchema = z.infer<typeof editProfileSchema>;
