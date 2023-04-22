import mock from './mock_adapter';
import AppConfig from '../../config/appConfig';
import * as sampleData from './logs/sampleData';

mock.onGet(AppConfig.endpoints.logs).reply(200, sampleData.logs);

mock.onPut(AppConfig.endpoints.logs).reply(200, '');
