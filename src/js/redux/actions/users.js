import userService from "../../api/user";
import * as _ from 'lodash';

//ACTION_TYPES MUST FOLLOW <NOUN>_<VERB> convention
export const FETCH_USER  = 'FETCH_USER';
export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_AUTHORITIES = 'FETCH_AUTHORITIES';
export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';

export function getUser(login) {
  return async (dispatch, getState) => {
    //console.log("-----Fetching User "+login+"----")
    try {
      const user = await userService.fetchUser(getState().account.id_token,login);
      dispatch({
        type: FETCH_USER,
        payload: {
          user
        }
      });
    } catch (error) {
      throw error;
    }
  };
}

export function getUsers() {
  return async (dispatch, getState) => {
    //console.log("-----Fetching Users----")
    try {
      const users = await userService.fetchUsers(getState().account.id_token);
      dispatch({
        type: FETCH_USERS,
        payload: {
          users
        }
      });
    } catch (error) {
      throw error;
    }
  };
}

export function addUser(user) {
  return async (dispatch, getState) => {
    //console.log("-----Adding User----")
    try {
      const newUser = await userService.addUser(getState().account.id_token,user);
      const grabUser = await userService.fetchUser(getState().account.id_token,newUser.login);

      let users = [...getState().users.users];
      users.push(grabUser);
      dispatch({
        type: CREATE_USER,
        payload: {
          users
        }
      });
    } catch (error) {
      throw error;
    }
  };
}

export function updateUser(user) {
  return async (dispatch, getState) => {
    //console.log("-----Updating User----");
    try {
      const updatedUser = await userService.updateUser(getState().account.id_token,user);

      let users = [...getState().users.users];
      const index = _.findIndex(users, (user) => {
        return user.id === updatedUser.id;
      });

      users.splice(index, 1, {...updatedUser});

      dispatch({
        type: UPDATE_USER,
        payload: {
          users
        }
      });
    } catch (error) {
      throw error;
    }
  };
}

export function deleteUser(login) {
  return async (dispatch, getState) => {
    //console.log("-----Deleting User----");
    try {
      let users = [...getState().users.users];
      await userService.deleteUser(getState().account.id_token,login);
      users = users.filter(e => e.login!==login);

      dispatch({
        type: DELETE_USER,
        payload: {
          users
        }
      });
    } catch (error) {
      throw error;
    }
  };
}

export function getAuthorities() {
  return async (dispatch, getState) => {
    //console.log("-----Fetching Authorities----")
    try {
      const authorities = await userService.fetchAuthorities(getState().account.id_token);
      dispatch({
        type: FETCH_AUTHORITIES,
        payload: {
          authorities
        }
      });
    } catch (error) {
      throw error;
    }
  };
}
