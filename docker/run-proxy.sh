# A script that will get your ipv4 address and run an NGINX docker container to reverse proxy requests to required AWS services.
while true; do
    read -p "Are micro-services running locally? (Y/N) " yn
    case $yn in
        [Yy]* ) export flareMicroServicesGateway=local_flare_gateway; break;;
        [Nn]* ) export flareMicroServicesGateway=openshift_admin_gateway; break;;
        * ) echo "Please answer yes or no.";;
    esac
done
ipv4="$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')"
export dockerHostAddress=$ipv4
echo Proxying Requests to: $flareMicroServicesGateway
echo Docker Host address set to: $ipv4
echo Proxying to port: 19443
echo https://$ipv4:19443
docker-compose up