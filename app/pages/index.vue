<template>
    <div>
        <Header />
        <Searchbar @submit="onSubmitUrl" />

        <Loader v-if="isPending" />
        <Bento v-else-if="data" :config="data" />
    </div>
</template>    

<script setup lang="ts">

import type {StylesConfig} from '@/types/StylesConfig';
import { ref } from 'vue';

const queryUrl = ref('') as Ref<string>;

const isPending = computed(() => status.value === 'pending');

const {data, status, error, execute} = await useFetch<StylesConfig>('/api', {
    baseURL: 'http://localhost:3033',
    query: {
        url: queryUrl,
        lang: 'fr'
    },
    immediate: false
});

const onSubmitUrl = (url: string) => {
    queryUrl.value = url;
    execute();
};
</script>