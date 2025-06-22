import { provide, inject, type InjectionKey } from 'vue';
import { useContactOperations } from '@/composables/useContactOperations';
import type { ContactExtractionState, ContactOperationResult } from '@/types';
import type { Contact, ContactInput } from '@/services/apiClient';

export interface ContactOperationsProvider {
    state: ContactExtractionState;
    loadContacts: () => Promise<ContactOperationResult>;
    extractContacts: (text: string) => Promise<ContactOperationResult>;
    createContact: (contact: ContactInput) => Promise<ContactOperationResult>;
    deleteContact: (id: string) => Promise<ContactOperationResult>;
    updateContact: (contact: Contact, contactID: string) => Promise<ContactOperationResult>;
}

export const ContactOperationsKey: InjectionKey<ContactOperationsProvider> = Symbol('contactOperations');

export const useContactOperationsProvider = () => {
    const contactOperations = useContactOperations();

    provide(ContactOperationsKey, contactOperations);

    return contactOperations;
};

export const useContactOperationsConsumer = () => {
    const contactOperations = inject(ContactOperationsKey);

    if (!contactOperations) {
        throw new Error(
            'useContactOperationsConsumer must be used within a component that has ContactOperationsProvider in its parent tree'
        );
    }

    return contactOperations;
};
