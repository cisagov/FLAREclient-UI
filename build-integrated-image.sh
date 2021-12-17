#!/bin/sh

docker rm -f client

echo "Node version: $(node --version)"

FLARECLIENT_JAVA_LOCATION="../FLAREclient-Java"
FLARECLIENT_JAVA_BUILD_DIRECTORY=".build"

if test -f "docker/flareclient-ui.key"; then
  echo "[*] Client key exists."
else
  echo "[x] Error: you must extract docker/flareclient-ui-certs.zip into the docker/ folder"
  exit 1
fi


if [[ "$(docker images -q client-base:latest 2> /dev/null)" == "" ]]; then
  echo "[ ] Building base image."

  docker build -f Dockerfile-base -t client-base . | tee .out
  if [ -z "$(grep 'Successfully built' .out )" ]; then echo "Error with docker build"; exit; fi

  echo "[*] Built base image."
fi


# Build flare client java backend and place
# into the FLARECLIENT_JAVA_BUILD_DIRECTORY folder
current_directory=$(pwd)
cd ${FLARECLIENT_JAVA_LOCATION}
mvn clean package -DskipTests -Dmaven.wagon.http.ssl.insecure=true | tee .out
if ls ${FLARECLIENT_JAVA_LOCATION}/target/flareclient-*.jar 1> /dev/null 2>&1; then
    echo "Build success"
else
    echo "Build failed"
    exit 1
fi

cd ${current_directory}
if [ -d "${FLARECLIENT_JAVA_BUILD_DIRECTORY}" ]; then rm -Rf ${FLARECLIENT_JAVA_BUILD_DIRECTORY}; fi
mkdir -p ${FLARECLIENT_JAVA_BUILD_DIRECTORY}
cp ${FLARECLIENT_JAVA_LOCATION}/target/flareclient-*.jar  ${FLARECLIENT_JAVA_BUILD_DIRECTORY}/app.jar
cp -R ${FLARECLIENT_JAVA_LOCATION}/src/main/resources     ${FLARECLIENT_JAVA_BUILD_DIRECTORY}/resources
cp -R ${FLARECLIENT_JAVA_LOCATION}/docker                 ${FLARECLIENT_JAVA_BUILD_DIRECTORY}/docker

# Build the ui
# Build the react app with the following parameters
# REACT_APP_MAIN_URL and REACT_APP_BASE_PATH. These variables
# ensure the requests are properly reverse proxied through  NGINX
npm install
REACT_APP_BASE_PATH="/flareclient" npm run build | tee .out
if [ -z "$(grep 'The build folder is ready to be deployed.' .out )" ]; then echo "Error with build"; exit; fi

docker build -t client . | tee .out
if [ -z "$(grep 'Successfully built' .out )" ]; then echo "Error with docker build"; exit; fi

