/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
    FETCH_SERVERS,
    FETCH_SERVER,
    CREATE_SERVER,
    DELETE_SERVER,
    REFRESH_SERVER,
    UPDATE_SERVER,
//    DELETE_SERVER_CREDENTIALS,
//    UPDATE_SERVER_CREDENTIALS
} from '../actions/servers';

export const initialState = {
    servers: null
};

const serversReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SERVER:
        case DELETE_SERVER:
        case FETCH_SERVERS:
        case REFRESH_SERVER:
        case UPDATE_SERVER: {
            const { servers } = action.payload;

            return produce(state, (draft) => {
                draft.servers = servers;
            });
        }

        case FETCH_SERVER:
            const { server } = action.payload;

            return produce(state, (draft) => {
                draft.server = server;
            });

        default: {
            return state;
        }
    }
};

export default serversReducer;
