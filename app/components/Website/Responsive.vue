<template>
    <div :class="$style.wrapper">
        <div :class="$style.content">
            Hello text
        </div>
        <div :class="$style.mockup">
            <div :class="$style.siteImg">
                <img :src="mobile" alt="">
                <img :src="desktop" alt="">
            </div>
        </div> 
    </div>
</template>

<script setup lang="ts">
import type { Screenshots } from '@/types/StylesConfig';

interface Props {
    screenshots: Screenshots;
}

const props = defineProps<Props>();

const mobile = computed(() => 'data:image/png;base64, ' + props.screenshots.mobile);
const desktop = computed(() => 'data:image/png;base64, ' + props.screenshots.desktop);

</script>

<style lang="scss" module>
.wrapper {
    display: flex;
    width: 300px;
    height: 400px;
}

.mockup {
    background: url('~/assets/images/iphone-mockup.png') no-repeat contain;
}
</style>