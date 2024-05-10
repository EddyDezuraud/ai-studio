<template>
    <div :class="$style.wrapper">
        <div :class="$style.content">
            Hello text
        </div>
        <div :class="$style.mockup">
            <div :class="$style.siteImg">
                <img src="" alt="">
            </div>
        </div> 
    </div>
</template>

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