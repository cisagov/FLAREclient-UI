import accountReducer from "../../../../js/redux/reducers/account";
import {initialState} from "../../../../js/redux/reducers/account";
import {get_account_response} from '../../../../js/api/mock/mock_account';
import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT
} from '../../../../js/redux/actions/account';

describe('user reducer', () => {

    const user = {...get_account_response};

    const id_token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYwMDI4NzUwNn0.6CISmRwFojt5CAkBj-Fj1YFC1TAWopILjdbi3eICaFXpXkFaid5gHw6cgYWCjVZW0UUeISiT-CqnA2Kv3qszlw';

    it('should return initial state of reducer', ()=>{
        expect(accountReducer(undefined, {})).toEqual({id_token: null, user: null})
    })

    it('should handle negative input', () => {
        expect(accountReducer({}, {type: "nonexisting_action"}))
            .toEqual({})
    });

    /**
     * This should clear the current user if the info is cached. Note how I am MANUALLY mocking that inital state. However
     * in the test below I am simply importing it to keep things consistent.
     */
    it('Account - LOGIN_REQUEST', () => {
        expect(
            accountReducer({user: null}, {type: LOGIN_REQUEST})
        ).toEqual(
            {id_token: null, user: null}
        )

    });


    it('Account - LOGIN_SUCCESS', () => {
        expect(
            accountReducer({...initialState}, {type: LOGIN_SUCCESS, payload: {id_token: id_token, user: {...user}}})
        ).toEqual(
            {id_token, user}
        )

    });

    it('Account - LOGOUT', () => {
        expect(
            accountReducer({...initialState}, {type: LOGOUT})
        ).toEqual(
            {id_token: null, user: null}
        )

    });
})
