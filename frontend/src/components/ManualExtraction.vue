<script setup lang="ts">
/**
 * ManualExtraction component for manually entering contact information
 * Features form validation, custom fields management, and seamless integration with the contact extraction system
 */

import { ContactSchema, type CustomField } from '@/types';
import type { ContactInput } from '@/services/apiClient';
import { reactive, computed, ref, onMounted, defineAsyncComponent } from 'vue';
import Button from './ui/Button.vue';
import { useToastNotifications } from '@/utils/toast';
import { useContactOperationsConsumer } from '@/providers/contactOperationsProvider';

const Loader = defineAsyncComponent(() =>
    import('@/components/ui/Loader.vue')
);

const getIcon = (iconName: 'cross') => {
    const icons = {
        cross: () => import('@/assets/icons/cross.svg'),
    };
    return icons[iconName]?.();
};

const crossIcon = ref('');

onMounted(async () => {
    crossIcon.value = (await getIcon('cross')).default;
})

const initialInputData: ContactInput = {
    name: null,
    email: null,
    company: null,
    location: null,
    phone: null,
    job_title: null,
    custom_fields: [],
}

const initialCustomField: CustomField = {
    label: '',
    value: '',
}

const inputData = reactive<ContactInput>({ ...initialInputData });
const inputField = reactive<CustomField>({ ...initialCustomField });
const { state, createContact } = useContactOperationsConsumer();
const { showErrorToast, showSuccessToast } = useToastNotifications();

const isFormValid = computed(() => {
    const result = ContactSchema.safeParse(inputData);
    return result.success;
});

const handleAddCustomField = () => {
    if (inputField.label.trim() && inputField.value.trim()) {
        inputData.custom_fields.push({ ...inputField });
        Object.assign(inputField, { ...initialCustomField });
    } else {
        showErrorToast('Please fill in both field name and value.', 'Validation Error');
    }
}

const handleRemoveCustomField = (index: number) => {
    inputData.custom_fields.splice(index, 1);
}

const handleSubmit = async () => {
    try {
        const parsedData = ContactSchema.parse(inputData);
        await createContact(parsedData);
        Object.assign(inputData, { ...initialInputData });
        inputData.custom_fields = [];

        if (state.error) {
            showErrorToast(state.error, 'Creation Error');
            return;
        }

        showSuccessToast('Contact added successfully!', 'Success');
    } catch (error) {
        showErrorToast('Please fill in all required fields correctly.', 'Validation Error');
        return;
    }
}
</script>
<template>
    <div class="manual">
        <div class="manual__inputs">
            <input type="text" name="Name" id="Name" placeholder="Name" v-model="inputData.name" />
            <input type="text" name="Email" id="Email" placeholder="Email" v-model="inputData.email" />
            <input type="text" name="Location" id="Location" placeholder="Location" v-model="inputData.location" />
            <input type="text" name="Phone" id="Phone" placeholder="Phone" v-model="inputData.phone" />
            <input type="text" name="Company" id="Company" placeholder="Company" v-model="inputData.company" />
            <input type="text" name="Job title" id="Job title" placeholder="Job title" v-model="inputData.job_title" />
            <Button @click="handleSubmit" :disabled="state.isLoading || !isFormValid">
                <Loader v-if="state.isLoading" />
                <span v-else class="btn__span">+</span>
            </Button>
        </div>
        <div class="manual__customFields">
            <h4>Custom fields</h4>
            <div class="manual__customFields__row">
                <input type="text" name="custom_field_label" id="custom_field_label"
                    placeholder="Field name (e.g., Department)" v-model="inputField.label">
                <input type="text" name="custom_field_value" id="custom_field_value" placeholder="Field value"
                    v-model="inputField.value">
                <Button variant="outline" @click="handleAddCustomField">Add field</Button>
            </div>
        </div>
        <div class="manual__fieldValues">
            <div v-for="(field, index) in inputData.custom_fields" :key="index" class="manual__fieldValues__row">
                <div class="manual__fieldValues__text">
                    <span class="manual__fieldValues__heading">{{ field.label }}:</span>
                    <span>{{ field.value }}</span>
                </div> <button class="manual__fieldValues__remove">
                    <img :src="crossIcon" alt="Cross closing icon" class="manual__fieldValues__remove-icon"
                        @click="handleRemoveCustomField(index)" />
                </button>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.manual {
    display: grid;
    gap: $spacing-lg;

    &__inputs {
        display: flex;
        align-items: center;
        gap: $spacing-lg;

        @include respond-to('tablet') {
            flex-direction: column;
            gap: $spacing-sm;
            align-items: stretch;
        }
    }

    &__customFields {
        display: grid;
        gap: $spacing-sm;

        &__row {
            display: flex;
            gap: $spacing-lg;
            align-items: center;

            @include respond-to('tablet') {
                flex-direction: column;
                gap: $spacing-sm;

                & button {
                    width: 100%;
                }
            }
        }
    }

    &__fieldValues {
        display: grid;
        gap: $spacing-sm;


        &__heading {
            font-weight: $font-weight-bold;
        }

        & span {
            color: $black-color;
            font-size: $font-size-h4-desktop;

            @include respond-to('mobile') {
                font-size: $font-size-h4-mobile;
            }
        }

        &__text {
            display: flex;
            align-items: center;
            gap: $spacing-sm;
        }

        &__row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__remove {
            border-radius: 50%;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all .3s ease;
            cursor: pointer;

            &:hover {
                background-color: $primary-light;
            }

            & img {
                width: 2.8rem;
                height: 2.8rem;
                transition: all .3s ease;

                &:hover {
                    filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
                }
            }

            &-icon {
                filter: var(--icon-filter);
            }
        }
    }
}

.btn__span {
    color: $white-color;
    font-size: $font-size-h3-desktop;

    @include respond-to('mobile') {
        font-size: $font-size-h3-mobile;
    }
}
</style>