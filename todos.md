# Todos
- [ ] Server should reload the files used for render when they update
       This could be via checking meta data on the files or a method triggered by a route
- [ ] More things in meta should be pulled from config (Author, theme-color, etc)
- [ ] Add some fancy image optimization
- [ ] Investigate compressing other resources such as images in webpack
- [ ] Add isProduction helper and general server helpers folder
- [ ] Auto generate sitemap
- [ ] Add fancy resolve helpers to webpack config
- [ ] Chrome seems to be getting Gzip instead of BR files
- [ ] Add placeholder favicon
- [ ] Use ENV variable for port in serve and haproxy.cfg
- [ ] Client and server SSR manifests shouldn't be put into dist. They shouldn't be publicly accessible.

# Maybe Todos
- [ ] Find a better css reset
- [ ] Compress more assets in public like fonts and icons
- [ ] Strip all GZip compression and go to all brotli

# Watch
Css extraction currently isn't available. Follow these threads for updates:
https://github.com/webpack-contrib/mini-css-extract-plugin/issues/90
https://github.com/webpack-contrib/mini-css-extract-plugin/issues/173
