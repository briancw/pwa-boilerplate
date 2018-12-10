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

let render

/**
 * @function getRenderer
 * @return {function} An instance of the Vue SSR Renderer
 */
if (isDevelopment) {
    // Set default render in case there is a request before inital pack.
    render = (req, res) => res.send('Compiling, reload in a moment.')
    // Add hot middleware and create a new render function each time both client and server have finished packing.
    require('./hmr.js')(app, (serverBundle, clientManifest, template) => {
        render = require('./ssr_renderer.js')(clientManifest, serverBundle, template)
    })
// If in production, load the client and server files to be served.
} else {
    const template = fs.readFileSync(path.resolve('./dist/index.html'), 'utf8')
    const serverBundle = JSON.parse(fs.readFileSync('./dist/vue-ssr-server-bundle.json', 'utf8'))
    const clientManifest = JSON.parse(fs.readFileSync('./dist/vue-ssr-client-manifest.json', 'utf8'))
    render = require('./ssr_renderer.js')(clientManifest, serverBundle, template)
}

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
