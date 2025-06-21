import { contactSelectSchema, customFieldsSelectSchema } from "@/db/schema";
import { OK } from "@/helpers/http-status-codes";
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
    }
})

export type GetContactsRoute = typeof getContactsRoute;