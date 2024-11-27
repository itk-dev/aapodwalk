# Podwalk

This is the frontend of a project that creates guided audio tours.

## Podwalk lingo

### Point of interst

A point of interest is a geo location which plays audio.

### Route

A route consists of multiple connected points of interst.

### Tag

A tag can be connected to multiple points of interst. The tags are used to group different points of interst together.
In the frontend, the entrypoint to a content is through tags. So, if the points of interest in a route are not tagged,
they are not displayed.

A point of interest can have multiple tags. A Route can have multiple points of interest.

``` mermaid
---
title: Podwalk
---
classDiagram
    PointOfInterest --> Tag
    Route --> PointOfInterest
```

This project relies on a map from [datafordeler](https://confluence.sdfi.dk/pages/viewpage.action?pageId=16056489), the
credentials (username/password) are put in the [`env.local`](#Development setup)

## Building the app

```shell name=development-build
docker compose pull
docker compose run --rm node npm install
docker compose run --rm node npm run build
docker compose up --detach --remove-orphans
docker compose run --rm node rm -rf node_modules
```

```shell name=development-install
docker compose run --rm node npm install
```

## Development setup

### Running the app in docker (with hmr)

```shell
docker compose pull
docker compose run --rm node npm install
docker compose --file docker-compose.dev.yml up
```

### Env

`env.local`

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

## Linting

### Check and apply with prettier

```shell name=prettier-check
docker run --rm --volume "$PWD:/work" tmknom/prettier:latest --check src
```

```shell name=prettier-apply
docker run --rm --volume "$PWD:/work" tmknom/prettier:latest --write src
```

### Check and apply markdownlint

```shell name=markdown-check
docker run --rm --volume "$PWD:/md" peterdavehello/markdownlint markdownlint --ignore node_modules --ignore LICENSE.md '**/*.md'
```

```shell name=markdown-apply
docker run --rm --volume "$PWD:/md" peterdavehello/markdownlint markdownlint --ignore node_modules --ignore LICENSE.md '**/*.md' --fix
```
