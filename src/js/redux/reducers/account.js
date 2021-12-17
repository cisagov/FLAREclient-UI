/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT
} from '../actions/account';
import Cookies from 'js-cookie';

export const initialState = {
    user: null,
    id_token: null
};

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST: {
            Cookies.remove('jwt_token',{sameSite:'none',secure:true});
            return produce(state, (draft) => {
                // Ensure we clear current session
                draft.user = null;
                draft.id_token = null;
            });
        }

        case LOGIN_SUCCESS: {
            const { user, id_token } = action.payload;
            Cookies.set('jwt_token',id_token,{sameSite:'none',secure:true});

            return produce(state, (draft) => {
                draft.user = user;
                draft.id_token = id_token;
            });
        }

        case LOGIN_FAILURE: {
            return produce(state, () => {
                // Maybe store error
            });
        }

        case LOGOUT: {
            Cookies.remove('jwt_token',{sameSite:'none',secure:true});
            return produce(state, (draft) => {
                draft.user = null;
                draft.id_token = null;
            });
        }

        default: {
            return state;
        }
    }
};

export default accountReducer;
