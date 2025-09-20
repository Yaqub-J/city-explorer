import { z } from "zod";

export const reviewSchema = z.object({
  review: z.string().nonempty("Review is required"),
});

export const settingsSchema = z.object({
  business_name: z.string().min(1, "Email is required").optional(),
  username: z
    .string()
    .nonempty("Password is required")
    .min(4, "Minimum of 4 characters is required")
    .email("Invalid email. Email must be a valid email address")
    .optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  new_password: z.string().min(1, "Password is required").optional(),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
export type SettingsSchema = z.infer<typeof settingsSchema>;
