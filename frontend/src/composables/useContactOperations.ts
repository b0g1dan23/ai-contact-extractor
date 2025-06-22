import { reactive } from 'vue';
import type { ContactExtractionState, ContactOperationResult } from '@/types';
import type { Contact, ContactInput } from '@/services/apiClient';
import { ContactApiService } from '@/services/contactApi';

export const useContactOperations = () => {
    const state = reactive<ContactExtractionState>({
        isLoading: false,
        contacts: [],
        error: null
    });

    const loadContacts = async (): Promise<ContactOperationResult> => {
        state.error = null;
        state.isLoading = true;

        try {
            let contacts = await ContactApiService.fetchContacts();
            state.contacts = contacts;

            return {
                success: true,
                data: state.contacts
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load contacts';
            state.error = errorMessage;

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            state.isLoading = false;
        }
    };

    const extractContacts = async (text: string): Promise<ContactOperationResult> => {
        if (!text.trim()) {
            return {
                success: false,
                error: 'Text cannot be empty'
            };
        }

        state.isLoading = true;
        state.error = null;

        try {
            const extractedContacts = await ContactApiService.extractContactsFromText(text);
            state.contacts.push(...extractedContacts);

            console.log(state.contacts)
            return {
                success: true,
                data: extractedContacts
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to extract contacts';
            state.error = errorMessage;

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            state.isLoading = false;
        }
    };

    const createContact = async (contact: ContactInput): Promise<ContactOperationResult> => {
        if (!contact.name && !contact.email) {
            return {
                success: false,
                error: 'Contact must have either name or email'
            };
        }

        state.isLoading = true;
        state.error = null;

        try {
            const createdContact = await ContactApiService.createContact(contact);
            state.contacts.push(createdContact);

            console.log(state.contacts)

            return {
                success: true,
                data: createdContact
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create contact';
            state.error = errorMessage;

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            state.isLoading = false;
        }
    };

    const deleteContact = async (id: string): Promise<ContactOperationResult> => {
        try {
            state.isLoading = true;
            state.error = null;
            await ContactApiService.deleteContact(id);
            state.contacts = state.contacts.filter(contact => contact.id !== id);
            return {
                success: true,
                error: 'Contact deleted successfully'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to remove contact';
            state.error = errorMessage;
            return {
                success: false,
                error: errorMessage
            }
        } finally {
            state.isLoading = false;
        }
    };

    const updateContact = async (contact: Contact, contactID: string): Promise<ContactOperationResult> => {
        try {
            state.isLoading = true;
            state.error = null;
            await ContactApiService.updateContact(contact, contactID);
            return {
                success: true,
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update contact';
            state.error = errorMessage;

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            state.isLoading = false;
        }
    }

    return {
        state,
        loadContacts,
        extractContacts,
        createContact,
        deleteContact,
        updateContact
    };
};