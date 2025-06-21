import { z } from "zod";

export const aiOutputSchema = z.object({
    name: z.union([z.string().min(1), z.null()]),
    email: z.union([z.string().email(), z.null()]),
    company: z.union([z.string().min(1), z.null()]),
    location: z.union([z.string().min(1), z.null()]),
    phone: z.union([z.string().min(1), z.null()]),
    job_title: z.union([z.string().min(1), z.null()]),
    custom_fields: z.array(z.object({
        label: z.string().min(1),
        value: z.string().min(1)
    }))
}).refine(
    (data) => data.name || data.email,
    {
        message: "At least one of name, or email must be provided"
    }
);

export const contactsResponseSchema = z.object({
    contacts: z.array(aiOutputSchema)
})