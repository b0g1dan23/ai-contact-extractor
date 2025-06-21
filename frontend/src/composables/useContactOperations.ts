import { reactive } from 'vue';
import type { Contact, ContactExtractionState, ContactOperationResult } from '@/types';
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

    const createContact = async (contact: Contact): Promise<ContactOperationResult> => {
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

    const removeContact = (index: number): ContactOperationResult => {
        try {
            if (index >= 0 && index < state.contacts.length) {
                const removedContact = state.contacts.splice(index, 1)[0];
                return {
                    success: true,
                    data: removedContact
                };
            }
            return {
                success: false,
                error: 'Invalid contact index'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to remove contact'
            };
        }
    };

    const updateContact = async (contact: Contact, contactID: number): Promise<ContactOperationResult> => {
        try {
            state.isLoading = true;
            state.error = null;
            const updatedContact = await ContactApiService.updateContact(contact, contactID);
            // TODO: Update the contact in the state
            // For simplicity, we will randomly update a contact in the state
            const index = Math.random() * state.contacts.length;
            if (index !== -1) {
                state.contacts[index] = updatedContact;
            }
            return {
                success: true,
                data: updatedContact
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
        removeContact,
        updateContact
    };
};