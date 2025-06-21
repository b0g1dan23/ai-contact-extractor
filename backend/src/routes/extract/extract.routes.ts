import { OK, UNPROCESSABLE_ENTITY } from "@/helpers/http-status-codes";
import jsonContent from "@/helpers/json-content";
import { createRoute } from "@hono/zod-openapi";
import { z } from 'zod';
import { contactSelectSchema, customFieldsSelectSchema } from "@/db/schema";

export const extractFromTextRoute = createRoute({
    path: "/extract/text",
    method: "post",
    summary: "Extract contact informations from text",
    description: "Extract contact informations from text",
    tags: ["AI Extraction"],
    request: {
        body: jsonContent(z.object({
            text: z.string().min(1, "Text is required").max(10000, "Text is too long")
        }), "Text to extract contact informations from")
    }, responses: {
        [OK]: jsonContent(z.array(contactSelectSchema.merge(z.object({
            custom_fields: z.array(customFieldsSelectSchema).optional()
        }))), "Contact informations extracted from text"),
        [UNPROCESSABLE_ENTITY]: jsonContent(z.object({
            error: z.string().default("Invalid input or extraction failed")
        }), "Invalid input or extraction failed")
    }
})

export type ExtractFromTextRoute = typeof extractFromTextRoute;