import { contactSelectSchema, createContactWithCustomFieldsSchema, customFieldsSelectSchema, selectContactWithCustomFieldsSchema, updateContactWithCustomFieldsSchema } from "@/db/schema";
import createErrorSchema from "@/helpers/create-error-schema";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "@/helpers/http-status-codes";
import jsonContent from "@/helpers/json-content";
import { createRoute } from "@hono/zod-openapi";
import { z } from 'zod';


export const getContactsRoute = createRoute({
    path: "/contacts",
    method: "get",
    summary: "Get all contacts",
    description: "Retrieve all contacts from the database",
    tags: ["Contacts"],
    responses: {
        [OK]: jsonContent(z.array(contactSelectSchema.merge(z.object({
            custom_fields: z.array(customFieldsSelectSchema).optional()
        }))), "List of contacts retrieved successfully"),
        [INTERNAL_SERVER_ERROR]: jsonContent(z.object({ error: z.string().default('Internal server error') }), "Internal server error"),
    }
})

export const createContactsRoute = createRoute({
    path: "/contacts",
    method: "post",
    summary: "Create a new contact",
    description: "Create a new contact in the database",
    tags: ["Contacts"],
    request: {
        body: jsonContent(createContactWithCustomFieldsSchema.refine((data) => data.name || data.email, {
            message: "At least one of name or email must be provided"
        }), "Contact data to create")
    },
    responses: {
        [OK]: jsonContent(selectContactWithCustomFieldsSchema, "Contact created successfully"),
        [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(createContactWithCustomFieldsSchema as any), "Validation error or constraint violation"),
        [INTERNAL_SERVER_ERROR]: jsonContent(z.object({ error: z.string().default('Internal server error') }), "Internal server error"),
    }
})

export const updateContactsRoute = createRoute({
    path: '/contacts/:id',
    method: 'put',
    summary: 'Update an existing contact',
    description: 'Update an existing contact in the database',
    tags: ['Contacts'],
    request: {
        params: z.object({
            id: z.string().uuid().describe('The ID of the contact to update')
        }),
        body: jsonContent(updateContactWithCustomFieldsSchema, 'Contact data to update')
    },
    responses: {
        [OK]: jsonContent(z.object({ msg: z.string().default("Contact updated successfully!") }), "Contact updated successfully"),
        [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(updateContactWithCustomFieldsSchema), "Validation error or constraint violation"),
        [INTERNAL_SERVER_ERROR]: jsonContent(z.object({ error: z.string().default('Internal server error') }), "Internal server error"),
    }
})

export const deleteContactsRoute = createRoute({
    path: '/contacts/:id',
    method: 'delete',
    summary: 'Delete a contact',
    description: 'Delete a contact from the database',
    tags: ['Contacts'],
    request: {
        params: z.object({
            id: z.string().uuid().describe('The ID of the contact to delete')
        })
    },
    responses: {
        [OK]: jsonContent(z.object({ msg: z.string().default('Contact deleted successfully') }), "Contact deleted successfully"),
        [UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(z.object({
            id: z.string().uuid().describe('The ID of the contact to delete')
        })), "Invalid contact ID"),
        [INTERNAL_SERVER_ERROR]: jsonContent(z.object({ error: z.string().default('Internal server error') }), "Internal server error"),
    }
})

export type GetContactsRoute = typeof getContactsRoute;
export type CreateContactsRoute = typeof createContactsRoute;
export type UpdateContactsRoute = typeof updateContactsRoute;