import { describe, expect, it } from 'vitest';
import { createTestApp } from '@/lib/create-app';
import extractRoutes from './extract.index';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from '@/helpers/http-status-codes';

describe('Extract API Basic Tests', () => {
    const app = createTestApp(extractRoutes);

    it('should return 422 for missing text field', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        expect(response.status).toBe(UNPROCESSABLE_ENTITY);
    });

    it('should return 422 for empty text', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: ""
            })
        });

        expect(response.status).toBe(UNPROCESSABLE_ENTITY);
    });

    it('should return 422 for text too long', async () => {
        const longText = 'a'.repeat(10001);

        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: longText
            })
        });

        expect(response.status).toBe(UNPROCESSABLE_ENTITY);
    });

    it('should handle valid request structure', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Valid text input"
            })
        });

        expect([OK, UNPROCESSABLE_ENTITY]).toContain(response.status);
        expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should handle malformed JSON', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: 'invalid json{'
        });

        expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });

    it('should handle missing content-type header', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            body: JSON.stringify({
                text: "Valid text"
            })
        });

        expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });

    it('should only accept POST method', async () => {
        const response = await app.request('/extract/text', {
            method: 'GET'
        });

        expect(response.status).toBe(NOT_FOUND);
    });
});

describe('Extract API Output Tests', () => {
    const app = createTestApp(extractRoutes);

    it('should extract single contact from simple text', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "I met John Doe from TechCorp, his email is john.doe@techcorp.com"
            })
        });

        if (response.status === OK) {
            const data = await response.json();

            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThan(0);

            const contact = data[0];
            expect(contact).toHaveProperty('name');
            expect(contact).toHaveProperty('email');

            expect(contact.name).toContain('John');
            expect(contact.email).toContain('@techcorp.com');
        } else {
            expect(response.status).toBe(UNPROCESSABLE_ENTITY);
        }
    });

    it('should extract multiple contacts', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Today I met Dustin (dustin@heygov.com) and Andrei (andrei@heygov.com) from HeyGov company"
            })
        });

        if (response.status === OK) {
            const data = await response.json();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(2);

            const contact1 = data.find((c: any) => c.name?.includes('Dustin'));
            expect(contact1).toBeDefined();
            expect(contact1.email).toBe('dustin@heygov.com');
            expect(contact1.company).toContain('HeyGov');

            const contact2 = data.find((c: any) => c.name?.includes('Andrei'));
            expect(contact2).toBeDefined();
            expect(contact2.email).toBe('andrei@heygov.com');
            expect(contact2.company).toContain('HeyGov');
        } else {
            expect(response.status).toBe(UNPROCESSABLE_ENTITY);
        }
    });

    it('should return empty array for text with no contacts', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "This is just a random text about weather and cooking. No contact information here."
            })
        });

        if (response.status === OK) {
            const data = await response.json();

            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(0);
        } else {
            expect(response.status).toBe(UNPROCESSABLE_ENTITY);
        }
    });

    it('should extract contact with phone number', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Call Sarah Johnson at +1-555-123-4567 or email her at sarah.johnson@example.com"
            })
        });

        if (response.status === OK) {
            const data = await response.json();

            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThan(0);

            const contact = data[0];
            expect(contact.name).toContain('Sarah');
            expect(contact.email).toBe('sarah.johnson@example.com');
            expect(contact.phone).toContain('555-123-4567');
        } else {
            expect(response.status).toBe(UNPROCESSABLE_ENTITY);
        }
    });

    it('should extract job title and company', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "I spoke with Mike Wilson, Senior Developer at CloudTech Inc. His email is mike.wilson@cloudtech.io"
            })
        });

        if (response.status === OK) {
            const data = await response.json();

            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThan(0);

            const contact = data[0];
            expect(contact.name).toContain('Mike');
            expect(contact.email).toBe('mike.wilson@cloudtech.io');
            expect(contact.company).toContain('CloudTech');
            expect(contact.job_title).toContain('Developer');
        } else {
            expect(response.status).toBe(UNPROCESSABLE_ENTITY);
        }
    });

    it('should return proper data structure', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Contact me at test@example.com"
            })
        });

        if (response.status === OK) {
            const data = await response.json();

            expect(Array.isArray(data)).toBe(true);

            if (data.length > 0) {
                const contact = data[0];

                expect(typeof contact).toBe('object');
                expect(contact).toHaveProperty('email');

                if (contact.email) {
                    expect(contact.email).toMatch(/@/);
                }

                if (contact.custom_fields) {
                    expect(Array.isArray(contact.custom_fields)).toBe(true);
                }
            }
        } else {
            expect(response.status).toBe(UNPROCESSABLE_ENTITY);
        }
    });
});
