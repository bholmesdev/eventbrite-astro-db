import { createForm } from "simple:form";
import { z } from "zod";

export const ticketForm = createForm({
  email: z.string().email(),
  quantity: z.number().min(1).max(10),
  newsletter: z.boolean(),
});
