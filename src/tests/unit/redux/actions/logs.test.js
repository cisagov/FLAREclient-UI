import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// import fetchMock from 'fetch-mock'

import * as mock_logs from '../../../../js/api/mock/mock_logs.js';
import * as logSampleData from '../../../../js/api/mock/logs/sampleData.js';

// Actions to be tested
import {FETCH_LOGS, UPDATE_LOGS,
        getLogs,    updateLogs}
        from '../../../../js/redux/actions/logs';

describe('log actions', () => {
  it('Fetches logs', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const logs = logSampleData.logs;
    const expectedActions = [
      {
        type: FETCH_LOGS,
        payload: {
          logs
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getLogs()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('Updates logs', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        },
        collections: {}
      }
    );

    const response = "";
    const expectedActions = [
      {
        type: UPDATE_LOGS,
        payload: {
          response
        }
      }
    ];

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(updateLogs("ROOT", "TRACE")).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    })
  });
})
