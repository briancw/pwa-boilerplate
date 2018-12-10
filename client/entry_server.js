import createApp from './create_app.js'

export default (context) => {
    const {app, router, store} = createApp()

    return new Promise((resolve, reject) => {
        router.push(context.url)

        router.onReady(() => {
            // The router has a catchAll route which has a meta key of isFourOhFour
            // This lets the SSR renderer to know it should send a status code of 404
            if (router.currentRoute.meta.isFourOfFour) {
                return reject({code: 404})
            }

            const matchedComponents = router.getMatchedComponents()
            Promise.all(matchedComponents.map(({asyncData}) => asyncData && asyncData({
                store,
                route: router.currentRoute,
            })))
            .then(() => {
                context.state = store.state
                resolve(app)
            })
            .catch(reject)
        }, reject)
    })
}
