<script lang="ts" setup>
/**
 * Button component props interface
 */
interface ButtonProps {
    /** Whether the button is disabled */
    disabled?: boolean;
    /** HTML button type attribute */
    type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<ButtonProps>(), {
    disabled: false,
    type: 'button'
});

/**
 * Button component emits interface
 */
const emit = defineEmits<{
    /** Emitted when button is clicked */
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
        { 'btn-disabled': props.disabled }
    ]" @click="handleClick">
        <span class="btn__content">
            <slot></slot>
        </span>
    </button>
</template>
<style lang="scss" scoped>
.btn {
    border-radius: .4rem;
    background-color: $primary-color;
    padding: .8rem 1.4rem;
    color: $white-color;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: translateY(0);

    &:hover:not(:disabled) {
        background-color: darken($primary-color, 10%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba($primary-color, 0.3);
    }

    &:active:not(:disabled) {
        transform: translateY(1px) scale(0.98);
        box-shadow: 0 2px 8px rgba($primary-color, 0.4);
        background-color: darken($primary-color, 15%);
        transition: all 0.1s ease;
    }

    & span {
        font-size: $font-size-h3-desktop;
        font-weight: $font-weight-bold;
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