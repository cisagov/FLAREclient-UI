import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import '../../../../js/api/mock/mock_account'
import '../../../../js/api/mock/mock_user'
import * as userSampleData from '../../../../js/api/mock/user/sampleData.js'

import {LOGIN_SUCCESS, login, LOGIN_REQUEST} from "../../../../js/redux/actions/account";

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('account actions', () => {
    const expected = userSampleData.expected_payload;

    /**
     * Action should return at least 2 actions:
     * LOGIN_REQUEST AND LOGIN_SUCCESS
     * or
     * LOGIN_REQUEST AND LOGIN_FAILURE
     */
    it('action creator: LOGIN', () => {
        const expectedActions = [
            {type: LOGIN_REQUEST},
            {
                type: LOGIN_SUCCESS,
                payload: {
                    id_token: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYwMDI4NzUwNn0.6CISmRwFojt5CAkBj-Fj1YFC1TAWopILjdbi3eICaFXpXkFaid5gHw6cgYWCjVZW0UUeISiT-CqnA2Kv3qszlw",
                    user: expected[0]
                }
            }
        ];

        /**
         * The follow test asserts that the right actions AND payload are returned from the redux ASYNC action creator.
         */
        const store = mockStore({account:{user:null}});
        return store.dispatch(login('admin', 'admin')).then(()=>{
          expect(store.getActions()).toEqual(expectedActions);
        })

    })

})
