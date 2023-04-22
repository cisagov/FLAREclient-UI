import logsReducer from "../../../../js/redux/reducers/logs";
import {initialState} from "../../../../js/redux/reducers/logs";
import * as logSampleData from '../../../../js/api/mock/logs/sampleData';
import {
  FETCH_LOGS,
  UPDATE_LOGS
} from '../../../../js/redux/actions/logs';

describe('logs reducer', () => {
  const logs = logSampleData.logs;

  it('should return initial state of reducer', ()=>{
    expect(logsReducer(undefined, {})).toEqual(
      {
        logs: null
      }
    )
  })

  it('Logs - FETCH_LOGS', () => {
    const logs = logSampleData.logs;
    expect(
      logsReducer(undefined, {type: FETCH_LOGS, payload: {logs}})
    ).toEqual(
      {
        logs
      }
    )
  });

  it('Logs - UPDATE_LOGS', () => {
    expect(
      logsReducer(initialState, {type: UPDATE_LOGS})
    ).toEqual(
      {
        logs: null
      }
    )
  });
})
