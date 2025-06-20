import type { Contact } from '@/types';
import { reactive, ref, computed, watch } from 'vue';

export interface ContactExtractionState {
    isLoading: boolean;
    contacts: Contact[];
    error: string | null;
}

const mockContact: Contact = {
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    job_title: "Senior Software Engineer",
    custom_fields: [
        {
            label: "Department",
            value: "Engineering"
        },
        {
            label: "Team",
            value: "Frontend Development"
        },
        {
            label: "Start Date",
            value: "2021-03-15"
        }
    ]
};

export enum ContactFilter {
    HAS_EMAIL = 'hasEmail',
    HAS_LOCATION = 'hasLocation'
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
    }); const searchTerm = ref('');

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
        let contacts = state.contacts;

        if (debouncedSearchTerm.value.trim()) {
            const lowerCaseTerm = debouncedSearchTerm.value.toLowerCase();
            contacts = contacts.filter(contact =>
                (contact.name && contact.name.toLowerCase().includes(lowerCaseTerm)) ||
                (contact.email && contact.email.toLowerCase().includes(lowerCaseTerm)) ||
                (contact.company && contact.company.toLowerCase().includes(lowerCaseTerm)) ||
                (contact.phone && contact.phone.toLowerCase().includes(lowerCaseTerm)) ||
                (contact.job_title && contact.job_title.toLowerCase().includes(lowerCaseTerm))
            );
        }

        activeFilters.value.forEach(filter => {
            switch (filter) {
                case ContactFilter.HAS_EMAIL:
                    contacts = contacts.filter(contact =>
                        contact.email && contact.email.trim() !== ''
                    );
                    break;
                case ContactFilter.HAS_LOCATION:
                    contacts = contacts.filter(contact =>
                        contact.location && contact.location.trim() !== ''
                    );
                    break;
            }
        });

        return contacts;
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
            await new Promise((resolve) => setTimeout(resolve, 2000));
            state.contacts.push(mockContact);
            return [mockContact];
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to extract contacts';
            state.error = errorMessage;
            throw error;
        } finally {
            state.isLoading = false;
        }
    };

    const removeContact = (id: string) => {
        // TODO: Implement actual contact removal logic
    };

    const clearContacts = () => {
        state.contacts = [];
        state.error = null;
    };

    const createContact = async (contact: Contact): Promise<Contact> => {
        if (!contact.name && !contact.email) {
            throw new Error('Contact must have either name or email');
        }
        console.log(contact)

        state.isLoading = true;
        state.error = null;

        try {
            // TODO: Implement actual contact creation logic
            await new Promise((resolve) => setTimeout(resolve, 1000));
            state.contacts.push(contact);
            return contact;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to extract contacts';
            state.error = errorMessage;
            throw error;
        } finally {
            state.isLoading = false;
        }
    }

    // Filter management functions
    const toggleFilter = (filterType: ContactFilter) => {
        if (activeFilters.value.has(filterType)) {
            activeFilters.value.delete(filterType);
        } else {
            activeFilters.value.add(filterType);
        }
    };

    const clearFilters = () => {
        activeFilters.value.clear();
    };

    const isFilterActive = (filterType: ContactFilter) => {
        return activeFilters.value.has(filterType);
    };

    return {
        state,
        searchTerm,
        filteredContacts,
        activeFilters,
        extractContacts,
        clearContacts,
        removeContact,
        createContact,
        toggleFilter,
        clearFilters,
        isFilterActive,
    };
};