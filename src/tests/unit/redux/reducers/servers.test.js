import serversReducer from "../../../../js/redux/reducers/servers";
import {initialState} from "../../../../js/redux/reducers/servers";
import * as serverSampleData from '../../../../js/api/mock/server/sampleData';
import {
  FETCH_SERVERS,
  FETCH_SERVER,
  CREATE_SERVER,
  UPDATE_SERVER,
  DELETE_SERVER,
  REFRESH_SERVER,
//  UPDATE_SERVER_CREDENTIALS,
//  DELETE_SERVER_CREDENTIALS
} from '../../../../js/redux/actions/servers';

describe('servers reducer', () => {
    const servers = serverSampleData.sampleResponse;
    const server = serverSampleData.flareCloudServer;

    it('should return initial state of reducer', ()=>{
        expect(serversReducer(undefined, {})).toEqual({servers: null})
    })

    /**
     * This should clear the current server if the info is cached. Note how I am MANUALLY mocking that inital state. However
     * in the test below I am simply importing it to keep things consistent.
     */
    it('Servers - FETCH_SERVERS', () => {
        expect(
            serversReducer({}, {type: FETCH_SERVERS, payload: {servers}})
        ).toEqual(
            {servers}
        )
    });

    it('Servers - FETCH_SERVER', () => {
        expect(
            serversReducer({}, {type: FETCH_SERVER, payload: {server}})
        ).toEqual(
            {server}
        )
    });

    it('Servers - CREATE_SERVER', () => {
        expect(
            serversReducer({}, {type: CREATE_SERVER, payload: {servers}})
        ).toEqual(
            {servers}
        )
    });

    it('Servers - UPDATE_SERVER', () => {
        expect(
            serversReducer({}, {type: UPDATE_SERVER, payload: {servers}})
        ).toEqual(
            {servers}
        )
    });

    it('Servers - DELETE_SERVER', () => {
        expect(
            serversReducer({}, {type: DELETE_SERVER, payload: {servers}})
        ).toEqual(
            {servers}
        )
    });

    it('Servers - REFRESH_SERVER', () => {
        expect(
            serversReducer({}, {type: REFRESH_SERVER, payload: {servers}})
        ).toEqual(
            {servers}
        )
    });
})
