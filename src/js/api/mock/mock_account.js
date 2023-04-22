import mock from './mock_adapter';
import AppConfig from '../../config/appConfig';

export const get_account_response = {
  "id":"user-2",
  "login":"admin",
  "firstName":"admin",
  "lastName":"Administrator",
  "email":"admin@testnotreal.com",
  "imageUrl":null,
  "activated":true,
  "langKey":"en",
  "createdBy":"system",
  "createdDate":"2020-11-24T19:25:50.505Z",
  "lastModifiedBy":"admin",
  "lastModifiedDate":"2020-11-24T19:26:49.099Z",
  "authorities":["ROLE_USER","ROLE_ADMIN"],
  "serverCredentials":{}
}

mock.onPost(AppConfig.endpoints.login).reply((config) => {
    const { username, password } = JSON.parse(config.data);

    if (username !== 'admin' || password !== 'admin') {
        //console.log("Invalid Username or password")
        return [400, { message: 'Please check your email and password' }];
    }
    return [200, {"id_token":"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYwMDI4NzUwNn0.6CISmRwFojt5CAkBj-Fj1YFC1TAWopILjdbi3eICaFXpXkFaid5gHw6cgYWCjVZW0UUeISiT-CqnA2Kv3qszlw"}];
});
