<script lang="ts" setup>
/**
 * Card component props interface
 */
interface CardProps {
    /** Card heading text */
    heading: string;
    /** Card description/paragraph text */
    paragraph: string;
    /** Path to the card icon image */
    icon: string;
    /** Whether the card is disabled */
    disabled?: boolean;
}

const props = withDefaults(defineProps<CardProps>(), {
    disabled: false
});
</script>

<template>
    <div class="card" :class="{ 'card-disabled': props.disabled }" role="article" :aria-disabled="props.disabled">
        <div class="card__top">
            <div class="card__icon">
                <img :src="props.icon" :alt="`${props.heading} icon`" loading="lazy" />
            </div>
            <div class="card__text">
                <h3>{{ props.heading }}</h3>
                <p>{{ props.paragraph }}</p>
            </div>
        </div>
        <div class="card__content">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
    border-radius: $border-radius-md;
    border: 1px solid $light-gray-color;
    display: grid;
    gap: $spacing-lg;
    padding: 1.6rem;
    box-shadow: $shadow;
    animation: cardEnter 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0;
    transform: translateY(50px) scale(0.9);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px 0 rgba($black-color, 0.12);
        border-color: rgba($primary-color, 0.3);
    }

    @keyframes cardEnter {
        0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9) rotateX(15deg);
            box-shadow: 0 0 0 0 rgba($black-color, 0);
        }

        50% {
            opacity: 0.7;
            transform: translateY(10px) scale(0.95) rotateX(8deg);
            box-shadow: 0 5px 15px 0 rgba($black-color, 0.1);
        }

        100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
            box-shadow: $shadow;
        }
    }

    &__icon {
        padding: .8rem;
        border-radius: $border-radius-md;
        background-color: $primary-light;
        animation: iconBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s forwards;
        opacity: 0;
        transform: scale(0);
    }

    @keyframes iconBounce {
        0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
        }

        60% {
            opacity: 1;
            transform: scale(1.1) rotate(10deg);
        }

        100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }

    &__top {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
    }

    &__text {
        display: grid;
        gap: $spacing-xs;

        h3 {
            animation: textSlideIn 0.4s ease-out 0.3s forwards;
            opacity: 0;
            transform: translateX(-30px);
        }

        p {
            animation: textSlideIn 0.4s ease-out 0.4s forwards;
            opacity: 0;
            transform: translateX(-30px);
        }
    }

    @keyframes textSlideIn {
        0% {
            opacity: 0;
            transform: translateX(-30px);
        }

        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    &__content {
        animation: contentFadeIn 0.5s ease-out 0.5s forwards;
        opacity: 0;
        transform: translateY(20px);
    }

    @keyframes contentFadeIn {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }

        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    &-disabled {
        opacity: 0.6;
        pointer-events: none;
        filter: grayscale(1);
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;

        .card__icon,
        .card__text h3,
        .card__text p,
        .card__content {
            animation: none;
            opacity: 1;
            transform: none;
        }
    }
}
</style>