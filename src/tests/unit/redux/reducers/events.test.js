import eventsReducer from "../../../../js/redux/reducers/events";
import {initialState} from "../../../../js/redux/reducers/events";
import * as eventSampleData from '../../../../js/api/mock/events/sampleData';
import {
  FETCH_EVENTS
} from '../../../../js/redux/actions/events';

describe('events reducer', () => {
  const events = eventSampleData.events;

  it('should return initial state of reducer', ()=>{
    expect(eventsReducer(undefined, {})).toEqual(
      {
        events: null,
        eventsCount: 0
      }
    )
  })

  it('Events - FETCH_EVENTS', () => {
    const events = {headers:{'x-total-count': eventSampleData.events.length},data:eventSampleData.events};
    expect(
      eventsReducer(undefined, {type: FETCH_EVENTS, payload: {events}})
    ).toEqual(
      {
        events: eventSampleData.events,
        eventsCount: 20
      }
    )
  });

})
