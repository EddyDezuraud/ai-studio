<template>
    <div :class="$style.wrapper" :style="{'--primary-color': primaryColor}">
        <div :class="$style.line">
            <MetadataCard v-bind="metadata" />
            <div :class="$style.right">
                <div :class="$style.topRight">
                    <CompanyEmployees :employees :linkedin-url="linkedinUrl" />
                    <CompanyImages :images="images" />
                </div>
            </div>
        </div>
        <div>
            <Colors :colors="config.colors" />
        </div>

        <div>
            <WebsiteResponsive :screenshots="config.screenshots" />
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import type { StylesConfig, Employee } from '@/types/StylesConfig';
import type { Metadata, Logo } from '@/types/Bento';

interface Props {
    config: StylesConfig;
}

const props = defineProps<Props>();

const metadata = computed<Metadata>(() => {
    const logo: Logo = props.config.socials.linkedin?.logo ? {src: props.config.socials.linkedin?.logo, type: "social"} : props.config.metaData.logos[0];
    return {
        name: props.config.metaData.name,
        description: props.config.metaData.description,
        image: props.config.images.length > 0 ? props.config.images[0].src : 'https://unsplash.it/1200/630',
        logo
    };
});

const employees = computed<Employee[]>(() => {
    const list = props.config.socials.linkedin?.employees || [];
    // sort the ones with a position at first and then by name
    return list.sort((a, b) => {
        if (a.position && !b.position) return -1;
        if (!a.position && b.position) return 1;
        return a.name.localeCompare(b.name);
    });
});

const linkedinUrl = computed(() => {
    return props.config.socials.linkedin?.url || 'https://linkedin.com';
});

const images = computed(() => {
    // return the images from the config expect the first one
    return props.config.images.slice(1);
});

const primaryColor = computed(() => {
    return props.config.colors.primary;
});

</script>

<style lang="scss" module>
.wrapper {
    display: flex;
    flex-direction: column;
    max-width: 1330px;
    width: 100%;
    margin: 0 auto;
    padding: 50px 0 100px;
    gap: var(--bento-gap);
}

.line {
    display: flex;
    gap: var(--bento-gap);
    width: 100%;
}

.right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--bento-gap);

    > * {
        flex: 1;
    }
}

.topRight {
    display: flex;
    gap: var(--bento-gap);

    > * {
        flex: 1;
    }
}
</style>