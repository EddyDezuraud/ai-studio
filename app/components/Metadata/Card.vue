<template>
    <div :class="$style.wrapper">
        <div :class="$style.image" :style="{ backgroundImage: `url('${image}')` }"></div>
        <div :class="[$style.logo, {[$style.full] : logo.type === 'social'}]">
            <div v-if="logo.type === 'svg'" :class=$style.svg v-html="logo.src"></div>
            <img v-else :src="logo.src" :alt="`Logo ${name}`">
        </div>
        <div :class="$style.content">
            <span :class="$style.title">
                {{ name }}
            </span>
            <p :class="$style.description">
                {{ description }}
            </p>
        </div> 

    </div>
</template>

<script lang="ts" setup>
import type { Logo } from '@/types/Bento';

// title, description, image, logo are from props
const props = defineProps<{
    name: string;
    description: string;
    image: string;
    logo: Logo;
}>();

</script>

<style lang="scss" module>
.wrapper {
    border-radius: var(--border-radius);
    border: var(--border);
    width: 455px;
    overflow: hidden;
}

.image {
    width: 100%;
    height: 235px;
    background-size: cover;
}

.logo {
    margin: -65px 0 0 32px ;
    width: 125px;
    height: 125px;
    border-radius: var(--border-radius);
    padding: 10px;
    background: white;
    border: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    &.full {
        padding: 0;
    }

    .svg,
    svg,
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.content {
    padding: 34px;
}

.title {
    font-size: 32px;
    font-weight: 700;
    color: var(--dark)
}

.description {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--dark-900);
}
</style>