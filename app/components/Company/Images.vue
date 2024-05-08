<template>
    <div :class="$style.wrapper">
        <div :class="$style.grid">
            <div v-for="image in images" :key="image.src" :class="$style.image" :style="{background: `url(${image.src})`, backgroundSize: 'cover', backgroundPosition: 'center'}"></div>
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
    height: var(--bento-line-height);
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0px;
    height: 100%;

    > * {
        grid-column: span 2;
    }
}

.image {
    width: 100%;
    height: 100%;
    border-radius: 0px;
    display: block;
}
</style>