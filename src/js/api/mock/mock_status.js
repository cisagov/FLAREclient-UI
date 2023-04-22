import mock from './mock_adapter';
import AppConfig from '../../config/appConfig';
import * as sampleData from './status/sampleData';

mock.onGet(AppConfig.endpoints.status+'?page=0&size=20&sort=request_timestamp,desc').reply(200, sampleData.status);
