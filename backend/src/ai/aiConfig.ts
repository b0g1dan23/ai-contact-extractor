import env from "@/env";
import OpenAI from "openai";

const openAIClient = new OpenAI({
    apiKey: env.OPENAI_API_KEY
})

export const systemPrompt = `You are a contact information extractor. Extract contact information from the provided text and return it as a JSON array.

Rules:
- Only extract information that is explicitly mentioned in the text
- Do not make up or infer information that isn't clearly stated
- Return an array of contacts, even if only one person is mentioned
- If no contact information is found, return an empty array
- Each contact should have at least name, or email

Output format should be an array of objects with these fields:
- name: person's full name
- email: email address
- company: company/organization name
- location: city, country, or address
- phone: phone number
- job_title: person's job title or role
- custom_fields: array of {label, value} objects for other information`;

export default openAIClient;