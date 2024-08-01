# aapodwalk

## Running this app in docker


```shell
docker compose pull
docker compose run --rm node npm install
docker compose run --rm node npm run build
docker compose up --detach --remove-orphans
docker compose run --rm node rm -rf node_modules
open "http://$(docker compose port nginx 8080)"
```

## Coding standards

```shell
docker compose run --rm node npm run check-coding-standards
```

```shell
docker compose run --rm node npm run apply-coding-standards
```

## .env.local

```shell
# The location of the api
COMPOSE_PROJECT_NAME=aapodwalk
COMPOSE_DOMAIN=aapodwalk.local.itkdev.dk

VITE_APP_API_BASE=API_URL_HERE # most probably https://aapodwalk-api.local.itkdev.dk/
VITE_APP_API_ROUTE=api/v1/
VITE_APP_TOKEN=token_stuff_here # created in api (123?)

VITE_APP_DF_MAP_USERNAME=username_here # can be found in 1password
VITE_APP_DF_MAP_PASSWORD=password_here # can likewise be found in 1password
```
