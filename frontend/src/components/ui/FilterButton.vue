<script lang="ts" setup>
import filterIcon from '@/assets/icons/filter-icon.svg';
import { ref, onMounted, onUnmounted } from 'vue';
import { useContactFilteringConsumer } from '@/providers/contactFilteringProvider';
import { ContactFilter } from '@/types';

const { toggleFilter, isFilterActive, activeFilters } = useContactFilteringConsumer();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement>();

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const handleFilterClick = (filterType: ContactFilter) => {
    toggleFilter(filterType);
};

const handleClickOutside = (event: Event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
    <div class="filter-container" ref="dropdownRef">
        <button class="filter-button" @click="toggleDropdown" :class="{ 'active': activeFilters.size > 0 }">
            <img :src="filterIcon" alt="Filter Icon" />
            <span class="filter-text">Filters</span>
            <span v-if="activeFilters.size > 0" class="filter-count">{{ activeFilters.size }}</span>
        </button>

        <Transition name="dropdown">
            <div v-if="isOpen" class="filter-dropdown">
                <div class="filter-option" @click="handleFilterClick(ContactFilter.HAS_EMAIL)"
                    :class="{ 'active': isFilterActive(ContactFilter.HAS_EMAIL) }">
                    <span class="filter-icon">📧</span>
                    <span class="filter-label">Has Email</span>
                    <span v-if="isFilterActive(ContactFilter.HAS_EMAIL)" class="check-mark">✓</span>
                </div>

                <div class="filter-option" @click="handleFilterClick(ContactFilter.HAS_LOCATION)"
                    :class="{ 'active': isFilterActive(ContactFilter.HAS_LOCATION) }">
                    <span class="filter-icon">📍</span>
                    <span class="filter-label">Has Location</span>
                    <span v-if="isFilterActive(ContactFilter.HAS_LOCATION)" class="check-mark">✓</span>
                </div>
            </div>
        </Transition>
    </div>
</template>
<style lang="scss" scoped>
.filter-container {
    position: relative;
    display: inline-block;
}

.filter-button {
    border-radius: .4rem;
    padding: .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    border: 1px solid $dark-gray-color;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        border-color: $primary-color;
        background: rgba($primary-color, 0.02);
    }

    &.active {
        border-color: $primary-color;
        background: rgba($primary-color, 0.05);
    }

    .filter-text {
        font-size: $font-size-text-desktop;
        font-weight: $font-weight-regular;
        color: $black-color;

        @include respond-to('mobile') {
            display: none;
        }
    }

    .filter-count {
        background: $primary-color;
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 600;
        min-width: 18px;
    }
}

.filter-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid $dark-gray-color;
    border-radius: $border-radius-sm;
    text-wrap: nowrap;
    box-shadow: $shadow;
    z-index: 1000;
    overflow: hidden;
    margin-top: 0.5rem;

    @include respond-to('mobile') {
        right: auto;
        right: 0;
        min-width: 180px;
    }
}

.filter-option {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-bottom: 1px solid rgba($light-gray-color, 0.5);

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: rgba($primary-color, 0.05);
    }

    &.active {
        background: rgba($primary-color, 0.1);
        color: $primary-color;
    }

    .filter-icon {
        font-size: 1rem;
        flex-shrink: 0;
    }

    .filter-label {
        flex: 1;
        font-size: $font-size-text-desktop;
        font-weight: $font-weight-regular;
    }

    .check-mark {
        color: $primary-color;
        font-weight: 600;
        font-size: 0.875rem;
    }
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>