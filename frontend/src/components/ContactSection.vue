<script setup lang="ts">
import Card from '@/components/Card.vue';
import AIExtraction from '@/components/AIExtraction.vue';
import starIcon from '@/assets/icons/Star.png';
</script>

<template>
    <section class="contact-section">
        <div class="container">
            <Card heading="AI Contact Extraction" paragraph="Let AI find contacts from your meeting notes"
                :icon="starIcon">
                <AIExtraction />
            </Card>
        </div>
    </section>
</template>

<style lang="scss" scoped></style>
