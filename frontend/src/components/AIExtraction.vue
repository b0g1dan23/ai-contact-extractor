<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue';
import Button from '@/components/ui/Button.vue';
import { useContactOperationsConsumer } from '@/providers/contactOperationsProvider';
import { useToastNotifications } from '@/utils/toast';

/**
 * AI Extraction component props interface
 */
interface AIExtractionProps {
    placeholder?: string;
}

const props = withDefaults(defineProps<AIExtractionProps>(), {
    placeholder: 'Today, I had an interview with Dustin & Andrei from HeyGov, their emails are dustin@heygov.com andrei@heygov.com'
});

const Loader = defineAsyncComponent(() =>
    import('@/components/ui/Loader.vue')
);

const isMobile = ref<boolean>(false);

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 375;
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
})

const { showSuccessToast, showErrorToast } = useToastNotifications();

const { extractContacts, state } = useContactOperationsConsumer();
const aiText = ref<string>('');

const handleExtract = async () => {
    if (aiText.value.trim()) {
        try {
            await extractContacts(aiText.value);

            if (state.error) {
                showErrorToast(state.error, 'Extraction Error');
                return;
            }
            aiText.value = '';
            showSuccessToast('Contacts extracted successfully!', 'Extraction Success');
        } catch (error) {
            showErrorToast('Failed to extract contacts. Please try again.', 'Extraction Error');
        }
    }
};
</script>

<template>
    <div class="extraction">
        <textarea v-model="aiText" rows="3" class="extraction__textarea" :placeholder="props.placeholder" />
        <Button @click="handleExtract" :disabled="!aiText.trim() || state.isLoading" variant="primary">
            <Loader v-if="state.isLoading" size="small" />
            <span v-else class="btn__span">{{ isMobile ? 'Extract contacts with AI' : "+" }}</span>
        </Button>
    </div>
</template>

<style lang="scss" scoped>
.extraction {
    display: flex;
    align-items: center;
    gap: $spacing-lg;

    @include respond-to('tablet') {
        flex-direction: column;
        align-items: stretch;
    }

    &__textarea {
        flex: 1;
        resize: none;
        font-size: $font-size-text-desktop;
        font-family: $font-family-primary;
        color: var(--text-primary);
        background-color: var(--input-bg);
        padding: 1.2rem 1rem;
        border-radius: $border-radius;
        border: 1px solid var(--input-border);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;

        &:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(26, 99, 158, 0.1);
        }

        &::placeholder {
            color: var(--text-muted);
        }

        @include respond-to('mobile') {
            font-size: $font-size-text-mobile;
            padding: 1rem;
        }
    }
}

.btn__span {
    color: $white-color;
    font-size: $font-size-h3-desktop;

    @include respond-to('mobile') {
        font-size: $font-size-h4-desktop;
    }
}
</style>
