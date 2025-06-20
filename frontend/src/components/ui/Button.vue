<script lang="ts" setup>
interface ButtonProps {
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'outline';
}

const props = withDefaults(defineProps<ButtonProps>(), {
    disabled: false,
    type: 'button',
    variant: 'primary'
});

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
    if (!props.disabled) {
        emit('click', event);
    }
};
</script>

<template>
    <button :type="props.type" :disabled="props.disabled" :class="[
        'btn',
        `btn-${props.variant}`,
        { 'btn-disabled': props.disabled }
    ]" @click="handleClick">
        <span class="btn__content">
            <slot></slot>
        </span>
    </button>
</template>
<style lang="scss" scoped>
@use 'sass:color';

.btn {
    border-radius: .4rem;
    background-color: $primary-color;
    padding: .8rem 1.4rem;
    color: $white-color;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: translateY(0);
    white-space: nowrap;

    & span {
        font-size: $font-size-h3-desktop;
        font-weight: $font-weight-bold;
        color: $white-color;
    }

    &-outline {
        background-color: $white-color;
        border: 1px solid $primary-color;

        & span {
            color: $primary-color;
            font-size: $font-size-text-desktop;
            font-weight: $font-weight-regular;

            @include respond-to('mobile') {
                font-size: $font-size-text-mobile;
            }
        }
    }

    &-primary {
        &:hover:not(:disabled) {
            background-color: color.scale($primary-color, $lightness: -10%);
        }

        &:active:not(:disabled) {
            background-color: color.scale($primary-color, $lightness: -15%);
            transition: all 0.1s ease;
        }
    }

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba($primary-color, 0.3);
    }

    &:active:not(:disabled) {
        transform: translateY(1px) scale(0.98);
        box-shadow: 0 2px 8px rgba($primary-color, 0.4);
        transition: all 0.1s ease;
    }

    &__content {
        color: $white-color;
    }

    &-disabled,
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }
}
</style>