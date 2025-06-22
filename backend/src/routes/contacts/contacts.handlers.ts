import { AppRouteHandler } from "@/types";
import { CreateContactsRoute, GetContactsRoute, UpdateContactsRoute } from "./contacts.routes";
import { INTERNAL_SERVER_ERROR, OK } from "@/helpers/http-status-codes";
import db from "@/db";
import { contactsTable, CustomField, customFieldsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getContactsHandler: AppRouteHandler<GetContactsRoute> = async (c) => {
    try {
        const res = await db.select().from(contactsTable).leftJoin(customFieldsTable, eq(contactsTable.id, customFieldsTable.contact_id)).execute();

        const contactsMap = new Map<string, any>();

        res.forEach(row => {
            const contact = row.contacts_table;
            const customField = row.custom_fields_table;

            if (!contactsMap.has(contact.id)) {
                contactsMap.set(contact.id, {
                    ...contact,
                    custom_fields: []
                });
            }

            if (customField && customField.id) {
                contactsMap.get(contact.id)!.custom_fields.push(customField);
            }
        });

        const contactsWithCustomFields = Array.from(contactsMap.values());

        return c.json(contactsWithCustomFields, OK);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return c.json({ error: 'Failed to fetch contacts' }, INTERNAL_SERVER_ERROR);
    }
}

export const createContactsHandler: AppRouteHandler<CreateContactsRoute> = async (c) => {
    try {
        const { custom_fields, ...contactData } = c.req.valid('json');

        const [insertedData] = await db.insert(contactsTable).values(contactData).returning();
        const customFields: CustomField[] = [];

        if (custom_fields && custom_fields.length > 0) {
            const customFieldsData = custom_fields.map(field => ({
                label: field.label,
                value: field.value,
                contact_id: insertedData.id
            }));

            const insertedFields = await db.insert(customFieldsTable).values(customFieldsData).returning();
            customFields.push(...insertedFields);
        }

        return c.json({ ...insertedData, custom_fields: customFields }, OK);
    } catch (error) {
        console.error('Error creating contact:', error);

        return c.json({ error: 'Failed to create contact' }, INTERNAL_SERVER_ERROR);
    }
}

export const updateContactsHandler: AppRouteHandler<UpdateContactsRoute> = async (c) => {
    const { id } = c.req.valid('param');
    const contactData = c.req.valid('json');

    try {
        const result = await db.update(contactsTable).set(contactData).where(eq(contactsTable.id, id)).execute();

        if (result.rowsAffected === 0) {
            return c.json({ error: 'Contact not found or no changes made' }, INTERNAL_SERVER_ERROR);
        }

        return c.json(result.rows[0], OK);
    } catch (err) {
        console.error('Error updating contact:', err);
        return c.json({ error: 'Failed to update contact' }, INTERNAL_SERVER_ERROR);
    }
}

export const deleteContactsHandler: AppRouteHandler<UpdateContactsRoute> = async (c) => {
    const { id } = c.req.valid('param');

    try {
        const result = await db.delete(contactsTable).where(eq(contactsTable.id, id)).execute();

        if (result.rowsAffected === 0) {
            return c.json({ error: 'Contact not found' }, INTERNAL_SERVER_ERROR);
        }

        return c.json({ msg: 'Contact deleted successfully' }, OK);
    } catch (error) {
        console.error('Error deleting contact:', error);
        return c.json({ error: 'Failed to delete contact' }, INTERNAL_SERVER_ERROR);
    }
}