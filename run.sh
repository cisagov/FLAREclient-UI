#!/usr/bin/env bash 


docker network create -d bridge ais20
docker rm -f client
docker run \
    --network ais20 \
    -e CERT_ALIAS="localhost" \
    -e CERT_KEYSTORE_PASS="12qwaszx@#WESDXC" \
    -e CERT_TRUSTSTORE_PASS="12qwaszx@#WESDXC" \
    -e FLARE_CLIENT_SVC_HOST="127.0.0.1" \
    -e FLARE_CLIENT_SVC_PORT="8083" \
    -e JAVA_OPTS="-Xmx2g" \
    -e MAX_REQUEST_SIZE="150M" \
    -e NGINX_DEBUG_LOG="false" \
    -e NGINX_PROXY_TIMEOUT="690s" \
    -e TIMEOUT_API="680000" \
    -e TIMEOUT_DEFAULT="60000" \
    -e TIMEOUT_TAXII21_DOWNLOAD="660000" \
    -e TIMEOUT_TAXII21_MANIFEST="660000" \
    -e TIMEOUT_TAXII21_UPLOAD="660000" \
    -v $(pwd)/docker/devKeystore.p12:/opt/app/devKeystore.p12:Z \
    -p 443:443 \
    -p 8083:8083 \
    --name client \
    client &




