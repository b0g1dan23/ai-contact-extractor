<script lang="ts" setup>
import { useContactFilteringConsumer } from '@/providers/contactFilteringProvider';
import { onMounted, ref } from 'vue';

const getIcon = (iconName: 'search') => {
    const icons = {
        search: () => import('@/assets/icons/search.svg'),
    };
    return icons[iconName]?.();
};

const searchIcon = ref('');

onMounted(async () => {
    searchIcon.value = (await getIcon('search')).default;
})

const { searchTerm } = useContactFilteringConsumer();
</script>
<template>
    <div class="search">
        <input type="text" name="search" id="search"
            placeholder="Search contacts by name, email, company, job title, or phone" v-model="searchTerm">
        <img :src="searchIcon" alt="Search icon" class="search__icon">
    </div>
</template>
<style lang="scss" scoped>
.search {
    position: relative;

    & img {
        position: absolute;
        top: 50%;
        left: 1rem;
        transform: translateY(-50%);
    }

    &__icon {
        filter: var(--icon-filter);
    }

    & input {
        padding: 1.6rem;
        padding-left: calc(1rem + 1.6rem + 1rem);
    }
}
</style>