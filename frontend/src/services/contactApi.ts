import type { Contact } from '@/types';

const mockContacts: Contact[] = [
    {
        name: "Sarah Johnson",
        email: "sarah.johnson@techcorp.com",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        phone: "+1 (555) 123-4567",
        job_title: "Senior Software Engineer",
        custom_fields: [
            { label: "Department", value: "Engineering" },
            { label: "Team", value: "Frontend Development" },
            { label: "Start Date", value: "2021-03-15" }
        ]
    },
    {
        name: "Michael Chen",
        email: "m.chen@designstudio.com",
        company: "Creative Design Studio",
        location: "New York, NY",
        phone: "+1 (555) 987-6543",
        job_title: "UI/UX Designer",
        custom_fields: [
            { label: "Department", value: "Design" },
            { label: "Experience", value: "5 years" }
        ]
    },
    {
        name: "Emma Rodriguez",
        email: "emma.r@marketing.co",
        company: "Global Marketing Co",
        location: "Austin, TX",
        phone: "+1 (555) 456-7890",
        job_title: "Marketing Manager",
        custom_fields: [
            { label: "Department", value: "Marketing" },
            { label: "Specialty", value: "Digital Marketing" }
        ]
    },
    {
        name: "Alex Thompson",
        email: "",
        company: "Local Business",
        location: "Seattle, WA",
        phone: "+1 (555) 321-0987",
        job_title: "Business Owner",
        custom_fields: []
    }
];

const simulateApiCall = async <T>(data: T, delay: number = 1500, failureRate: number = 0.05): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < failureRate) {
                reject(new Error('Network error: Failed to fetch data from server'));
                return;
            }
            resolve(data);
        }, delay);
    });
};

export class ContactApiService {
    static async fetchContacts(): Promise<Contact[]> {
        const contacts = await simulateApiCall(mockContacts, 2000);
        return contacts;
    }

    static async createContact(contact: Contact): Promise<Contact> {
        const contactWithMeta = {
            ...contact,
            custom_fields: [
                ...contact.custom_fields,
                { label: "Source", value: "Manual Entry" },
                { label: "Created Date", value: new Date().toISOString().split('T')[0] }
            ]
        };
        const result = await simulateApiCall(contactWithMeta, 1500);
        return result;
    }

    static async extractContactsFromText(text: string): Promise<Contact[]> {
        const randomContact = mockContacts[Math.floor(Math.random() * mockContacts.length)];
        const extractedContact = {
            ...randomContact,
            name: `${randomContact.name} (AI Extracted)`,
            custom_fields: [
                ...randomContact.custom_fields,
                { label: "Source", value: "AI Extraction" },
                { label: "Extracted Date", value: new Date().toISOString().split('T')[0] },
                { label: "Source Text Length", value: text.length.toString() }
            ]
        };

        const result = await simulateApiCall([extractedContact], 3000);
        return result;
    }

    static async updateContact(contact: Contact, contactID: number): Promise<Contact> {
        const result = await simulateApiCall(contact, 1000);
        return result;
    }

    static async deleteContact(contactId: string): Promise<void> {
        await simulateApiCall(null, 800);
    }
}