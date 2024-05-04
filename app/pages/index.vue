<template>
    <div>
        <Header />
        <Searchbar @submit="onSubmitUrl" />

        <Bento v-if="data" :config="data" />
    </div>
</template>    

<script setup lang="ts">

import type {StylesConfig} from '@/types/StylesConfig';
import { ref } from 'vue';

const queryUrl = ref('') as Ref<string>;

const {data, status, error, execute} = await useFetch<StylesConfig>('/api', {
    baseURL: 'http://localhost:3033',
    query: {
        url: queryUrl
    },
    immediate: false
});

const onSubmitUrl = (url: string) => {
    queryUrl.value = url;
    execute();
};
</script>