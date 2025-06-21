<script setup lang="ts">
import { Teleport } from 'vue';
import CloseIcon from '../icons/CloseIcon.vue';

interface ModalProps {
    title?: string;
}
const props = withDefaults(defineProps<ModalProps>(), {
    title: 'Modal Title'
});
const emit = defineEmits<{
    handleClose: [];
}>();
</script>
<template>
    <Teleport to='body'>
        <div class="modal" @click.stop="emit('handleClose')">
            <div class="modal__item" @click.stop>
                <div class="modal__header">
                    <h2 class="modal__title">{{ props.title }}</h2>
                    <button class="modal__close" @click="emit('handleClose')">
                        <CloseIcon />
                    </button>
                </div>
                <div class="modal__content">
                    <slot />
                </div>

            </div>
        </div>
    </Teleport>
</template>
<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: $shadow;
    backdrop-filter: blur(3px);
    animation: blurIn .3s ease-in-out;

    &__item {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 1080px;
        width: 100%;
        animation: dropIn .3s ease-in-out;

        background-color: $white-color;
        padding: 1.6rem;
        border-radius: $border-radius-sm;
    }

    &__header {
        display: flex;
        justify-content: space-between;
    }
}

@keyframes blurIn {
    0% {
        backdrop-filter: blur(0);
    }

    100% {
        backdrop-filter: blur(3px);
    }
}

@keyframes dropIn {
    0% {
        transform: translate(-50%, -100%) scale(0.5) rotateY(-30deg);
        opacity: 0;
    }

    50% {
        transform: translate(-50%, -45%) scale(1.05) rotateY(0deg);
        opacity: 0.8;
    }

    100% {
        transform: translate(-50%, -50%) scale(1) rotateY(0deg);
        opacity: 1;
    }
}
</style>