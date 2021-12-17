import mock from './mock_adapter';
import AppConfig from '../../config/appConfig';
import * as sampleData from './server/sampleData';

function getServer(url) {
  const server = url.replace(/(https:\/\/.+?)?\/api\/servers\//,'');
  return server;
}

/**
 * Returns a full detailed list of connected servers
 *
 * this will be useful for the servers view, but might have too much info for the dashboard/navigation view
 */
mock.onGet(AppConfig.endpoints.servers).reply((config) => {
  return [200, sampleData.fetchServersResponse];
});

mock.onGet(/\/api\/servers\/[^\/]+$/).reply((config) => {
  const server = getServer(config.url);
  if (server==='CTI' || server==='Hail A TAXII') {
    const selectedServer = sampleData.fetchServersResponse.byLabel[server]
    return [200, selectedServer];
  } else {
    return [404, undefined];
  }
});

mock.onPost(AppConfig.endpoints.servers).reply((config) => {
  let newServer = JSON.parse(config.data);
  newServer['apiRoots'] = [newServer.url + '/api1/',newServer.url + '/api2/',newServer.url + '/trustgroup1/'];
  newServer['available'] = true;
  newServer['defaultApiRoot'] = newServer.url + '/trustgroup1/';
  if (newServer.username === '' || newServer.password === '') {
    newServer['hasCredentials'] = false;
  } else {
    newServer['hasCredentials'] = true;
  }
  newServer['hasReceivedCollectionInformation'] = true;
  newServer['hasReceivedServerInformation'] = true;
  newServer['id'] = '12345';
  newServer['lastReceivedCollectionInformation'] = '2020-10-08T20:45:06.038Z',
  newServer['lastReceivedServerInformation'] = '2020-10-08T20:45:05.847Z',
  newServer['lastUpdated'] = '2020-10-08T20:45:06.038Z',
  newServer['version'] = 'TAXII21';
  return [200, newServer];  
});

mock.onPost(AppConfig.endpoints.servers+'/Hail A TAXII/refresh').reply((config) => {
  const server='Hail A TAXII';
  let selectedServer = sampleData.fetchServersResponse.byLabel[server]
  selectedServer.lastReceivedServerInformation = '2020-12-31T23:59:59.000Z';
  return [200, selectedServer];
});

mock.onDelete(/\/api\/servers\/*/).reply((config) => {
  const server = getServer(config.url);
  if (server==='CTI' || server==='Hail A TAXII') {
    const remainingServers = Object.values(sampleData.fetchServersResponse.byLabel).filter((s) => s.label !== server);
    return [200, remainingServers];
  } else {
    return [404, undefined];
  }
});
