<script lang="ts" setup>
import Search from './ui/Search.vue';
import ContactItem from './ContactItem.vue';
import { useContactExtractionConsumer } from '@/providers/contactExtractionProvider';
const { filteredContacts } = useContactExtractionConsumer();

const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    }
};
</script>
<template>
    <div class="contacts">
        <Search />
        <div class="contacts__list">
            <ContactItem v-if="filteredContacts.length" v-for="(contact, index) in filteredContacts" :key="index"
                :contact="contact" />
            <div v-else class="empty-state">
                <div class="empty-state__animation">
                    <div class="empty-state__circle">
                        <div class="empty-state__inner-circle"></div>
                        <div class="empty-state__pulse"></div>
                    </div>
                    <div class="empty-state__floating-icons">
                        <span class="floating-icon">👤</span>
                        <span class="floating-icon">📧</span>
                        <span class="floating-icon">📞</span>
                    </div>
                </div>
                <div class="empty-state__content">
                    <h3>No contacts yet</h3>
                    <p>Your contact list is waiting to be filled with amazing connections!</p>
                    <div class="empty-state__suggestions">
                        <button class="suggestion" @click="smoothScrollTo('ai-extraction')">✨ Extract from
                            text</button>
                        <button class="suggestion" @click="smoothScrollTo('manual-entry')">➕ Add manually</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.contacts {
    display: grid;
    gap: $spacing-lg;

    &__list {
        display: grid;
        gap: $spacing-sm;
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 3rem 2rem;
    min-height: 300px;
    justify-content: center;
    border-radius: 1.2rem;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
    border: 2px dashed rgba(99, 102, 241, 0.2);
    position: relative;
    overflow: hidden;

    &__animation {
        position: relative;
        margin-bottom: 2rem;
    }

    &__circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        animation: float 3s ease-in-out infinite;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    &__inner-circle {
        position: absolute;
        top: 15px;
        left: 15px;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        animation: pulse 2s ease-in-out infinite;
    }

    &__pulse {
        position: absolute;
        top: -10px;
        left: -10px;
        width: 140px;
        height: 140px;
        border-radius: 50%;
        border: 2px solid rgba(102, 126, 234, 0.3);
        animation: pulse-ring 2s ease-out infinite;
    }

    &__floating-icons {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .floating-icon {
        position: absolute;
        font-size: 2.4rem;
        animation: float-around 4s ease-in-out infinite;

        &:nth-child(1) {
            top: -60px;
            left: -30px;
            animation-delay: 0s;
        }

        &:nth-child(2) {
            top: -40px;
            right: -50px;
            animation-delay: 1.3s;
        }

        &:nth-child(3) {
            bottom: -50px;
            left: -20px;
            animation-delay: 2.6s;
        }
    }

    &__content {
        z-index: 2;

        h3 {
            color: $dark-gray-color;
            margin-bottom: 0.5rem;
        }

        p {
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }
    }

    &__suggestions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;

        .suggestion {
            padding: 0.5rem 1rem;
            background: rgba(99, 102, 241, 0.1);
            border-radius: 20px;
            color: #667eea;
            border: 1px solid rgba(99, 102, 241, 0.2);
            animation: gentle-bounce 2s ease-in-out infinite;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background: rgba(99, 102, 241, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
            }

            &:active {
                transform: translateY(0);
            }

            &:nth-child(2) {
                animation-delay: 0.5s;
            }
        }
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.7;
    }

    50% {
        transform: scale(1.1);
        opacity: 1;
    }
}

@keyframes pulse-ring {
    0% {
        transform: scale(0.8);
        opacity: 1;
    }

    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}

@keyframes float-around {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    25% {
        transform: translate(10px, -10px) rotate(90deg);
    }

    50% {
        transform: translate(-5px, -15px) rotate(180deg);
    }

    75% {
        transform: translate(-10px, 5px) rotate(270deg);
    }
}

@keyframes gentle-bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
}
</style>