import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// import fetchMock from 'fetch-mock'

import * as mock_user from '../../../../js/api/mock/mock_user.js'
import * as userSampleData from '../../../../js/api/mock/user/sampleData.js'

// Actions to be tested
import {FETCH_USER, FETCH_USERS, FETCH_AUTHORITIES, CREATE_USER, UPDATE_USER, DELETE_USERS,
        getUser,    getUsers,    getAuthorities,    addUser,     updateUser,  deleteUser}
        from '../../../../js/redux/actions/users';

describe('user actions', () => {
  it('Fetches user list', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        }
      }
    );

    let users = userSampleData.expected_payload;
    const expectedActions = [
      {
        type: FETCH_USERS,
        payload: {
          users
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getUsers()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Fetches a specific user', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        }
      }
    );

    let user = userSampleData.expected_payload[0];
    const expectedActions = [
      {
        type: FETCH_USER,
        payload: {
          user
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getUser('admin')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Fetches authorities array', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        }
      }
    );

    let authorities = ['ROLE_ADMIN','ROLE_USER'];
    const expectedActions2 = [
      {
        type: FETCH_AUTHORITIES,
        payload: {
          authorities
        }
      }
    ];
    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getAuthorities()).then(() => {
      expect(store.getActions()).toEqual(expectedActions2);
    })
  })
  
  it('Creates a new user', () => {
    let users = userSampleData.expected_payload;
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        users:{
          users: users
        }
      }
    );

    const newUser = {
	'login': 'joesmith',
	'firstName': 'Joe',
	'lastName': 'Smith',
	'email': 'joe.smith@test.com',
	'authorities': [
		  'ROLE_USER',
		  'ROLE_ADMIN'
		]
    }
    const expectedActions2 = [
      {
        type: CREATE_USER,
        payload: {
          users: newUser
        }
      }
    ];
    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(addUser(newUser)).then(() => {
      const actions=store.getActions();
      const user = actions[0] && actions[0].payload && actions[0].payload.users && 
                   actions[0].payload.users.find(element => element['login']==='joesmith');
      expect(user).toBeDefined();
      expect(user.login).toEqual(newUser.login);
      expect(user.firstName).toEqual(newUser.firstName);
      expect(user.lastName).toEqual(newUser.lastName);
      expect(user.email).toEqual(newUser.email);
      expect(user.authorities).toEqual(newUser.authorities);
    })
  })
  
  it('Updates an existing user', () => {
    let users = userSampleData.expected_payload;
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        users:{
          users: users
        }
      }
    );

    const updatedUser = {
      "id":"user-2",
      "login":"adminupdate",
      "firstName":"adminupdate",
      "lastName":"Administratorupdate",
      "email":"adminupdate@test.org",
      "imageUrl":null,
      "activated":true,
      "langKey":"en",
      "createdBy":"system",
      "createdDate":"2020-08-25T15:09:43.034Z",
      "lastModifiedBy":"system",
      "lastModifiedDate":"2020-08-25T15:09:43.036Z",
      "authorities": [
        "ROLE_ADMIN"
      ],
      "serverCredentials": {}
    }
    const expectedActions2 = [
      {
        type: UPDATE_USER,
        payload: {
          users
        }
      }
    ];
    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(updateUser(updatedUser)).then(() => {
      const actions=store.getActions();
      const user = actions[0] && actions[0].payload && actions[0].payload.users && 
                   actions[0].payload.users.find(element => element['id']==='user-2');
      expect(user).toBeDefined();
      expect(user.login).toEqual(updatedUser.login);
      expect(user.firstName).toEqual(updatedUser.firstName);
      expect(user.lastName).toEqual(updatedUser.lastName);
      expect(user.email).toEqual(updatedUser.email);
      expect(user.authorities).toEqual(updatedUser.authorities);
    })
  })
  
  it('Deletes a user', () => {
    let users = userSampleData.expected_payload;
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        users:{
          users: users
        }
      }
    );

    const expectedActions2 = [
      {
        type: DELETE_USERS,
        payload: {
          users
        }
      }
    ];
    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    const userToDelete='system';
    return store.dispatch(deleteUser(userToDelete)).then(() => {
      const actions=store.getActions();
      const user = actions[0] && actions[0].payload && actions[0].payload.users && 
                   actions[0].payload.users.find(element => element['login']==='system');
      expect(user).not.toBeDefined();
    })
  })
  
})
