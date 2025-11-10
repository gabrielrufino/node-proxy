# Proxies API

---

* Reverse proxy
* Create proxies dynamically
* Prometheus metrics
* Procted by [helmet](https://helmetjs.github.io/)
* Graceful Shutdown

## Getting started

Start a proxy usig docker:

```sh
docker container run \
  -p 3000:3000 \
  -v "proxies-api:/usr/src/app/" \
  -e NODE_ENV=production \
  --name proxies-api \
  servicespack/proxies-api
```

## API

These are one of the routes for managing the proxy server. You can see the rest of them in the swagger docs.

### Ping route

> GET /

Response:

```json
{"I":"am alive"}
```

### Create a proxy

> POST /proxies

```json
{
  "namespace": "users",
  "target": "https://users.yourmicroservices.dev"
}
```

## LICENSE

MIT
