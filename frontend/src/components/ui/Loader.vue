<script setup lang="ts">
interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<LoaderProps>(), {
    size: 'medium'
});
</script>

<template>
    <div class="loader" :class="{ [`loader-${props.size}`]: props.size }">
        <div class="loader__spinner"></div>
    </div>
</template>

<style scoped lang="scss">
.loader {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &-small {
        width: 1.6rem;
        height: 1.6rem;
    }

    &-medium {
        width: 2rem;
        height: 2rem;
    }

    &-large {
        width: 2.4rem;
        height: 2.4rem;
    }

    &__spinner {
        width: 100%;
        height: 100%;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
