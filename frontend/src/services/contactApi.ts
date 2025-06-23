import type { Contact, ContactInput, ExtractedContact } from '@/services/apiClient';
import { apiClient } from './apiClient';
import env from '@/env';

// const mockContacts: Contact[] = [
//     {
//         name: "Sarah Johnson",
//         email: "sarah.johnson@techcorp.com",
//         company: "TechCorp Solutions",
//         location: "San Francisco, CA",
//         phone: "+1 (555) 123-4567",
//         job_title: "Senior Software Engineer",
//         custom_fields: [
//             { label: "Department", value: "Engineering" },
//             { label: "Team", value: "Frontend Development" },
//             { label: "Start Date", value: "2021-03-15" }
//         ]
//     },
//     {
//         name: "Michael Chen",
//         email: "m.chen@designstudio.com",
//         company: "Creative Design Studio",
//         location: "New York, NY",
//         phone: "+1 (555) 987-6543",
//         job_title: "UI/UX Designer",
//         custom_fields: [
//             { label: "Department", value: "Design" },
//             { label: "Experience", value: "5 years" }
//         ]
//     },
//     {
//         name: "Emma Rodriguez",
//         email: "emma.r@marketing.co",
//         company: "Global Marketing Co",
//         location: "Austin, TX",
//         phone: "+1 (555) 456-7890",
//         job_title: "Marketing Manager",
//         custom_fields: [
//             { label: "Department", value: "Marketing" },
//             { label: "Specialty", value: "Digital Marketing" }
//         ]
//     },
//     {
//         name: "Alex Thompson",
//         email: "",
//         company: "Local Business",
//         location: "Seattle, WA",
//         phone: "+1 (555) 321-0987",
//         job_title: "Business Owner",
//         custom_fields: []
//     }
// ];

export class ContactApiService {
    static async fetchContacts(): Promise<Contact[]> {
        const res = await apiClient.GET('/api/v1/contacts');
        if (res.error) {
            throw new Error(res.error.error);
        }
        const contacts = res.data;
        return contacts;
    }

    static async createContact(contact: ContactInput): Promise<Contact> {
        const result = await apiClient.POST('/api/v1/contacts', {
            body: contact
        })

        if (result.error) {
            if (typeof result.error.error === 'object' && 'issues' in result.error.error) {
                throw new Error(result.error.error.issues[0].message || 'Failed to create contact');
            } else {
                throw new Error(result.error.error || 'Failed to create contact');
            }
        }

        return result.data;
    }

    static async extractContactsFromText(text: string): Promise<ExtractedContact[]> {
        const result = await apiClient.POST('/api/v1/extract/text', {
            body: { text }
        })

        if (result.error) {
            throw new Error(result.error.error || 'Failed to extract contacts from text');
        }

        return result.data;
    }

    static async updateContact(contact: Contact, contactID: string): Promise<void> {
        const res = await fetch(`${env.VITE_API_URL}/api/v1/contacts/${contactID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })

        if (!res.ok) {
            const { error } = await res.json() as { error: string };
            throw new Error(`Failed to update contact with ID ${contactID}: ${error}`);
        }
    }

    static async deleteContact(contactId: string): Promise<void> {
        const result = await fetch(`${env.VITE_API_URL}/api/v1/contacts/${contactId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!result.ok) {
            const { error } = await result.json() as { error: string };
            throw new Error(`Failed to delete contact with ID ${contactId}: ${error}`);
        }
    }
}