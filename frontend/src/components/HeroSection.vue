<script setup lang="ts">
interface HeroSectionProps {
    title: string;
    description: string;
}

const props = defineProps<HeroSectionProps>();
</script>

<template>
    <section class="hero-section">
        <div class="container">
            <h2>{{ props.title }}</h2>
            <p>{{ props.description }}</p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.hero-section {
    text-align: center;
    border-bottom: 1px solid $light-gray-color;

    .container {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
    }

    h2 {
        font-size: $font-size-h2-desktop;
        color: $primary-color;
        font-weight: $font-weight-bold;

        @include respond-to('mobile') {
            font-size: $font-size-h2-mobile;
        }
    }

    p {
        font-size: $font-size-text-desktop;
        color: $text-color;
        max-width: 600px;
        margin: 0 auto;

        @include respond-to('mobile') {
            font-size: $font-size-text-mobile;
        }
    }
}
</style>
