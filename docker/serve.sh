#!/usr/bin/env bash

# Script will find the current machines ipv4 adress, set it to an environment variable: dockerHostAddress,
# build the minified files of the target UI, and run the designated docker compose file which will create
# a local nginx container with the application exposed at: https://{dockerHostAddress}:19443

ipv4="$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')"
export dockerHostAddress=$ipv4
npm run build
wait
docker-compose -f ./docker/serve/docker-compose-serve-ui.yml up
