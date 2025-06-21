<template>
    <button @click="toggleTheme" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        class="theme-toggle">
        <span class="theme-toggle__icon">
            {{ isDark ? '☀️' : '🌙' }}
        </span>
    </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const isDark = ref(false);

const toggleTheme = () => {
    isDark.value = !isDark.value;
};

const applyTheme = (dark: boolean) => {
    if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Only save to localStorage if it's available
    try {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (e) {
        // localStorage not available (e.g., in some browsers or private mode)
        console.warn('localStorage not available for theme persistence');
    }
};

const loadTheme = () => {
    let saved = null;
    try {
        saved = localStorage.getItem('theme');
    } catch (e) {
        // localStorage not available
        console.warn('localStorage not available, using system preference');
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    isDark.value = saved ? saved === 'dark' : prefersDark;
    applyTheme(isDark.value);
};

// Watch for changes after the initial load
watch(isDark, applyTheme);

onMounted(loadTheme);
</script>

<style lang="scss" scoped>
.theme-toggle {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: $border-radius-sm;
    padding: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: var(--bg-tertiary);
        transform: scale(1.05);
    }

    &__icon {
        font-size: 1.8rem;
        display: block;
    }
}
</style>
