<script lang="ts" setup>
import { useToastNotifications } from '@/utils/toast';
import { onErrorCaptured, ref } from 'vue';
import Button from './Button.vue';

interface ErrorBoundaryProps {
    fallbackMessage?: string;
    showRetry?: boolean;
}

interface ErrorInfo {
    message: string;
    stack?: string;
    componentStack?: string;
    timestamp: Date;
}

const { fallbackMessage, showRetry } = withDefaults(defineProps<ErrorBoundaryProps>(), {
    fallbackMessage: 'An unexpected error has occurred.',
    logErrors: false,
    showRetry: true
});

const emit = defineEmits<{
    error: [error: ErrorInfo];
    retry: [];
}>();

const hasError = ref(false);
const errorInfo = ref<ErrorInfo | null>(null);

onErrorCaptured((err: Error, instance, info: string) => {
    const errorDetails: ErrorInfo = {
        message: err.message,
        stack: err.stack,
        componentStack: info,
        timestamp: new Date()
    }

    hasError.value = true;
    errorInfo.value = errorDetails;

    emit('error', errorDetails);
    return false;
});

const retry = () => {
    hasError.value = false;
    errorInfo.value = null;
    emit('retry');
}

const reset = () => {
    hasError.value = false;
    errorInfo.value = null;
};

defineExpose({
    retry,
    reset,
    hasError: () => hasError.value,
    errorInfo: () => errorInfo.value
})
</script>
<template>
    <div class="error-boundary">
        <div v-if="hasError" class="error-boundary__fallback">
            <div class="error-boundary__content">
                <h3 class="error-boundary__title">Something went wrong</h3>
                <p class="error-boundary__message">{{ fallbackMessage }}</p>

                <div v-if="showRetry" class="error-boundary__actions">
                    <Button @click="retry" class="error-boundary__retry-btn" variant="outline">
                        🔄 Try Again
                    </Button>
                </div>
            </div>
        </div>
        <slot v-else />
    </div>
</template>
<style lang="scss" scoped>
.error-boundary {
    &__fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 1px dashed $primary-color;
        padding: 1.6rem .8rem;
        border-radius: $border-radius;

        & p {
            color: $primary-color;
        }
    }

    &__content {
        display: grid;
        gap: $spacing-sm;
    }
}
</style>