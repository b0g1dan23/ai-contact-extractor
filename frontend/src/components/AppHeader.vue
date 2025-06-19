<script setup lang="ts">
import logoImage from '@/assets/logo.png';
</script>

<template>
    <header class="header">
        <div class="container">
            <img :src="logoImage" alt="City of Testville logo">
            <h2>City of Testville</h2>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.header {
    border-bottom: 1px solid $light-gray-color;

    & .container {
        display: flex;
        gap: 1.2rem;
        align-items: center;
    }
}
</style>