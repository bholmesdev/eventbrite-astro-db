import { Ticket, db } from "astro:db";
import { createForm, validateForm } from "simple:form";
import { z } from "zod";

const ticketForm = createForm({
  eventId: z.number(),
  email: z.string().email(),
  quantity: z.number().max(10),
  newsletter: z.boolean(),
});

async function buyTicket(formData: FormData) {
  const { data, fieldErrors } = await validateForm({ formData, ...ticketForm });
  if (!data) return { fieldErrors };

  const ticket = await db
    .insert(Ticket)
    .values({
      eventId: data.eventId,
      email: data.email,
      quantity: data.quantity,
      newsletter: data.newsletter,
    })
    .returning()
    .get();
  console.log("inserted!");
  return ticket;
}

export { buyTicket };
