<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="close-icon">
        <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41l5.59 5.59L5 17.59 6.41 19l5.59-5.59L17.59 19 19 17.59l-5.59-5.59L19 6.41z" />
    </svg>
</template>

<style lang="scss" scoped>
.close-icon {
    fill: var(--text-primary);
    transition: fill 0.3s ease;
}

[data-theme="dark"] .close-icon {
    fill: var(--text-primary);
}
</style>