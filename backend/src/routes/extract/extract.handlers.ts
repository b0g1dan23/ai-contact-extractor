import { AppRouteHandler } from "@/types";
import { ExtractFromTextRoute } from "./extract.routes";
import { OK, UNPROCESSABLE_ENTITY } from "@/helpers/http-status-codes";
import openAIClient, { systemPrompt } from "@/ai/aiConfig";
import { zodResponseFormat } from 'openai/helpers/zod';
import { contactsResponseSchema } from "./extract.types";
import db from '@/db'
import { contactsTable, ContactWithCustomFields, customFieldsTable } from "@/db/schema";

export const extractFromTextHandler: AppRouteHandler<ExtractFromTextRoute> = async (c) => {
    const { text } = c.req.valid('json');

    if (!text) {
        throw new Error('Text is required');
    }

    try {
        const completion = await openAIClient.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            response_format: zodResponseFormat(contactsResponseSchema, "contact_extraction_response"),
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
            throw new Error('No response from OpenAI');
        }

        const parsed = JSON.parse(responseContent);
        const validationResult = contactsResponseSchema.safeParse(parsed);

        if (!validationResult.success) {
            console.error('Validation error:', validationResult.error);
            throw new Error('Invalid response format from AI');
        }

        const { contacts } = validationResult.data;
        const insertedContacts: ContactWithCustomFields[] = [];
        if (contacts.length > 0) {
            for (const contact of contacts) {
                const { custom_fields, ...contactData } = contact;

                const [insertedContact] = await db.insert(contactsTable).values(contactData).returning();

                if (custom_fields && custom_fields.length > 0 && insertedContact) {
                    const customFieldsData = custom_fields.map(field => ({
                        label: field.label,
                        value: field.value,
                        contact_id: insertedContact.id
                    }));

                    const insertedCustomFields = await db.insert(customFieldsTable).values(customFieldsData).returning();
                    insertedContacts.push({ ...insertedContact, custom_fields: insertedCustomFields });
                } else if (insertedContact) {
                    insertedContacts.push({ ...insertedContact, custom_fields: [] });
                }
            }
        }
        return c.json(insertedContacts, OK);
    } catch (error) {
        console.error('OpenAI API error: ', error);
        return c.json({ error: "Extraction from AI failed!" }, UNPROCESSABLE_ENTITY);
    }
}