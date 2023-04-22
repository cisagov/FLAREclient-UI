import mock from './mock_adapter';
import AppConfig from '../../config/appConfig';
import * as sampleData from './events/sampleData';

mock.onGet(AppConfig.endpoints.events+'?page=0&size=10&sort=time,desc').reply(200, sampleData.events);
