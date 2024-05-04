<template>

    <div :class="$style.wrapper">
        <div :class="$style.image" :style="`background: url(${image})`"></div>
        <div :class="$style.logo">
            <img :src="logo" :alt="`Logo ${title}`">
        </div>
        <div :class="$style.content">
            <span :class="$style.title">
                {{ title }}
            </span>
            <p :class="$style.description">
                {{ description }}
            </p>
        </div> 

    </div>

</template>

<script lang="ts" setup>

// title, description, image, logo are from props
const props = defineProps<{
    title: string;
    description: string;
    image: string;
    logo: string;
}>();

</script>

<style lang="scss" module>
.wrapper {
    border-radius: var(--border-radius);
}
</style>