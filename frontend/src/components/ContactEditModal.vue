<script lang="ts" setup>
import type { Contact } from '@/types';
import Modal from './ui/Modal.vue';
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import Button from './ui/Button.vue';
import { useContactOperationsConsumer } from '@/providers/contactOperationsProvider';

const Loader = defineAsyncComponent(() =>
    import('@/components/ui/Loader.vue')
);

const getIcon = (iconName: 'location' | 'phone' | 'email' | 'suitcase' | 'hashtag') => {
    const icons = {
        location: () => import("@/assets/icons/Location.svg"),
        phone: () => import("@/assets/icons/phone.svg"),
        email: () => import('@/assets/icons/mail.svg'),
        suitcase: () => import('@/assets/icons/suitcase.svg'),
        hashtag: () => import('@/assets/icons/hashtag.svg'),
    };
    return icons[iconName]?.();
};

const locationIcon = ref('');
const phoneIcon = ref('');
const emailIcon = ref('');
const suitcaseIcon = ref('');
const hashtagIcon = ref('');

onMounted(async () => {
    locationIcon.value = (await getIcon('location')).default;
    phoneIcon.value = (await getIcon('phone')).default;
    emailIcon.value = (await getIcon('email')).default;
    suitcaseIcon.value = (await getIcon('suitcase')).default;
    hashtagIcon.value = (await getIcon('hashtag')).default;
})

const { updateContact, state } = useContactOperationsConsumer();

const emit = defineEmits<{
    handleClose: [];
}>();

const props = defineProps<{
    contact: Contact;
    initial: string;
}>();

const editedContact = reactive<Contact>({ ...props.contact });

const handleUpdateContact = async () => {
    try {
        await updateContact(editedContact, 1);
        emit('handleClose');
    } catch (error) {
        console.error('Failed to update contact:', error);
    }
};
</script>
<template>
    <Modal v-on:handle-close="emit('handleClose')" title="Edit Contact">
        <div class="item">
            <div class="item__header">
                <div class="item__header__text">
                    <div class="item__avatar">
                        <span class="item__avatar__span">
                            {{ initial }}
                        </span>
                    </div>
                    <div class="item__text">
                        <input type="text" name="name" class="input__h3" v-model="editedContact.name" />
                        <input type="text" name="company" v-model="editedContact.company" />
                    </div>
                </div>
            </div>
            <div class="item__content">
                <div class="item__info">
                    <div class="item__info__card">
                        <div class="item__info__icon">
                            <img :src="locationIcon" alt="location icon" />
                        </div>
                        <input type="text" name="location" v-model="editedContact.location" />
                    </div>
                    <div class="item__info__card">
                        <div class="item__info__icon">
                            <img :src="phoneIcon" alt="phone icon" />
                        </div>
                        <input type="text" name="phone" v-model="editedContact.phone" />
                    </div>
                    <div class="item__info__card">
                        <div class="item__info__icon">
                            <img :src="emailIcon" alt="email icon" />
                        </div>
                        <input type="text" name="email" v-model="editedContact.email" />
                    </div>
                    <div class="item__info__card">
                        <div class="item__info__icon">
                            <img :src="suitcaseIcon" alt="suitcase icon" />
                        </div>
                        <input type="text" name="job_title" v-model="editedContact.job_title" />
                    </div>
                </div>
                <div class="custom" v-if="editedContact.custom_fields.length">
                    <h3>Custom fields</h3>
                    <div class="custom__grid">
                        <div class="item__info__card item__info__card-custom"
                            v-for="(custom_field, index) in editedContact.custom_fields" :key="index">
                            <div class="item__info__icon">
                                <img :src="hashtagIcon" alt="hashtag icon" />
                            </div>
                            <div class="item__info__text">
                                <input type="text" class="item__label" name="custom_label"
                                    v-model="custom_field.label" />
                                <input type="text" class="item__value" name="custom_value"
                                    v-model="custom_field.value" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Button @click="handleUpdateContact" :disabled="state.isLoading">
                <Loader v-if="state.isLoading" />
                <span v-else class="btn__span">Update Contact</span>
            </Button>
        </div>
    </Modal>
</template>
<style lang="scss" scoped>
.input__h3 {
    font-size: $font-size-h3-desktop;
    font-weight: $font-weight-bold;
    color: var(--text-primary) !important;
    background-color: transparent;
    border: none;
    padding: .2rem .4rem;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        background-color: var(--bg-tertiary);
        border-radius: 0.2rem;
    }
}

.btn__span {
    font-size: $font-size-h3-desktop;
    font-weight: $font-weight-bold;
    color: $white-color !important;
}

.item {
    padding: 1rem;
    border-radius: $border-radius-sm;
    background-color: var(--bg-primary);
    display: grid;
    gap: $spacing-sm;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__text {
            display: flex;
            align-items: center;
            gap: $spacing-sm;
        }
    }

    & input {
        background-color: transparent;
        border: none;
        color: var(--text-primary);
        font-weight: $font-weight-semibold;
        padding: .2rem .4rem;
        transition: all 0.2s ease;

        &:focus {
            outline: none;
            background-color: var(--bg-tertiary);
            border-radius: 0.2rem;
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: $spacing-sm;

        & img {
            width: 1.8rem;
            height: auto;
        }

        &__action {
            padding: .8rem;
            border-radius: .4rem;
            border: 1px solid $dark-gray-color;

            &-delete {
                filter: brightness(0) saturate(100%) invert(22%) sepia(55%) saturate(6109%) hue-rotate(348deg) brightness(98%) contrast(92%);
            }
        }
    }


    &__avatar {
        display: table;
        padding: .8rem 1.1rem;
        background-color: $primary-light;
        border-radius: 50%;

        &__span {
            font-size: $font-size-h3-desktop;
            font-weight: $font-weight-bold;
            color: $primary-color;

            @include respond-to('mobile') {
                font-size: $font-size-h3-mobile;
            }
        }
    }

    &__text {
        display: grid;
        gap: .4rem;

        & p {
            font-weight: $font-weight-semibold;
        }
    }

    &__content {
        display: grid;
        gap: $spacing-sm;
    }

    &__info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-sm;

        &__card {
            background-color: var(--bg-secondary);
            border-radius: .6rem;
            border: 1px solid var(--card-border);
            box-shadow: 0 1px 4px var(--shadow-color);
            padding: .6rem .8rem;
            display: flex;
            gap: 1rem;
            align-items: center;

            & span {
                color: var(--text-secondary);
                font-weight: $font-weight-semibold;
            }

            &-custom {
                background-color: var(--primary-light);
                border-color: var(--primary-color);
            }
        }

        &__icon {
            padding: .4rem;
            background-color: $primary-light;
            border-radius: .4rem;

            & img {
                height: 2rem;
            }
        }

        &__text {
            display: grid;
            gap: .4rem;
        }

        @include respond-to('mobile') {
            grid-template-columns: 1fr;
        }
    }

    &__label {
        color: $primary-color !important;
        font-weight: $font-weight-regular;
    }

    &__value {
        font-weight: $font-weight-bold;
    }
}

.custom {
    display: grid;
    gap: $spacing-sm;

    &__grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-sm;

        @include respond-to('mobile') {
            grid-template-columns: 1fr;
        }
    }
}
</style>