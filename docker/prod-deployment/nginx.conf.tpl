events {
  worker_connections  4096;  ## Default: 1024
}

http {
  log_format upstreamlog '[$time_local] - STATUS: $status - "$request_method $scheme://$host$request_uri $server_protocol"'
                        ' HOST: $host - RemoteAddress: $remote_addr - RemoteUser: $remote_user - Host: $host'
                        ' ServerName: $server_name  to: $upstream_addr: $request upstream_response_time $upstream_response_time msec $msec request_time $request_time';
  server {
    listen 8445 ssl;
    server_name web01;
    access_log /var/log/nginx/access.log upstreamlog;
    error_log  /var/log/nginx/error.log debug;

    location ^~ / {
      root /var/www/build;
      index index.html index.htm;
      default_type "text/html";
      include  /etc/nginx/mime.types;
      try_files $uri $uri/ /index.html;


    }

    #
    # Proxy 2-way SSL connections (i.e., client pki cert) to AWS-based services
    #
    location ^~ /flare-cloud/admin/services/ {
        proxy_pass       https://${GATEWAY_ADMIN_SVC_HOST}:${GATEWAY_ADMIN_SVC_PORT}/;
        proxy_set_header USER_DN        $ssl_client_s_dn;
        proxy_set_header X-NginX-Proxy  true;
        proxy_set_header Host           $http_host;
        proxy_set_header X-Real-IP      $remote_addr;
    }
    
    ssl_certificate /tmp/docker/pki/admin.crt;
    ssl_certificate_key /tmp/docker/pki/admin.key;
    ssl_client_certificate /tmp/docker/pki/ca.pem;
    ssl_trusted_certificate /tmp/docker/pki/ca.pem;
    ssl_verify_depth 10;
    ssl_verify_client off;
    ssl_prefer_server_ciphers on;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers     HIGH:!aNULL:!MD5;

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
    proxy_ssl_session_reuse on;
    proxy_ssl_server_name on;
    proxy_ssl_protocols           TLSv1.2;
    proxy_ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
  }
}
