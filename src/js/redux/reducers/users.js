/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
    FETCH_USER,
    FETCH_USERS,
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER,
    FETCH_AUTHORITIES
} from '../actions/users';

export const initialState = {
    user: null,
    users: null,
    authorities: null
};

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER: {
            const { user } = action.payload;

            return produce(state, (draft) => {
                draft.user = user;
            });
        }

        case FETCH_USERS:
        case CREATE_USER:
        case UPDATE_USER:
        case DELETE_USER: {
            const { users } = action.payload;

            return produce(state, (draft) => {
                draft.users = users;
            });
        }

        case FETCH_AUTHORITIES: {
            const { authorities } = action.payload;

            return produce(state, (draft) => {
                draft.authorities = authorities;
            });
        }

        default: {
            return state;
        }
    }
};

export default usersReducer;
