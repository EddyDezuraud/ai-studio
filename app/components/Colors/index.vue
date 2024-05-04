<template>
    <div :class="$style.wrapper">
        <div :class="$style.color" v-for="color in colors" :key="color" :style="{background: color}">
            <span>{{ color }}</span>
        </div>
    </div>
</template>    

<script setup lang="ts">
interface Props {
    colors: string[]
}

defineProps<Props>();
</script>

<style module lang="scss">
.wrapper {
    display: flex;
    flex: 1;
    color: white;
    border-radius: var(--border-radius);
    overflow: hidden;

    > div:first-child {
        width: 35%;

        &:hover {
            width: 40%;
        }
    }

    > div:not(:first-child) {
        width: 15%;

        > span {
            position: absolute;
            opacity: 0;
        }

        &:hover {
            width: 25%;

            > span {
                opacity: 1;
            }
        }
    }
}

.color {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.2s;
    text-transform: uppercase
}
</style>