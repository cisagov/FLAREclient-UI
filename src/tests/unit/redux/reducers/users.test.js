import usersReducer from "../../../../js/redux/reducers/users";
import {initialState} from "../../../../js/redux/reducers/users";
import * as userSampleData from '../../../../js/api/mock/user/sampleData';
import {
    FETCH_USER,
    FETCH_USERS,
    FETCH_AUTHORITIES,
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER
} from '../../../../js/redux/actions/users';

describe('users reducer', () => {
    const users = userSampleData.expected_payload;
    const user = users[0];

    const authorities = ['ROLE_USER','ROLE_ADMIN'];

    it('should return initial state of reducer', ()=>{
        expect(usersReducer(undefined, {})).toEqual({user: null, users: null, authorities: null})
    })

    /**
     * This should clear the current user if the info is cached. Note how I am MANUALLY mocking that inital state. However
     * in the test below I am simply importing it to keep things consistent.
     */
    it('Users - FETCH_USER', () => {
        expect(
            usersReducer(initialState, {type: FETCH_USER, payload: {user}})
        ).toEqual(
            {user: user, users: null, authorities: null}
        )
    });

    it('Users - FETCH_USERS', () => {
        expect(
            usersReducer(initialState, {type: FETCH_USERS, payload: {users}})
        ).toEqual(
            {user: null, users: users, authorities: null}
        )
    });

    it('Users - FETCH_AUTHORITIES', () => {
        expect(
            usersReducer(initialState, {type: FETCH_AUTHORITIES, payload: {authorities}})
        ).toEqual(
            {user: null, users: null, authorities: authorities}
        )
    });

    it('Users - CREATE_USER', () => {
        expect(
            usersReducer(initialState, {type: CREATE_USER, payload: {users}})
        ).toEqual(
            {user: null, users, authorities: null}
        )
    });

    it('Users - UPDATE_USER', () => {
        expect(
            usersReducer(initialState, {type: UPDATE_USER, payload: {users}})
        ).toEqual(
            {user: null, users, authorities: null}
        )
    });

    it('Users - DELETE_USER', () => {
        expect(
            usersReducer(initialState, {type: DELETE_USER, payload: {users}})
        ).toEqual(
            {user: null, users, authorities: null}
        )
    });
})
