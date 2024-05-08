<template>
    <div>
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
const mode = ref('url') as Ref<string>;

const isPending = computed(() => status.value === 'pending');

const {data, status, error, execute} = await useFetch<StylesConfig>('/api', {
    baseURL: 'http://localhost:3033',
    query: {
        url: queryUrl,
        mode,
        lang: 'fr'
    },
    immediate: false
});

const onSubmitUrl = (res: {query: string, mode: string}) => {
    queryUrl.value = res.query;
    execute();
};
</script>