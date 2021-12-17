import statusReducer from "../../../../js/redux/reducers/status";
import {initialState} from "../../../../js/redux/reducers/status";
import * as statusSampleData from '../../../../js/api/mock/status/sampleData';
import {
  FETCH_STATUS
} from '../../../../js/redux/actions/status';

describe('status reducer', () => {
  const status = statusSampleData.status;

  it('should return initial state of reducer', ()=>{
    expect(statusReducer(undefined, {})).toEqual(
      {
        status: null,
        statusCount: 0
      }
    )
  })

  it('status - FETCH_STATUS', () => {
    const status = {headers:{'x-total-count': statusSampleData.status.length},data:statusSampleData.status};
    expect(
      statusReducer(undefined, {type: FETCH_STATUS, payload: {status}})
    ).toEqual(
      {
        status: statusSampleData.status,
        statusCount: 3
      }
    )
  });

})
