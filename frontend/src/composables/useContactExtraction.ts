import { reactive } from 'vue';

/**
 * Represents custom field for a contact
 */
export interface CustomField {
    label: string;
    value: string;
}

/**
 * Base contact properties
 */
interface BaseContact {
    id: string;
    company?: string;
    location?: string;
    phone?: string;
    job_title?: string;
    custom_fields?: CustomField[];
}

/**
 * Represents a contact extracted from text
 * Must have either name or email (or both) - enforced by discriminated union
 */
export type Contact = BaseContact & ({
    name: string;
    email?: string;
} | {
    email: string;
    name?: string;
});

/**
 * State interface for contact extraction functionality
 */
export interface ContactExtractionState {
    isLoading: boolean;
    contacts: Contact[];
    error: string | null;
}

/**
 * Composable for handling AI-powered contact extraction from text
 * @returns Object with state and methods for contact extraction
 */
export const useContactExtraction = () => {
    const state = reactive<ContactExtractionState>({
        isLoading: false,
        contacts: [],
        error: null
    });

    /**
     * Extracts contacts from provided text using AI
     * @param text - The text to extract contacts from
     * @returns Promise that resolves to array of extracted contacts
     * @throws Error if text is empty or extraction fails
     */
    const extractContacts = async (text: string): Promise<Contact[]> => {
        if (!text.trim()) {
            throw new Error('Text cannot be empty');
        }

        state.isLoading = true;
        state.error = null;

        try {
            // TODO: Implement actual contact extraction logic
            return [{ id: '1', email: 'example@gmail.com' }];
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to extract contacts';
            state.error = errorMessage;
            throw error;
        } finally {
            state.isLoading = false;
        }
    };
    /**
     * Removes a contact by ID
     * @param id - The ID of the contact to remove
     */
    const removeContact = (id: string) => {
        // TODO: Implement actual contact removal logic
    };

    /**
     * Clears all contacts and resets error state
     */
    const clearContacts = () => {
        state.contacts = [];
        state.error = null;
    };

    return {
        state,
        extractContacts,
        clearContacts,
        removeContact
    };
};