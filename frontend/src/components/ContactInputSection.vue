<script setup lang="ts">
import Card from '@/components/Card.vue';

/**
 * Contact section component props interface.
 * This interface defines the properties for the ContactSection component,
 * including the card heading, paragraph, and icon.
 */
export interface ContactInputSectionProps {
    cardHeading: string;
    cardParagraph: string;
    cardIcon: string;
}

const props = defineProps<ContactInputSectionProps>();
</script>

<template>
    <section class="contact-section">
        <div class="container">
            <Card :heading="props.cardHeading" :paragraph="props.cardParagraph" :icon="props.cardIcon">
                <template #additional>
                    <slot name="additional"></slot>
                </template>
                <slot></slot>
            </Card>
        </div>
    </section>
</template>

<style lang="scss" scoped></style>
