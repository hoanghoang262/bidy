import { z } from "zod";

export const ProfileFormSchema = z.object({
  name: z.string().min(2, "Tên không hợp lệ"),
  username: z.string(), // disabled, but still required
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^\d{10,11}$/, "Số điện thoại không hợp lệ"), // optional: adjust regex
});

export type ProfileForm = z.infer<typeof ProfileFormSchema>; 