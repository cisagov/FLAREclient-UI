/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  FETCH_STATUS,
} from '../actions/status';

export const initialState = {
  status: null,
  statusCount: 0
};

const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STATUS: {
      const { status } = action.payload;

      return produce(state, (draft) => {
        draft.status = status.data;
        draft.statusCount = parseInt(status.headers['x-total-count']);
      });
    }

    default: {
      return state;
    }
  }
};

export default statusReducer;
