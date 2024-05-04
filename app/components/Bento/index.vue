<template>
    <div :class="$style.wrapper">
        <MetadataCard v-bind="metadata" />
    </div>
</template>

<script lang="ts" setup>
import type { StylesConfig } from '@/types/StylesConfig';
import type { Metadata } from '@/types/Bento';

interface Props {
    config: StylesConfig;
}

const props = defineProps<Props>();

const metadata = computed<Metadata>(() => {
    return {
        title: props.config.metaData.title,
        description: props.config.metaData.description,
        image: 'https://source.unsplash.com/random/800x600',
        logo: props.config.metaData.logos[0]
    };
});

</script>

<style lang="scss" module>
.wrapper {
    display: flex;
    max-width: 1330px;
    width: 100%;
    margin: 0 auto;
    padding: 50px 0 100px;
}
</style>