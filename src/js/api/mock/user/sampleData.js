export const expected_payload = [
  {
    "id":"user-2",
    "login":"admin",
    "firstName":"admin",
    "lastName":"Administrator",
    "email":"admin@test.org",
    "imageUrl":null,
    "activated":true,
    "langKey":"en",
    "createdBy":"system",
    "createdDate":"2020-08-25T15:09:43.034Z",
    "lastModifiedBy":"system",
    "lastModifiedDate":"2020-08-25T15:09:43.036Z",
    "authorities": [
      "ROLE_USER",
      "ROLE_ADMIN"
    ],
    "serverCredentials": {}
  },
  {
    "id":"user-0",
    "login":"system",
    "firstName":"",
    "lastName":"System",
    "email":"system@test.org",
    "imageUrl":null,
    "activated":true,
    "langKey":"en",
    "createdBy":"system",
    "createdDate":"2020-08-25T15:09:42.871Z",
    "lastModifiedBy":"system",
    "lastModifiedDate":"2020-08-25T15:09:42.890Z",
    "authorities": [
      "ROLE_USER",
      "ROLE_ADMIN"
    ],
    "serverCredentials": {}
  },
  {
    "id":"user-3",
    "login":"user",
    "firstName":"",
    "lastName":"User",
    "email":"user@test.org",
    "imageUrl":null,
    "activated":true,
    "langKey":"en",
    "createdBy":"system",
    "createdDate":"2020-08-25T15:09:43.039Z",
    "lastModifiedBy":"system",
    "lastModifiedDate":"2020-08-25T15:09:43.040Z",
    "authorities": [
      "ROLE_USER"
    ],
    "serverCredentials": {}
  }
];

export const expected_payload_for_add_user = {
  "id":"user-4",
  "login":"joesmith",
  "firstName":"Joe",
  "lastName":"Smith",
  "email":"joe.smith@test.com",
  "imageUrl":null,
  "activated":true,
  "langKey":"en",
  "createdBy":"system",
  "createdDate":"2020-08-25T15:09:43.039Z",
  "lastModifiedBy":"system",
  "lastModifiedDate":"2020-08-25T15:09:43.040Z",
  "authorities": [
    "ROLE_USER",
    "ROLE_ADMIN"
  ],
  "serverCredentials": {}
};
