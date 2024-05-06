<template>
    <div :class="$style.wrapper">
        <div :class="$style.color" v-for="color in colorsList" :key="color.hex" :style="{background: color.hex}">
            <div :class="$style.header">
                <span v-if="color.title" :class="$style.title">
                    {{ color.title }}
                </span>
                <span :class="$style.desc">
                    {{ color.description }}
                </span>
            </div> 

            <span :class="$style.hex">{{ color.hex }}</span>
        </div>
    </div>
</template>    

<script setup lang="ts">

import type { Colors, Color } from '@/types/StylesConfig';

interface Props {
    colors: Colors
}

const props = defineProps<Props>();

const colorsList: ComputedRef<Color[]> = computed(() => {
    // select the 2 first logo colors and the 3 first website colors
    const colors :Color[] = [];
    for (let i = 0; i < 2; i++) {
        if(!props.colors.logo[i]) break;
        colors.push({
            hex: props.colors.logo[i].hex,
            title: 'Logo',
            description: i === 0 ? 'Primary color' : 'Secondary color'
        });
    }

    for (let i = 0; i < 3; i++) {
        if(!props.colors.website[i]) break;
        colors.push({
            hex: props.colors.website[i].hex,
            title: 'Website',
            description: `Color ${i + 1}`
        });
    }


    return colors;
})

</script>

<style module lang="scss">
.wrapper {
    display: flex;
    flex: 1;
    color: white;
    border-radius: var(--border-radius);
    overflow: hidden;
}

.color {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: flex-start;
    justify-content: space-between;
    transition: width 0.2s;
}

.header {
    font-size: 12px;
    display: flex;
    flex-direction: column;
}

.title {
    font-weight: 700
}

.hex {
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase
}
</style>