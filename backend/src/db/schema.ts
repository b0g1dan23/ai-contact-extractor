import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";

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
})

export const contactSelectSchema = createSelectSchema(contactsTable)
export const insertContactSchema = createInsertSchema(contactsTable)

export const customFieldsTable = sqliteTable('custom_fields_table', {
    id: text("id", { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
    label: text("label").notNull(),
    value: text("value").notNull(),
    contact_id: text("contact_id", { length: 36 }).notNull().references(() => contactsTable.id, { onDelete: 'cascade' }),
    ...timestamps
})

export const customFieldsSelectSchema = createSelectSchema(customFieldsTable)

export type Contact = typeof contactsTable.$inferSelect;
export type CustomField = typeof customFieldsTable.$inferSelect;
export type ContactWithCustomFields = Contact & {
    custom_fields?: CustomField[];
};
export type InsertContact = typeof contactsTable.$inferInsert;