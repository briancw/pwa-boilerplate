export default (siteName) => {
    /**
     * Get meta from a vue instance
     * @param  {Object} vm  A vue instance (I think)
     * @return {Boolean}     I'm not really sure
     */
    function getMeta(vm) {
        const {meta} = vm.$options
        if (meta) {
            return typeof meta === 'function' ? meta.call(vm) : meta
        }
    }

    const serverMetaMixin = {
        created() {
            if (this.$ssrContext) {
                // If no Meta has been created yet create one. Otherwise don't to avoid overwriting it if set by another component
                if (!this.$ssrContext.meta) {
                    this.$ssrContext.meta = {
                        title: siteName,
                    }
                }

                // If the component has a meta section, use those values
                const componentMeta = getMeta(this)
                if (componentMeta) {
                    if (componentMeta.title) {
                        if (componentMeta.useTitleOnly) {
                            this.$ssrContext.meta.title = componentMeta.title
                        } else {
                            this.$ssrContext.meta.title = `${componentMeta.title} | ${siteName}`
                        }
                    }

                    if (componentMeta.description) {
                        this.$ssrContext.meta.description = `<meta name="description" content="${componentMeta.description}">`
                        this.$ssrContext.meta.ogDescription = `<meta property="og:description" content="${componentMeta.description}">`
                        this.$ssrContext.meta.twitterDescription = `<meta name="twitter:description" content="${componentMeta.description}">`
                    }

                    if (componentMeta.image) {
                        this.$ssrContext.meta.ogImage = `<meta property="og:image" content="${componentMeta.image}">`
                        this.$ssrContext.meta.twitterImage = `<meta property="twitter:image" content="${componentMeta.image}">`
                    }

                    if (componentMeta.noIndex) {
                        this.$ssrContext.meta.robots = '<meta name="robots" content="noindex, nofollow">'
                    }
                }
            }
        },
    }

    const clientMetaMixin = {
        mounted() {
            const componentMeta = getMeta(this)
            if (componentMeta) {
                let title = siteName

                if (componentMeta.title) {
                    if (componentMeta.useTitleOnly) {
                        title = componentMeta.title
                    } else {
                        title = `${componentMeta.title} | ${siteName}`
                    }
                }

                document.title = title
            }
        },
    }

    return process.env.VUE_ENV === 'server' ? serverMetaMixin : clientMetaMixin
}
