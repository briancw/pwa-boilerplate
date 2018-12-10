import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import createApp from './create_app.js'
import {gaDevId, gaProductionId} from '../config.js'

const {app, store, router} = createApp()

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

const gaId = (process.env.NODE_ENV === 'development') ? gaDevId : gaProductionId
Vue.use(VueAnalytics, {
    id: gaId,
    router,
})

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope)
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err)
        })
    })
}

router.onReady(() => {
    app.$mount('#app')
})
