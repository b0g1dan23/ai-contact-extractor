import { provide, inject, type InjectionKey, type Ref, type ComputedRef } from 'vue';
import { useContactExtraction } from '@/composables/useContactExtraction';
import type { ContactExtractionState, ContactFilter } from '@/composables/useContactExtraction';
import type { Contact } from '@/types';

export interface ContactExtractionProvider {
    state: ContactExtractionState;
    searchTerm: Ref<string>;
    filteredContacts: ComputedRef<Contact[]>;
    activeFilters: Ref<Set<ContactFilter>>;
    extractContacts: (text: string) => Promise<Contact[]>;
    clearContacts: () => void;
    removeContact: (id: string) => void;
    createContact: (contact: Contact) => Promise<Contact>;
    toggleFilter: (filterType: ContactFilter) => void;
    clearFilters: () => void;
    isFilterActive: (filterType: ContactFilter) => boolean;
}

export const ContactExtractionKey: InjectionKey<ContactExtractionProvider> = Symbol('contactExtraction');

export const useContactExtractionProvider = () => {
    const contactExtraction = useContactExtraction();

    provide(ContactExtractionKey, contactExtraction);

    return contactExtraction;
};

/**
 * Consumer hook - use in child components to access contact extraction functionality
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
