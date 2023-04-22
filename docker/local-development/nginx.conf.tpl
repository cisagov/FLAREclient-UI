events {
  worker_connections  4096;  ## Default: 1024
}

http {
log_format upstreamlog '[$time_local] - STATUS: $status - "$request_method $scheme://$host$request_uri $server_protocol"'
                        ' HOST: $host - RemoteAddress: $remote_addr - RemoteUser: $remote_user - Host: $host'
                        ' ServerName: $server_name  to: $upstream_addr: $request upstream_response_time $upstream_response_time msec $msec request_time $request_time';

upstream local_flare_gateway {
server ${DOCKER_HOST_IP}:8001;
}

upstream openshift_admin_gateway {
server 	gateway-admin-flare-test1.apps.fc.bcmcdev.net:443;
}

server {
    listen 80;
    listen 443 ssl;
    server_name localweb01.com;
    resolver 127.0.0.1;
    access_log /var/log/nginx/access.log upstreamlog;

    #
    # Requests to /dist/ will be handled by serving static files directly from the /dist/ folder (i.e., without
    # proxying back to gulp). This is intended to be use when you want to test the site as it will be served in
    # production. Specifically, you'd bundle/minify the app, make sure the files are in the dist/ folder, then access
    # these files directly (without gulp) by loading the site from http://whatever/dist/.
    #
    location /public/ {
        # 'sendfile off' is necessary to prevent nginx from caching the files. This issue is unqiue to nginx serving
        # files from a VirtualBox shared folder (as will be the case when we have Docker shared volumes). For more info
        # see http://serverfault.com/q/269420/172946.
        sendfile  off;
        root /opt/;
        try_files $uri $uri/index.html;
    }

    #
    # Proxy 2-way SSL connections
    #
    location ^~ /flare-cloud/admin/services/ {
        proxy_pass       https://gateway-admin-flare-test1.apps.fc.bcmcdev.net:443/;
        proxy_set_header USER_DN $ssl_client_s_dn;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Host           $http_host;
        proxy_set_header X-Real-IP $remote_addr;
    }


    #
    # Proxy requests to BrowserSync's WebSocket server back to gulp on the host machine, with the special headers that
    # are necessary for NGINX to proxy WS connection correctly.
    #
    location /sockjs-node/ {
        # The command we provide in docker-compose.yml will use 'envsubst' to replace ${VAR} placeholders shown below
        # with actual values.
        proxy_pass       	http://${DOCKER_HOST_IP}:${WEBPACK_DEV_SERVER_PORT};
        proxy_http_version 	1.1;
        proxy_set_header 	Upgrade $http_upgrade;
        proxy_set_header 	Connection "upgrade";
    }

    #
    # Proxy all other non-SSL connections to gulp
    #
    location / {
        # The command we provide in docker-compose.yml will use 'envsubst' to replace ${VAR} placeholders shown below
        # with actual values.

        # Note that we are hard-coding the proxy to "http" and NOT "https" since gulp only listens for http.
        proxy_pass       http://${DOCKER_HOST_IP}:${WEBPACK_DEV_SERVER_PORT};
    }

    ssl_certificate /tmp/docker/pki/admin.crt;
    ssl_certificate_key /tmp/docker/pki/admin.key;
    ssl_client_certificate /tmp/docker/pki/ca.pem;
    ssl_trusted_certificate /tmp/docker/pki/ca.pem;
    ssl_verify_depth 10;
    ssl_verify_client off;
    ssl_prefer_server_ciphers on;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';

    # set client body size to 50M
    client_max_body_size 50M;

    # other headers for service
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_pass_request_headers on;

    # SSL configs for connection to client, based on NGINX certificates
    # note: this sets SSL_CLIENT_S_DN header automatically
    proxy_ssl_certificate         /tmp/docker/pki/admin.crt;
    proxy_ssl_certificate_key     /tmp/docker/pki/admin.key;
    proxy_ssl_trusted_certificate /tmp/docker/pki/ca.pem;
    proxy_ssl_verify_depth  10;
    proxy_ssl_verify        off;
    proxy_ssl_session_reuse off;
    proxy_ssl_server_name on;
    proxy_ssl_protocols           TLSv1.2;
    proxy_ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
   }
}
