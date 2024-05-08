<template>
    <header :class="$style.wrapper">
        <h1 :class="$style.label">Introducing <span>AI Studio</span></h1>
        <h2 :class="$style.title">A new way to styleguide</h2>
    </header>
</template>

<style module lang="scss">
.wrapper {
    padding: 120px 0;
    text-align: center;
    color: var(--dark);

    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 50%;
        width: 1000px;
        aspect-ratio: 1/1;
        border-radius: 50%;
        background: radial-gradient(var(--primary-color), var(--primary-color-0), var(--primary-color-0));
        transform: translate(-50%, -50%);
        filter: blur(20px);
        opacity: 0.2;
        z-index: -1;
        pointer-events: none;
    }
}

.label {
    color: var(--dark-900);
    font-size: 16px;
    font-weight: 500;

    > span {
        background-image: linear-gradient(to right, #8A61FF, #33CFBC);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}

.title {
    font-size: 64px;
    font-weight: 700;
    display: block;
    margin-top: 25px;
}

</style>