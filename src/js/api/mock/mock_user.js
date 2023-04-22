import mock from './mock_adapter';
import AppConfig from '../../config/appConfig';
import * as sampleData from './user/sampleData';

/**
 * Returns a full list of users
 */
mock.onGet(AppConfig.endpoints.users).reply((config) => {
    return [200, sampleData.expected_payload];
});

mock.onGet(AppConfig.endpoints.authorities).reply(200,
  [
    "ROLE_ADMIN",
    "ROLE_USER"
  ]
);

function getLogin(url) {
  const login = url.replace(/(https:\/\/.+?)?\/api\/users\//,'');
  return login;
}

mock.onGet(/\/api\/users\/*/).reply((config) => {
    const login = getLogin(config.url);
    //console.log("USER REQUESTED: ", login);
    if (login==='admin' || login==='system' || login==='user') {
      return [200, sampleData.expected_payload[0]];
    } else if (login==='joesmith') {
      return [200, sampleData.expected_payload_for_add_user];
    } else {
      return [404, undefined];
    }
});

mock.onPost(AppConfig.endpoints.users).reply((config) => {
    const user = JSON.parse(config.data);
    return [200, user];
});

mock.onPut(AppConfig.endpoints.users).reply((config) => {
    const user = JSON.parse(config.data);
    return [200, user];
});

mock.onDelete(/\/api\/users\/*/).reply((config) => {
    const login = getLogin(config.url);
    //console.log("USER REQUESTED TO DELETE: ", login);
    return [200, 'User successfully deleted for login: '+login];
});
