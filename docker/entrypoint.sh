#!/usr/bin/env bash

echo "[ ]  Copying secrets files  ... "
if [ -d "${SECRETS_DIR}" ]
then
    echo "Directory ${SECRETS_DIR} exists."
    cp ${SECRETS_DIR}* /tmp/docker/pki/ 2>/dev/null
    echo "[+]  Done copying secrets files  ... "
else
    echo "[-]  Warning: Directory ${SECRETS_DIR} does not exists. This is ok if you are running this locally."
fi


echo "[ ] Substituting variables in nginx configuration ... "
envsubst '${NGINX_PROXY_TIMEOUT},${FLARE_CLIENT_SVC_HOST},${FLARE_CLIENT_SVC_PORT},${MAX_REQUEST_SIZE}' < /etc/nginx/nginx.conf.tpl > /etc/nginx/nginx.conf

cat /etc/nginx/nginx.conf

echo "[ ]  Starting service  ... "
nginx
tail -f /var/log/nginx/access.log &
if [[ "${NGINX_DEBUG_LOG}" == "true" ]]; then
  tail -f /var/log/nginx/error.log &
fi

mongod &

cd /opt/app
java ${JAVA_OPTS} -jar /opt/app/app.jar
