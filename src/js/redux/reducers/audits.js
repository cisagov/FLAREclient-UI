/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  FETCH_AUDITS,
} from '../actions/audits';

export const initialState = {
  audits: null,
  auditsCount: 0
};

const auditsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUDITS: {
      const { audits } = action.payload;

      return produce(state, (draft) => {
        draft.audits = audits.data;
        draft.auditsCount = parseInt(audits.headers['x-total-count']);
      });
    }

    default: {
      return state;
    }
  }
};

export default auditsReducer;
