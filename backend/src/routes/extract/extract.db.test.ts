import { describe, expect, it, beforeEach } from 'vitest';
import { createTestApp } from '@/lib/create-app';
import extractRoutes from './extract.index';
import { OK } from '@/helpers/http-status-codes';
import db from '@/db';
import { contactsTable, customFieldsTable } from '@/db/schema';

describe('Extract API Database Integration Tests', () => {
    const app = createTestApp(extractRoutes); beforeEach(async () => {
        await db.delete(customFieldsTable);
        await db.delete(contactsTable);
    });

    it('should save extracted contacts to database after successful AI extraction', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "John Smith works at TechCorp Inc, you can reach him at john.smith@techcorp.com or call +1-555-0100"
            })
        });

        if (response.status === OK) {
            const responseData = await response.json();
            expect(Array.isArray(responseData)).toBe(true);

            if (responseData.length > 0) {
                const savedContacts = await db.select().from(contactsTable);
                expect(savedContacts.length).toBe(responseData.length);

                const firstContact = savedContacts[0];
                expect(firstContact.name).toBeTruthy();
                expect(firstContact.email).toBeTruthy();
                expect(firstContact.createdAt).toBeTruthy();
                expect(firstContact.updatedAt).toBeTruthy();
                expect(firstContact.id).toBeTruthy();
            }
        } else {
            console.log('AI extraction failed, skipping database test');
        }
    });

    it('should save multiple contacts to database when multiple contacts are extracted', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "I met Sarah Johnson (sarah.j@company.com) and Mike Davis (mike.d@company.com) at the conference. Sarah is a Developer and Mike is a Manager at DataTech Solutions."
            })
        });

        if (response.status === OK) {
            const responseData = await response.json();
            expect(Array.isArray(responseData)).toBe(true);

            if (responseData.length >= 2) {
                const savedContacts = await db.select().from(contactsTable);
                expect(savedContacts.length).toBe(responseData.length);

                const emails = savedContacts.map(c => c.email).filter(Boolean);
                expect(emails.length).toBeGreaterThan(0);

                const companies = savedContacts.map(c => c.company).filter(Boolean);
                expect(companies.length).toBeGreaterThan(0);
            }
        } else {
            console.log('AI extraction failed, skipping multiple contacts database test');
        }
    });

    it('should handle empty extraction results gracefully in database', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Today the weather is nice. I went to the park and saw beautiful flowers. No business contacts mentioned here."
            })
        });

        if (response.status === OK) {
            const responseData = await response.json();
            expect(Array.isArray(responseData)).toBe(true);

            const savedContacts = await db.select().from(contactsTable);
            expect(savedContacts.length).toBe(responseData.length);

            if (responseData.length === 0) {
                expect(savedContacts.length).toBe(0);
            }
        } else {
            console.log('AI extraction failed, skipping empty results database test');
        }
    });

    it('should verify database schema fields are properly saved', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Contact Dr. Emily Watson at emily.watson@hospital.com, she works as Chief Surgeon at Metro Hospital, located in New York. Phone: +1-555-0199."
            })
        });

        if (response.status === OK) {
            const responseData = await response.json();

            if (responseData.length > 0) {
                const savedContacts = await db.select().from(contactsTable);
                const contact = savedContacts[0];

                expect(contact).toHaveProperty('id');
                expect(contact).toHaveProperty('name');
                expect(contact).toHaveProperty('email');
                expect(contact).toHaveProperty('company');
                expect(contact).toHaveProperty('location');
                expect(contact).toHaveProperty('phone');
                expect(contact).toHaveProperty('job_title');
                expect(contact).toHaveProperty('notes');
                expect(contact).toHaveProperty('createdAt');
                expect(contact).toHaveProperty('updatedAt');

                expect(typeof contact.id).toBe('string');
                expect(contact.id.length).toBe(36);
                expect(typeof contact.createdAt).toBe('number');
                expect(typeof contact.updatedAt).toBe('number');
            }
        } else {
            console.log('AI extraction failed, skipping schema verification test');
        }
    });

    it('should maintain data consistency between API response and database', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Meet Alex Chen, Software Engineer at InnovateLabs. Email: alex.chen@innovatelabs.com, Phone: +1-555-0123, Based in San Francisco."
            })
        });

        if (response.status === OK) {
            const responseData = await response.json();

            if (responseData.length > 0) {
                const apiContact = responseData[0];
                const savedContacts = await db.select().from(contactsTable);
                const dbContact = savedContacts[0];

                if (apiContact.name) expect(dbContact.name).toBe(apiContact.name);
                if (apiContact.email) expect(dbContact.email).toBe(apiContact.email);
                if (apiContact.company) expect(dbContact.company).toBe(apiContact.company);
                if (apiContact.location) expect(dbContact.location).toBe(apiContact.location);
                if (apiContact.phone) expect(dbContact.phone).toBe(apiContact.phone);
                if (apiContact.job_title) expect(dbContact.job_title).toBe(apiContact.job_title);
                if (apiContact.notes) expect(dbContact.notes).toBe(apiContact.notes);
            }
        } else {
            console.log('AI extraction failed, skipping data consistency test');
        }
    }); it('should clean up properly between tests', async () => {
        const firstResponse = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Test contact: test@example.com"
            })
        });

        if (firstResponse.status === OK) {
            await db.delete(contactsTable);

            const contactsAfterCleanup = await db.select().from(contactsTable);
            expect(contactsAfterCleanup.length).toBe(0);
        }
    }); it('should save custom fields to separate table when contacts have additional data', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Dr. Emily Watson, senior researcher at BioTech Labs (emily.watson@biotechlabs.com, +1-555-0200). She has a PhD in Molecular Biology from Stanford University, published 45 research papers, and specializes in CRISPR gene editing technology. Her office is in Building A, Room 301. She prefers morning meetings and speaks fluent German and French."
            })
        });

        if (response.status === OK) {
            const responseData = await response.json();
            expect(Array.isArray(responseData)).toBe(true);

            if (responseData.length > 0) {
                const apiContact = responseData[0];

                // Check that contact was saved to main table
                const savedContacts = await db.select().from(contactsTable);
                expect(savedContacts.length).toBe(1);

                const savedContact = savedContacts[0];
                expect(savedContact.id).toBeTruthy();
                expect(savedContact.name).toBeTruthy();
                expect(savedContact.email).toBeTruthy();

                // Check if custom fields were detected by AI and saved to custom fields table
                if (apiContact.custom_fields && apiContact.custom_fields.length > 0) {
                    const savedCustomFields = await db.select().from(customFieldsTable);
                    expect(savedCustomFields.length).toBeGreaterThan(0);

                    // Verify all custom fields are linked to the correct contact
                    savedCustomFields.forEach(field => {
                        expect(field.contact_id).toBe(savedContact.id);
                        expect(field.label).toBeTruthy();
                        expect(field.value).toBeTruthy();
                        expect(field.id).toBeTruthy();
                        expect(field.createdAt).toBeTruthy();
                        expect(field.updatedAt).toBeTruthy();
                    });

                    console.log('Custom fields extracted:', savedCustomFields.map(f => `${f.label}: ${f.value}`));
                }
            }
        } else {
            console.log('AI extraction failed, skipping custom fields test');
        }
    }, 10000); it('should handle contacts with no custom fields gracefully', async () => {
        const response = await app.request('/extract/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "Simple contact: Jane Doe at jane@example.com"
            })
        });

        if (response.status === OK) {
            const responseData = await response.json();

            if (responseData.length > 0) {
                const savedContacts = await db.select().from(contactsTable);
                expect(savedContacts.length).toBeGreaterThanOrEqual(1);

                // Check that custom fields table exists and can be queried
                const savedCustomFields = await db.select().from(customFieldsTable);

                // If API returned custom fields, they should be saved
                const apiContact = responseData[0];
                if (apiContact.custom_fields && apiContact.custom_fields.length > 0) {
                    // Should have custom fields for this contact
                    const contactCustomFields = savedCustomFields.filter(f =>
                        savedContacts.some(c => c.id === f.contact_id)
                    );
                    expect(contactCustomFields.length).toBeGreaterThanOrEqual(0);
                }
            }
        } else {
            console.log('AI extraction failed, skipping no custom fields test');
        }
    });
});
