import { provide, inject, type InjectionKey } from 'vue';
import { useContactExtraction, type Contact, type ContactExtractionState } from '@/composables/useContactExtraction';

/**
 * Interface for the contact extraction provider
 * Defines all methods and state available through the provider pattern
 */
export interface ContactExtractionProvider {
    /** Reactive state containing contacts, loading status, and errors */
    state: ContactExtractionState;
    /** Extracts contacts from provided text using AI */
    extractContacts: (text: string) => Promise<Contact[]>;
    /** Clears all extracted contacts */
    clearContacts: () => void;
    /** Removes a specific contact by ID */
    removeContact: (id: string) => void;
}

/**
 * Injection key for type-safe dependency injection
 */
export const ContactExtractionKey: InjectionKey<ContactExtractionProvider> = Symbol('contactExtraction');

/**
 * Provider hook - use in parent component to provide contact extraction functionality
 * @returns Contact extraction functionality object
 */
export const useContactExtractionProvider = () => {
    const contactExtraction = useContactExtraction();

    provide(ContactExtractionKey, contactExtraction);

    return contactExtraction;
};

/**
 * Consumer hook - use in child components to access contact extraction functionality
 * @returns Contact extraction functionality object
 * @throws Error if used outside of provider context
 */
export const useContactExtractionConsumer = () => {
    const contactExtraction = inject(ContactExtractionKey);

    if (!contactExtraction) {
        throw new Error(
            'useContactExtractionConsumer must be used within a component that has ContactExtractionProvider in its parent tree'
        );
    }

    return contactExtraction;
};
