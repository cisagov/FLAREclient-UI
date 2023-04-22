import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// import fetchMock from 'fetch-mock'

import * as mock_status from '../../../../js/api/mock/mock_status.js'
import * as statusSampleData from '../../../../js/api/mock/status/sampleData.js'

// Actions to be tested
import {FETCH_STATUS,
        getStatus}
        from '../../../../js/redux/actions/status';

describe('status actions', () => {
  it('Fetches statuses', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        }
      }
    );

    const status = statusSampleData.status;

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getStatus(0,20,'request_timestamp','desc')).then(() => {
      const actions=store.getActions();
      expect(actions[0].type).toEqual(FETCH_STATUS);
      expect(actions[0].payload.status.data).toEqual(status);
    })
  });
})
