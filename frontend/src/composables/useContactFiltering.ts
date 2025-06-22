import { ref, computed, watch, type Ref } from 'vue';
import { ContactFilter } from '@/types';
import type { Contact } from '@/services/apiClient';

export const useContactFiltering = (contacts: Ref<Contact[]>) => {
    const searchTerm = ref('');
    const debouncedSearchTerm = ref('');
    const activeFilters = ref<Set<ContactFilter>>(new Set());

    let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

    watch(searchTerm, (newValue) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
            debouncedSearchTerm.value = newValue;
        }, 300);
    });

    const filteredContacts = computed(() => {
        let filtered = contacts.value;

        if (debouncedSearchTerm.value.trim()) {
            const searchLower = debouncedSearchTerm.value.toLowerCase();
            filtered = filtered.filter(contact =>
                contact.name?.toLowerCase().includes(searchLower) ||
                contact.email?.toLowerCase().includes(searchLower) ||
                contact.company?.toLowerCase().includes(searchLower) ||
                contact.phone?.toLowerCase().includes(searchLower) ||
                contact.job_title?.toLowerCase().includes(searchLower) ||
                contact.location?.toLowerCase().includes(searchLower)
            );
        }

        activeFilters.value.forEach(filter => {
            switch (filter) {
                case ContactFilter.HAS_EMAIL:
                    filtered = filtered.filter(contact =>
                        contact.email && contact.email.trim() !== ''
                    );
                    break;
                case ContactFilter.HAS_LOCATION:
                    filtered = filtered.filter(contact =>
                        contact.location && contact.location.trim() !== ''
                    );
                    break;
            }
        });

        return filtered;
    });

    const toggleFilter = (filterType: ContactFilter): void => {
        if (activeFilters.value.has(filterType)) {
            activeFilters.value.delete(filterType);
        } else {
            activeFilters.value.add(filterType);
        }
    };

    const clearFilters = (): void => {
        activeFilters.value.clear();
        searchTerm.value = '';
        debouncedSearchTerm.value = '';
    };

    const isFilterActive = (filterType: ContactFilter): boolean => {
        return activeFilters.value.has(filterType);
    };

    const activeFilterCount = computed(() => activeFilters.value.size);

    const hasActiveFilters = computed(() =>
        activeFilters.value.size > 0 || searchTerm.value.trim() !== ''
    );

    return {
        searchTerm,
        activeFilters,
        filteredContacts,
        activeFilterCount,
        hasActiveFilters,
        toggleFilter,
        clearFilters,
        isFilterActive
    };
};