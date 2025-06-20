<script lang="ts" setup>
import searchIcon from '@/assets/icons/search.svg';
import { useContactExtractionConsumer } from '@/providers/contactExtractionProvider';

const { searchTerm } = useContactExtractionConsumer();
</script>
<template>
    <div class="search">
        <input type="text" name="search" id="search"
            placeholder="Search contacts by name, email, company, job title, or phone" v-model="searchTerm">
        <img :src="searchIcon" alt="Search icon">
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

    & input {
        padding: 1.6rem;
        padding-left: calc(1rem + 1.6rem + 1rem);
    }
}
</style>