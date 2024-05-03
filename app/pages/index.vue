<template>
    <div>
        <Header />
        <Searchbar @submit="onSubmitUrl" />
    </div>
</template>    

<script setup lang="ts">
const onSubmitUrl = (url: string) => {
    console.log(url)
};
</script>