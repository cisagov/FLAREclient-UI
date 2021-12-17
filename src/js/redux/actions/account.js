import authService from "../../api/authorization";
import userService from "../../api/user";

//ACTION_TYPES MUST FOLLOW <NOUN>_<VERB> convention
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

function decodeUserFromIdToken(id_token) {
  return JSON.parse(atob(id_token.split('.')[1]));
}

export function login(login, password, id_token=undefined) {
    return async (dispatch) => {
        try {
            // This was added to allow automatic relogin when possible.
            // If a bad or expired id_token is given, the below will fail
            // and login failure will occur.
            if (id_token===undefined) {
              dispatch({ type: LOGIN_REQUEST });

              id_token = await authService.basicAuthLogin(login, password);
            }

            const decoded = decodeUserFromIdToken(id_token);

            const user = await userService.fetchUser(id_token,decoded.sub);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    user,
                    id_token
                }
            });
        } catch (error) {
            dispatch({ type: LOGIN_FAILURE });
            throw error;
        }
    };
}

export function logout() {
    return async (dispatch) => {
        dispatch({
            type: LOGOUT
        });
    };
}
