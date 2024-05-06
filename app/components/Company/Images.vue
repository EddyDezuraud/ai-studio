<template>
    <div :class="$style.wrapper">
        <div :class="$style.carousel" class="hide-x-bar">
            <div v-for="image in images" :key="image.src" :class="$style.image">
                <img :src="image.src" :alt="image.alt">
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Image } from '@/types/StylesConfig';

interface Props {
    images: Image[];
}

defineProps<Props>();
</script>

<style module lang="scss">
.wrapper {
    width: 100%;
    overflow: hidden;
    border-radius: var(--border-radius);
    height: 250px;
}

.carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: none;
    -webkit-overflow-scrolling: touch;
    height: calc(100% + 20px);

    img {
        max-height: 100%;
    }
}

.image {
    flex: 0 0 auto;
    scroll-snap-align: start;
}

.wrapper {
    width: 100%;
    overflow: hidden;
}
</style>