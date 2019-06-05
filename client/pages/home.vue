<template>
    <div>
        <h1>Home</h1>

        <div class="foo">
            Bar
        </div>

        <router-link to="/foo">Foo</router-link>
    </div>
</template>

<script>
export default {
    name: 'home',
    meta() {
        return {
            title: 'My Site Name | A nice tagline for this site',
            useTitleOnly: true,
            description: 'A nice breif site description',
            image: 'Image url',
            imageWidth: '1200', // Evidently optimal size for facebook, twitter, and linkedin
            imageHeight: '628',
            imageAlt: 'Alt text.',
            // relCanonical: 'An option to be cautious about',
        }
    },
}
</script>

<style lang="less">
@import '../styles/mixins.less';

.foo {
    color: blue;
}

</style>
