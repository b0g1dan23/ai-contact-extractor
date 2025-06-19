<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import HeroSection from '@/components/HeroSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import { useContactExtractionProvider } from '@/providers/contactExtractionProvider';

useContactExtractionProvider();
</script>

<template>
  <AppHeader />
  <main>
    <HeroSection title="Contact Management"
      description="Add and manage your contacts with AI assistance or manual entry. Keep track of everyone you meet in one organized place." />
    <ContactSection />
  </main>
</template>

<style lang="scss" scoped></style>
