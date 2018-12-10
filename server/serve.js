const path = require('path')
const fs = require('fs')
const express = require('express')
const helmet = require('helmet')
const expressStaticGzip = require('express-static-gzip')
const app = express()
const {frontendPort} = require('../config.js')
const bodyParser = require('body-parser')

// Apply some useful plugins like helmet (security) and bodyParser (post param decoding)
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Service workers should be loaded from / instead of a directory like /dist/
app.use('/service-worker.js', express.static(path.resolve(__dirname, '../dist/service-worker.js')))

app.use('/', expressStaticGzip(path.resolve(__dirname, '../', 'public'), {
    enableBrotli: true,
    indexFromEmptyFile: false,
}))

app.use('/dist/', expressStaticGzip(path.resolve(__dirname, '../', 'dist'), {
    enableBrotli: true,
    indexFromEmptyFile: false,
}))

// If in development, load resources from HMR server
if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode!')
    let render

    require('./hmr.js')(app, (serverBundle, clientManifest, template) => {
        render = require('./ssr_renderer.js')(clientManifest, serverBundle, template)
    })

    // TODO move default meta somewhere
    // TODO comment on why default meta exists
    app.get('*', (req, res) => {
        if (render) {
            const context = {
                url: req.url,
                meta: {
                    title: 'Default Title',
                },
                fullUrl: 'https://' + req.get('host') + req.originalUrl,
            }

            render(req, res, context)
        } else {
            res.send('Compiling, reload in a moment.')
        }
    })

} else {
    // If in production, load the client and server files to be served
    console.log('Server is running in production mode')

    const clientManifest = require('../dist/vue-ssr-client-manifest.json')
    const serverBundlePath = '../dist/vue-ssr-server-bundle.json'
    const template = fs.readFileSync(path.resolve('./dist/index.html'), 'utf8')
    let serverBundle = require(serverBundlePath)
    // A few wrappers that set headers and set up streaming hooks.
    let render = require('./ssr_renderer.js')(clientManifest, serverBundle, template)

    app.get('*', (req, res) => {
        const context = {
            url: req.url,
            meta: {
                title: 'Default Title',
            },
            fullUrl: 'https://' + req.get('host') + req.originalUrl,
        }

        render(req, res, context)
    })
}

app.listen(frontendPort, (err) => {
    if (err) {
        throw err
    }
    console.log(`Listening on port ${frontendPort}`)
})
