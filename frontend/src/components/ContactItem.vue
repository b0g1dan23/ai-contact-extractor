<script lang="ts" setup>
import { computed, ref } from 'vue';
import locationIcon from '@/assets/icons/Location.svg';
import phoneIcon from "@/assets/icons/phone.svg";
import emailIcon from '@/assets/icons/mail.svg';
import suitcaseIcon from '@/assets/icons/suitcase.svg';
import hashtagIcon from "@/assets/icons/hashtag.svg"

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
const { contact } = defineProps<{ contact: ContactItemProps }>();

const initial = computed(() => {
    if (contact.name) return contact.name.charAt(0);
    else if (contact.email) return contact.email.charAt(0);
    else return '';
})
</script>
<template>
    <div class="item">
        <div class="item__header" @click="isOpened = !isOpened">
            <div class="item__avatar">
                <span class="item__avatar__span">
                    {{ initial }}
                </span>
            </div>
            <div class="item__text">
                <h3>{{ contact.name ? contact.name : contact.email }}</h3>
                <p>{{ contact.company ? contact.company : "" }}</p>
            </div>
        </div>
        <Transition name="expand">
            <div class="item__content" v-if="isOpened">
                <div class="item__info"
                    v-if="contact.email || contact.location || contact.phone || contact.job_title || contact.custom_fields.length">
                    <div class="item__info__card" v-if="contact.location">
                        <div class="item__info__icon">
                            <img :src="locationIcon" alt="location icon" />
                        </div>
                        <span>{{ contact.location }}</span>
                    </div>
                    <div class="item__info__card" v-if="contact.phone">
                        <div class="item__info__icon">
                            <img :src="phoneIcon" alt="phone icon" />
                        </div>
                        <span>{{ contact.phone }}</span>
                    </div>
                    <div class="item__info__card" v-if="contact.email">
                        <div class="item__info__icon">
                            <img :src="emailIcon" alt="email icon" />
                        </div>
                        <span>{{ contact.email }}</span>
                    </div>
                    <div class="item__info__card" v-if="contact.job_title">
                        <div class="item__info__icon">
                            <img :src="suitcaseIcon" alt="suitcase icon" />
                        </div>
                        <span>{{ contact.job_title }}</span>
                    </div>
                </div>
                <div class="custom" v-if="contact.custom_fields.length">
                    <h3>Custom fields</h3>
                    <div class="custom__grid">
                        <div class="item__info__card item__info__card-custom"
                            v-for="(custom_field, index) in contact.custom_fields" :key="index">
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
    border: 1px solid $dark-gray-color;
    display: grid;
    gap: $spacing-sm;

    &__header {
        display: flex;
        align-items: center;
        gap: $spacing-sm;

        cursor: pointer;
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
            background-color: $light-gray-color;
            border-radius: .6rem;
            padding: .6rem .8rem;
            display: flex;
            gap: 1rem;
            align-items: center;

            & span {
                color: $dark-gray-color;
                font-weight: $font-weight-semibold;
            }

            &-custom {
                background-color: $primary-light;
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