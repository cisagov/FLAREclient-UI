/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
    FETCH_LOGS,
    UPDATE_LOGS
} from '../actions/logs';

export const initialState = {
    logs: null
};

const logsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LOGS: {
            const { logs } = action.payload;

            return produce(state, (draft) => {
                draft.logs = logs;
            });
        }

        // Update doesn't change state at all...
        case UPDATE_LOGS:
        default: {
            return state;
        }
    }
};

export default logsReducer;
