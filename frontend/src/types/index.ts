import type { Contact } from '@/services/apiClient';
import z from 'zod';

export const CustomFieldSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    value: z.string().min(1, 'Value is required'),
});

export const ContactSchema = z.object({
    company: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format').nullable().optional().or(z.literal('')),
    job_title: z.string().nullable().optional(),
    custom_fields: z.array(CustomFieldSchema),
}).and(
    z.union([
        z.object({ name: z.string().min(1, 'Name cannot be empty'), email: z.string().email('Invalid email').nullable().optional().or(z.literal('')) }),
        z.object({ email: z.string().email('Invalid email'), name: z.string().nullable().optional().or(z.literal('')) })
    ])
).refine(
    (data) => (data.name && data.name.trim() !== '') || (data.email && data.email.trim() !== ''),
    { message: 'Contact must have either name or email', path: ['name'] }
);

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