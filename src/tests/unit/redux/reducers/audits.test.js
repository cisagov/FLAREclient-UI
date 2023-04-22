import auditsReducer from "../../../../js/redux/reducers/audits";
import {initialState} from "../../../../js/redux/reducers/audits";
import * as auditSampleData from '../../../../js/api/mock/audits/sampleData';
import {
  FETCH_AUDITS
} from '../../../../js/redux/actions/audits';

describe('audits reducer', () => {
  const audits = auditSampleData.audits;

  it('should return initial state of reducer', ()=>{
    expect(auditsReducer(undefined, {})).toEqual(
      {
        audits: null,
        auditsCount: 0
      }
    )
  })

  it('Audits - FETCH_AUDITS', () => {
    const audits = {headers:{'x-total-count': auditSampleData.audits.length},data:auditSampleData.audits};
    expect(
      auditsReducer(undefined, {type: FETCH_AUDITS, payload: {audits}})
    ).toEqual(
      {
        audits: auditSampleData.audits,
        auditsCount: 20
      }
    )
  });

})
