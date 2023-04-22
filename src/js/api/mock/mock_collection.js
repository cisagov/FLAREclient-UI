import mock from './mock_adapter';
import AppConfig from '../../config/appConfig';
import * as sampleData from './collection/sampleData';

mock.onGet(AppConfig.endpoints.servers+'/Hail A TAXII/collections').reply((config) => {
  return [200, Object.values(sampleData.HailATAXIICollections.byId)];
});

mock.onGet(AppConfig.endpoints.servers+'/CTI/collections').reply((config) => {
  return [200, Object.values(sampleData.CTICollections.byId)];
});

mock.onGet(AppConfig.endpoints.servers+'/Hail a TAXII/collections/12345/view?page=1&size=20&sort=id,asc').reply((config) => {
  return [200, sampleData.HailATAXIIContents];
});

mock.onGet(AppConfig.endpoints.servers+'/Hail a TAXII/collections/12345/activities?page=1&size=20&sort=id,asc').reply((config) => {
  return [200, sampleData.HailATAXIIActivities];
});

mock.onGet(AppConfig.endpoints.servers+'/Hail a TAXII/collections/12345/view/67890').reply((config) => {
  return [200, sampleData.HailATAXIIContent];
});

mock.onGet(AppConfig.endpoints.servers+'/CTI/collections/12345/manifest').reply((config) => {
  return [200, sampleData.flareManifest];
});

mock.onPost(AppConfig.endpoints.servers+'/Hail a TAXII/collections/12345/upload').reply((config) => {
  return [200, 'Successfully published 1 bundle(s)'];
});

mock.onPost(AppConfig.endpoints.servers+'/Hail a TAXII/collections/12345/validate').reply((config) => {
  return [200, sampleData.HailATAXIIValidate];
});

mock.onPost(AppConfig.endpoints.servers+'/Hail a TAXII/collections/12345/download').reply((config) => {
  return [200, 'Started async fetch'];
});

mock.onGet(AppConfig.endpoints.servers+'/Hail a TAXII/collections/12345/download/recurring').reply((config) => {
  return [200, sampleData.HailATAXIIGetRecurring];
});

mock.onDelete(AppConfig.endpoints.servers+'/Hail a TAXII/collections/12345/download/recurring').reply((config) => {
  return [200, 'Deleted recurring fetch'];
});

// This one is here to fullfil a pull in the server tests
mock.onGet(AppConfig.endpoints.servers+'/New Server/collections').reply((config) => {
  return [200, {}];
});
