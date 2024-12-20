# Podwalk

This is the frontend of a project that creates guided audio tours.

## Podwalk lingo

### Point of interst

A point is a geo location which plays a piece of audio or a video.

### Route

A route consists of multiple connected points.

### Tag

A tag can be connected to multiple routes. The tags are used to group different routes together. A route can have
multiple points and tags.

``` mermaid
---
title: Podwalk
---
classDiagram
    Route --> Tag
    Route --> Point
```

### Map

This project relies on a [Open Street Map](https://www.openstreetmap.org/), implemented with [React
Leaflet](https://react-leaflet.js.org/).

## Development setup - running the app in docker

To run this app, there are some local variables that needs to be set:

`env.local`

```shell
# The location of the api
VITE_APP_API_BASE=API_URL_HERE # Probably https://aapodwalk-api.local.itkdev.dk/
VITE_APP_API_ROUTE=api/v1/
VITE_APP_TOKEN=token_stuff_here # This is created in the api
```

Then you up the container:

```shell name=development-develop
docker compose pull
# Stop the "build" setup
COMPOSE_PROFILES="*" docker compose stop
docker compose run --rm node npm install
# When the container 'up's, npm runs start that watches files
docker compose up --detach --remove-orphans
open https://aapodwalk.local.itkdev.dk
```

*Note*, if there is no api running, you will see an empty page.

## Building the app

To test the app, as it is in production, you can do the following:

```shell name=development-build
docker compose pull
docker compose run --rm node npm install
docker compose run --rm node npm run build
docker compose run --rm node rm -rf node_modules
COMPOSE_PROFILES="*" docker compose stop
# Start the "build" profile (cf. https://docs.docker.com/compose/how-tos/profiles/)
COMPOSE_PROFILES=build docker compose up --detach --remove-orphans
open https://aapodwalk.local.itkdev.dk
```

## Linting

```shell name=development-install
# development-install is used in actions
docker compose run --rm node npm install
```

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
