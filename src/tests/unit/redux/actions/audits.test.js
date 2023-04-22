import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// import fetchMock from 'fetch-mock'

import * as mock_audits from '../../../../js/api/mock/mock_audits.js'
import * as auditSampleData from '../../../../js/api/mock/audits/sampleData.js'

// Actions to be tested
import {FETCH_AUDITS,
        getAudits}
        from '../../../../js/redux/actions/audits';

describe('audit actions', () => {
  it('Fetches audits', () => {
    const store = configureMockStore([thunk])(
      {
        account:{
          id_token: null
        }
      }
    );

    const audits = auditSampleData.audits;

    /**
     * The following test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
     **/
    return store.dispatch(getAudits()).then(() => {
      const actions=store.getActions();
      expect(actions[0].type).toEqual(FETCH_AUDITS);
      expect(actions[0].payload.audits.data).toEqual(audits);
    })
  });
})
