import { integer, sqliteTable, text, check } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";
import { sql } from "drizzle-orm";
import { custom, z } from "zod";

const timestamps = {
    createdAt: integer("created_at")
        .$defaultFn(() => Date.now()),
    updatedAt: integer("updated_at")
        .$defaultFn(() => Date.now())
        .$onUpdate(() => Date.now())
}

export const contactsTable = sqliteTable('contacts_table', {
    id: text("id", { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
    name: text("name"),
    email: text("email"),
    company: text("company"),
    location: text("location"),
    phone: text("phone"),
    job_title: text("job_title"),
    ...timestamps
}, (table) => ({
    nameOrEmailRequired: check("name_or_email_required",
        sql`${table.name} IS NOT NULL OR ${table.email} IS NOT NULL`
    )
}));

export const contactSelectSchema = createSelectSchema(contactsTable)
export const createContactSchema = createInsertSchema(contactsTable, {
    email: (schema) => schema.email(),
    phone: (schema) => schema.regex(/^\+?[0-9\s-]+$/, "Invalid phone number format"),
})
    .pick({ name: true, email: true, company: true, location: true, phone: true, job_title: true })

export const customFieldsTable = sqliteTable('custom_fields_table', {
    id: text("id", { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
    label: text("label").notNull(),
    value: text("value").notNull(),
    contact_id: text("contact_id", { length: 36 }).notNull().references(() => contactsTable.id, { onDelete: 'cascade' }),
    ...timestamps
})

export const customFieldsSelectSchema = createSelectSchema(customFieldsTable)
export const createCustomFieldSchema = createInsertSchema(customFieldsTable, {
    label: (schema) => schema.min(1, "Label is required"),
    value: (schema) => schema.min(1, "Value is required")
})
    .pick({ label: true, value: true })

export const createContactWithCustomFieldsSchema = createContactSchema.merge(z.object({
    custom_fields: z.array(createCustomFieldSchema).optional()
}))

export const updateContactWithCustomFieldsSchema = createContactWithCustomFieldsSchema.partial()

export const selectContactWithCustomFieldsSchema = contactSelectSchema.merge(z.object({
    custom_fields: z.array(customFieldsSelectSchema)
}))

export type Contact = typeof contactsTable.$inferSelect;
export type CustomField = typeof customFieldsTable.$inferSelect;
export type CreateContact = typeof contactsTable.$inferInsert;
export type CreateContactWithCustomFields = z.infer<typeof createContactWithCustomFieldsSchema>;
export type SelectContactWithCustomFields = z.infer<typeof selectContactWithCustomFieldsSchema>;
export type UpdateContactWithCustomFields = z.infer<typeof updateContactWithCustomFieldsSchema>;