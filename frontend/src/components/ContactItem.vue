<script lang="ts" setup>
import { computed, ref, defineAsyncComponent, onMounted } from 'vue';
import { useContactOperationsConsumer } from '@/providers/contactOperationsProvider';
import { useToastNotifications } from '@/utils/toast';

const getIcon = (iconName: 'location' | 'phone' | 'email' | 'suitcase' | 'hashtag' | 'edit' | 'trash') => {
    const icons = {
        location: () => import("@/assets/icons/Location.svg"),
        phone: () => import("@/assets/icons/phone.svg"),
        email: () => import('@/assets/icons/mail.svg'),
        suitcase: () => import('@/assets/icons/suitcase.svg'),
        hashtag: () => import('@/assets/icons/hashtag.svg'),
        edit: () => import('@/assets/icons/Edit.svg'),
        trash: () => import('@/assets/icons/Trash.svg'),
    };
    return icons[iconName]?.();
};

const locationIcon = ref('');
const phoneIcon = ref('');
const emailIcon = ref('');
const suitcaseIcon = ref('');
const hashtagIcon = ref('');
const editIcon = ref('');
const trashIcon = ref('');

onMounted(async () => {
    locationIcon.value = (await getIcon('location')).default;
    phoneIcon.value = (await getIcon('phone')).default;
    emailIcon.value = (await getIcon('email')).default;
    suitcaseIcon.value = (await getIcon('suitcase')).default;
    hashtagIcon.value = (await getIcon('hashtag')).default;
    editIcon.value = (await getIcon('edit')).default;
    trashIcon.value = (await getIcon('trash')).default;
})

const ContactEditModal = defineAsyncComponent({
    loader: () => import('@/components/ContactEditModal.vue'),
    loadingComponent: () => import('@/components/ui/Loader.vue'),
    delay: 200,
    timeout: 3000,
});

type ContactItemProps = {
    company?: string;
    location?: string;
    phone?: string;
    job_title?: string;
    custom_fields: Array<{
        label: string;
        value: string;
    }>;
} & (
        | { name: string; email?: string }
        | { email: string; name?: string }
    );

const isOpened = ref<boolean>(false);
const props = defineProps<{ contact: ContactItemProps, index: number }>();
const modalOpened = ref<boolean>(false);
const { removeContact } = useContactOperationsConsumer();
const { showErrorToast, showSuccessToast } = useToastNotifications();

const initial = computed(() => {
    if (props.contact.name) return props.contact.name.charAt(0);
    else if (props.contact.email) return props.contact.email.charAt(0);
    else return '';
})

const handleToggleModal = () => {
    modalOpened.value = !modalOpened.value;
}

const handleRemoveContact = async () => {
    const deletionResult = removeContact(props.index);

    if (deletionResult.success) {
        showSuccessToast('Contact removed successfully!', 'Deletion Success');
    } else {
        showErrorToast(deletionResult.error || 'Failed to remove contact. Please try again.', 'Deletion Error');
    }
};
</script>
<template>
    <ContactEditModal v-if="modalOpened" v-on:handle-close="handleToggleModal" :contact="props.contact"
        :initial="initial" />
    <div class="item">
        <div class="item__header" @click="isOpened = !isOpened">
            <div class="item__header__text">
                <div class="item__avatar">
                    <span class="item__avatar__span">
                        {{ initial }}
                    </span>
                </div>
                <div class="item__text">
                    <h3>{{ props.contact.name ? props.contact.name : props.contact.email }}</h3>
                    <p>{{ props.contact.company ? props.contact.company : "" }}</p>
                </div>
            </div>
            <div class="item__actions">
                <button class="item__actions__action" @click.stop="handleToggleModal">
                    <img :src="editIcon" alt="Edit icon" class="item__actions__action-edit" />
                </button>
                <button class="item__actions__action" @click.stop="handleRemoveContact">
                    <img :src="trashIcon" alt="Trash icon" class="item__actions__action-delete" />
                </button>
            </div>
        </div>
        <Transition name="expand">
            <div class="item__content" v-if="isOpened">
                <div class="item__info"
                    v-if="props.contact.email || props.contact.location || props.contact.phone || props.contact.job_title || props.contact.custom_fields.length">
                    <div class="item__info__card" v-if="props.contact.location">
                        <div class="item__info__icon">
                            <img :src="locationIcon" alt="location icon" />
                        </div>
                        <span>{{ props.contact.location }}</span>
                    </div>
                    <div class="item__info__card" v-if="props.contact.phone">
                        <div class="item__info__icon">
                            <img :src="phoneIcon" alt="phone icon" />
                        </div>
                        <span>{{ props.contact.phone }}</span>
                    </div>
                    <div class="item__info__card" v-if="props.contact.email">
                        <div class="item__info__icon">
                            <img :src="emailIcon" alt="email icon" />
                        </div>
                        <span>{{ props.contact.email }}</span>
                    </div>
                    <div class="item__info__card" v-if="props.contact.job_title">
                        <div class="item__info__icon">
                            <img :src="suitcaseIcon" alt="suitcase icon" />
                        </div>
                        <span>{{ props.contact.job_title }}</span>
                    </div>
                </div>
                <div class="custom" v-if="props.contact.custom_fields.length">
                    <h3>Custom fields</h3>
                    <div class="custom__grid">
                        <div class="item__info__card item__info__card-custom"
                            v-for="(custom_field, index) in props.contact.custom_fields" :key="index">
                            <div class="item__info__icon">
                                <img :src="hashtagIcon" alt="hashtag icon" />
                            </div>
                            <div class="item__info__text">
                                <span class="item__label">{{ custom_field.label }}</span>
                                <span class="item__value">{{ custom_field.value }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
<style lang="scss" scoped>
.item {
    padding: 1rem;
    border-radius: $border-radius-sm;
    border: 1px solid var(--card-border);
    background-color: var(--bg-primary);
    box-shadow: 0 2px 8px var(--shadow-color);
    display: grid;
    gap: $spacing-sm;
    transition: box-shadow 0.3s ease, border-color 0.3s ease;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        cursor: pointer;

        &__text {
            display: flex;
            align-items: center;
            gap: $spacing-sm;
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
            border: 1px solid var(--card-border);
            background-color: var(--bg-secondary);
            transition: background-color 0.2s ease;

            &:hover {
                background-color: var(--bg-tertiary);
            }

            &-edit {
                filter: var(--icon-filter);
            }

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

.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.expand-enter-from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
}

.expand-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
    max-height: 500px;
    opacity: 1;
    transform: translateY(0);
}
</style>