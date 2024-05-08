<template>
    <div :style="setStyleVariables">
        <Header />
        <Searchbar @submit="onSubmitUrl" :pending="isPending" />

        <Loader v-if="isPending" />
        <Bento v-else-if="data" :config="data" />
    </div>
</template>    

<script setup lang="ts">

import type {StylesConfig} from '@/types/StylesConfig';
import { ref } from 'vue';

useHead({
  title: 'Studio AI - Styleguide bento research',
})


const queryUrl = ref('') as Ref<string>;
const mode = ref('name') as Ref<string>;

const isPending = computed(() => status.value === 'pending');

const {data, status, error, execute} = await useFetch<StylesConfig>('/api', {
    baseURL: 'http://localhost:3033',
    query: {
        url: queryUrl,
        mode,
        lang: 'fr'
    },
    immediate: false,
    deep: false,
    server: true
});

const onSubmitUrl = (res: {query: string, mode: string}) => {
    queryUrl.value = res.query;
    mode.value = res.mode;
    console.log('submitting...');
    execute();
};

const setStyleVariables = computed(() => {

    if(!data) return;
    if(!data.value || !data.value.colors) return;

    return {
        '--brand-color-primary': data.value.colors.primary,
        '--brand-color-primary-0': data.value.colors.primary + '00'
    }
});
</script>

<style lang="scss" module>
body {
    &::before {
        position: absolute;
        content : '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        background-image: linear-gradient(to left bottom, var(--brand-color-primary), var(--brand-color-primary-0), var(--brand-color-primary-0));
        opacity: 0.2;
    }
}
</style>