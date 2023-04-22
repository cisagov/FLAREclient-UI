FROM client-base:latest

USER root

# Add flareclient java backend
ADD .build/app.jar                      /opt/app/
ADD .build/resources/*                  /opt/app/
ADD .build/docker/application-ui.yml    /opt/app/application.yml

RUN mkdir -p /data/db

# Add the entrypoint
ADD docker/entrypoint.sh /opt/app/entrypoint.sh
RUN chmod +x /opt/app/entrypoint.sh

# NGINX configuration
ADD docker/nginx.conf.tpl           /etc/nginx/
ADD docker/flareclient-ui.pem       /tmp/docker/pki/
ADD docker/flareclient-ui.key       /tmp/docker/pki/
ADD docker/flareclient.pem          /tmp/docker/pki/

RUN echo "" > /var/log/nginx/access.log
RUN chown nginx:nginx /var/log/nginx/access.log
RUN chown -R nginx:nginx /tmp/docker/pki
RUN chown nginx:nginx /etc/nginx/nginx.conf

ADD build                           /var/www/

# Remove private keystore
RUN rm /opt/app/devKeystore.p12

ENTRYPOINT [ "/opt/app/entrypoint.sh" ]
