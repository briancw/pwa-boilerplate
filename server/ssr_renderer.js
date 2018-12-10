const {createBundleRenderer} = require('vue-server-renderer')
const compressStream = require('iltorb').compressStream
const accepts = require('accepts')

const createRenderer = (serverBundle, clientManifest, template) => {
    return createBundleRenderer(serverBundle, {
        template,
        clientManifest,
        inject: false,
        runInNewContext: false,
    })
}

const ssrRenderer = function(clientManifest, serverBundle, template) {
    let renderer = createRenderer(serverBundle, clientManifest, template)

    const render = (req, res, context) => {
        let doCompress = accepts(req).encoding(['br'])
        res.setHeader('Content-Type', 'text/html')

        let stream = renderer.renderToStream(context)
        stream.on('error', (err) => {
            if (err.code === 404) {
                // The catch all route sent a 404 code, render the 404 page.
                res.statusCode = 404
                render(req, res, {
                    url: '/404',
                    fullUrl: 'https://' + req.headers.host + req.url,
                })
            } else {
                console.error(err)
                res.statusCode = 500
                res.send('Unknown error rendering content')
            }
        })

        if (doCompress) {
            res.setHeader('Content-Encoding', 'br')
            stream.pipe(compressStream()).pipe(res)
        } else {
            stream.pipe(res)
        }
    }

    return render
}

module.exports = ssrRenderer
