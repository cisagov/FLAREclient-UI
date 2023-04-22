import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// import fetchMock from 'fetch-mock'

import * as mock_events from '../../../../js/api/mock/mock_events.js'
import * as eventSampleData from '../../../../js/api/mock/events/sampleData.js'

// Actions to be tested
import {FETCH_EVENTS,
        getEvents}
        from '../../../../js/redux/actions/events';

describe('event actions', () => {
  it('Fetches events', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        }
      }
    );

    const events = eventSampleData.events;

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getEvents()).then(() => {
      const actions=store.getActions();
      expect(actions[0].type).toEqual(FETCH_EVENTS);
      expect(actions[0].payload.events.data).toEqual(events);
    })
  });
})
