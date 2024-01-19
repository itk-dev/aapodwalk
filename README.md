# aapodwalk

## Running this app in docker

```sh
docker compose run node npm install
docker compose up --detach
open "http://$(docker compose port nginx 8080)"

# Alternatively
itkdev-docker-compose open
```

## Linting

```bash
npm run check-coding-standards
```

```bash
npm run apply-coding-standards
```

## .env.local

```bash
# The location of the api
COMPOSE_PROJECT_NAME=aapodwalk
COMPOSE_DOMAIN=aapodwalk.local.itkdev.dk

REACT_APP_API_BASE=API_URL_HERE # most probably https://aapodwalk-api.local.itkdev.dk/
REACT_APP_API_ROUTE=api/v1/
REACT_APP_TOKEN=token_stuff_here # created in api (123?)

REACT_APP_DF_MAP_USERNAME=username_here # can be found in 1password
REACT_APP_DF_MAP_PASSWORD=password_here # can likewise be found in 1password
```

## publiccode.yml

This code adheres to the
[publiccode.yml](https://github.com/publiccodeyml/publiccode.yml) standard by
including a [`publiccode.yml`](publiccode.yml) metadata file that makes public
software easily discoverable. See [`publiccode.yml`](publiccode.yml) for details.

Validate the `publiccode.yml` file by running

```shell
docker run --interactive italia/publiccode-parser-go /dev/stdin < publiccode.yml
```

The validation is automatically performed by a GitHub Action whenever a pull
request is made (cf. [`.github/workflows/pr.yaml`](.github/workflows/pr.yaml)).
