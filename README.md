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

### Map

This project relies on a [Open Street Map](https://www.openstreetmap.org/), implemented with [React Leaflet](https://react-leaflet.js.org/).

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
