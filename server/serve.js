const path = require('path')
const fs = require('fs')
const express = require('express')
const helmet = require('helmet')
const expressStaticGzip = require('express-static-gzip')
const app = express()
const {frontendPort} = require('../config.js')
const isDevelopment = (process.env.NODE_ENV === 'development')

// Apply some useful plugins like helmet (security) and bodyParser (post param decoding)
app.use(helmet())

// The caching service worker must be loaded from / to be allowed to cache everything necessary
app.use('/service-worker.js', express.static(path.resolve(__dirname, '../dist/service-worker.js')))

// Serve any static files in public
app.use('/', expressStaticGzip(path.resolve(__dirname, '../', 'public'), {
    enableBrotli: true,
    indexFromEmptyFile: false,
}))

// Serve compiled resources
app.use('/dist/', expressStaticGzip(path.resolve(__dirname, '../', 'dist'), {
    enableBrotli: true,
    indexFromEmptyFile: false,
}))

/**
 * @function getRenderer
 * @return {function} An instance of the Vue SSR Renderer
 */
function getRenderer() {
    if (isDevelopment) {
        require('./hmr.js')(app, (serverBundle, clientManifest, template) => {
            return require('./ssr_renderer.js')(clientManifest, serverBundle, template)
        })
    }

    let clientManifest = JSON.parse(fs.readFileSync('./dist/vue-ssr-client-manifest.json', 'utf8'))
    let serverBundle = JSON.parse(fs.readFileSync('./dist/vue-ssr-server-bundle.json', 'utf8'))
    let template = fs.readFileSync(path.resolve('./dist/index.html'), 'utf8')
    return require('./ssr_renderer.js')(clientManifest, serverBundle, template)
}

const render = getRenderer()

app.get('*', (req, res) => {
    const context = {
        url: req.url,
        fullUrl: 'https://' + req.get('host') + req.originalUrl,
    }

    render(req, res, context)
})

app.listen(frontendPort, (err) => {
    if (err) {
        throw err
    }
    console.log(`Running in ${process.env.NODE_ENV} mode`)
    console.log(`Listening on port ${frontendPort}`)
})
