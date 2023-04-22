import mock from './mock_adapter';
import AppConfig from '../../config/appConfig';
import * as sampleData from './audits/sampleData';

mock.onGet(AppConfig.endpoints.audits+'?page=0&size=20&sort=timestamp,desc').reply(200, sampleData.audits);
