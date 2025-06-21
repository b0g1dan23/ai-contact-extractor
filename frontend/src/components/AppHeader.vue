<script setup lang="ts">
import logoImage from '@/assets/logo.png';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
</script>

<template>
    <header class="header">
        <div class="container">
            <div class="header__brand">
                <img :src="logoImage" alt="City of Testville logo">
                <h2>City of Testville</h2>
            </div>
            <ThemeToggle />
        </div>
    </header>
</template>

<style lang="scss" scoped>
.header {
    border-bottom: 1px solid $light-gray-color;
    background: var(--bg-primary);

    & .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
    }

    &__brand {
        display: flex;
        gap: 1.2rem;
        align-items: center;
    }
}
</style>