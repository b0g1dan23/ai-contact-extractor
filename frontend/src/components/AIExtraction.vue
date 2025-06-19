<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/ui/Button.vue';
import { useContactExtractionConsumer } from '@/providers/contactExtractionProvider';

/**
 * AI Extraction component props interface
 */
interface AIExtractionProps {
    /** Placeholder text for the textarea input */
    placeholder?: string;
}

const props = withDefaults(defineProps<AIExtractionProps>(), {
    placeholder: 'Today, I had an interview with Dustin & Andrei from HeyGov, their emails are dustin@heygov.com andrei@heygov.com'
});

const { extractContacts, state } = useContactExtractionConsumer();
const aiText = ref<string>('');

const handleExtract = async () => {
    if (aiText.value.trim()) {
        try {
            await extractContacts(aiText.value);
            aiText.value = '';
        } catch (error) {
            console.error('Failed to extract contacts:', error);
        }
    }
};
</script>

<template>
    <div class="extraction">
        <textarea v-model="aiText" rows="3" class="extraction__textarea" :placeholder="props.placeholder" />
        <Button @click="handleExtract" :disabled="!aiText.trim() || state.isLoading" variant="primary">
            {{ state.isLoading ? 'Extracting...' : '+' }}
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
        color: $black-color;
        padding: 1.2rem 1rem;
        border-radius: $border-radius;
        border: 1px solid $dark-gray-color;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;

        &:focus {
            outline: none;
            border-color: $primary-color;
            box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
        }

        &::placeholder {
            color: rgba($text-color, 0.6);
        }

        @include respond-to('mobile') {
            font-size: $font-size-text-mobile;
            padding: 1rem;
        }
    }
}
</style>
