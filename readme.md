## Gettings started
Run eject.sh to start a fresh git history for your own project.<br>
Run ```npm run dev``` to start webpacking and serving to localhost:3005<br>

## Npm Scripts
 - dev: Starts webpacking of the client and server, and starts serving the content on port 3005
 - production: Starts the server in production mode (Don't forget to pack first)
 - pack-production: Runs webpack in production mode for the client and server
 - pack-client-production: Production mode packs the client only
 - pack-server-production: Production mode packs the server only
 - clean: deletes files in the dist directory

## HTTPS/HTTP2
The application serves up only http and expects you to use a reverse proxy for TLS.<br>
For local testing of Http2 there is an included docker compose file and and HAProxy config.<br>
For deployment, using HAProxy via the included config is also reccomended.<br>

## Things to edit for your own project
Customize config.js<br>
Customize public/manifest.json<br>
Add icons<br>
Author, colors, twitter names in index.template.html<br>

## Notes
*Be cautious* about copying page meta when creating new pages, your `rel="canonical"` is in there.