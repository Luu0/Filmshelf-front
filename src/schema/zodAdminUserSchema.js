import { z } from "zod";

export const adminUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["User", "Admin"], {
    errorMap: () => ({ message: "Role must be either User or Admin" }),
  }),
});
