import { provide, inject, type InjectionKey, type Ref, type ComputedRef } from 'vue';
import { useContactFiltering } from '@/composables/useContactFiltering';
import type { Contact, ContactFilter } from '@/types';

export interface ContactFilteringProvider {
    searchTerm: Ref<string>;
    activeFilters: Ref<Set<ContactFilter>>;
    filteredContacts: ComputedRef<Contact[]>;
    activeFilterCount: ComputedRef<number>;
    hasActiveFilters: ComputedRef<boolean>;
    toggleFilter: (filterType: ContactFilter) => void;
    clearFilters: () => void;
    isFilterActive: (filterType: ContactFilter) => boolean;
}

export const ContactFilteringKey: InjectionKey<ContactFilteringProvider> = Symbol('contactFiltering');

export const useContactFilteringProvider = (contacts: Ref<Contact[]>) => {
    const contactFilters = useContactFiltering(contacts);

    provide(ContactFilteringKey, contactFilters);

    return contactFilters;
};

export const useContactFilteringConsumer = () => {
    const contactFiltering = inject(ContactFilteringKey);

    if (!contactFiltering) {
        throw new Error(
            'useContactFilteringConsumer must be used within a component that has ContactExtractionProvider in its parent tree'
        );
    }

    return contactFiltering;
};
