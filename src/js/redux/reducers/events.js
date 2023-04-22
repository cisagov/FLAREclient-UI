/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  FETCH_EVENTS,
} from '../actions/events';

export const initialState = {
  events: null,
  eventsCount: 0
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EVENTS: {
      const { events } = action.payload;

      return produce(state, (draft) => {
        draft.events = events.data;
        draft.eventsCount = parseInt(events.headers['x-total-count']);
      });
    }

    default: {
      return state;
    }
  }
};

export default eventsReducer;
