<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import HeroSection from '@/components/HeroSection.vue';
import ContactInputSection from '@/components/ContactInputSection.vue';
import { useContactOperationsProvider } from '@/providers/contactOperationsProvider';
import AIExtraction from './components/AIExtraction.vue';
import starIcon from "@/assets/icons/Star.png"
import personIcon from "@/assets/icons/Person.png";
import peopleIcon from "@/assets/icons/People.png";
import ManualExtraction from '@/components/ManualExtraction.vue';
import Toast from 'primevue/toast';
import DisplayContacts from './components/DisplayContacts.vue';
import FilterButton from './components/ui/FilterButton.vue';
import { useContactFilteringProvider } from './providers/contactFilteringProvider';
import { computed, onMounted } from 'vue';

const { state, loadContacts } = useContactOperationsProvider();
const { filteredContacts } = useContactFilteringProvider(computed(() => state.contacts));

onMounted(async () => {
  await loadContacts();
});
</script>

<template>
  <AppHeader />
  <main>
    <HeroSection title="Contact Management"
      description="Add and manage your contacts with AI assistance or manual entry. Keep track of everyone you meet in one organized place." />
    <ContactInputSection card-heading="AI Contact Extraction"
      card-paragraph="Let AI find contacts from your meeting notes" :card-icon="starIcon" id="ai-extraction">
      <AIExtraction />
    </ContactInputSection>
    <ContactInputSection card-heading="Manual Entry" card-paragraph="Add contacts manually with detailed information"
      :card-icon="personIcon" id="manual-entry">
      <ManualExtraction />
    </ContactInputSection>
    <ContactInputSection card-heading="Your Contacts" :card-paragraph="`${filteredContacts.length} contact${filteredContacts.length > 1 ? 's' : ''
      }`" :card-icon="peopleIcon">
      <template #additional>
        <FilterButton />
      </template>
      <DisplayContacts />
    </ContactInputSection>
  </main>
  <Toast position="bottom-right" />
</template>

<style lang="scss" scoped></style>
