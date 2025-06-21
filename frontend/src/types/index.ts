import z from 'zod';

export const CustomFieldSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    value: z.string().min(1, 'Value is required'),
});

/**
 * Zod schema for contact validation with discriminated union
 * Ensures contact has either name or email (or both)
 */
export const ContactSchema = z.object({
    company: z.string().optional(),
    location: z.string().optional(),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format').optional().or(z.literal('')),
    job_title: z.string().optional(),
    custom_fields: z.array(CustomFieldSchema),
}).and(
    z.union([
        z.object({ name: z.string().min(1, 'Name cannot be empty'), email: z.string().email('Invalid email').optional().or(z.literal('')) }),
        z.object({ email: z.string().email('Invalid email'), name: z.string().optional().or(z.literal('')) })
    ])
).refine(
    (data) => (data.name && data.name.trim() !== '') || (data.email && data.email.trim() !== ''),
    { message: 'Contact must have either name or email', path: ['name'] }
);

export const ContactWithIdSchema = ContactSchema.and(z.object({
    id: z.string().min(1, 'ID is required'),
}));

export interface ContactExtractionState {
    isLoading: boolean;
    contacts: Contact[];
    error: string | null;
}

export enum ContactFilter {
    HAS_EMAIL = 'hasEmail',
    HAS_LOCATION = 'hasLocation'
}

export interface ContactOperationResult {
    success: boolean;
    data?: Contact | Contact[];
    error?: string;
}

export type CustomField = z.infer<typeof CustomFieldSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type ContactWithId = z.infer<typeof ContactWithIdSchema>;