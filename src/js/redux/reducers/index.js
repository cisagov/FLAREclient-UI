import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import accountReducer from './account';
import auditsReducer from './audits';
import collectionsReducer from './collections';
import eventsReducer from './events';
import logsReducer from './logs';
import serversReducer from './servers';
import statusReducer from './status';
import usersReducer from './users';
const rootReducer = combineReducers({
    account: accountReducer,
    audits: auditsReducer,
    collections: collectionsReducer,
    events: eventsReducer,
    form: formReducer,
    logs: logsReducer,
    servers: serversReducer,
    status: statusReducer,
    users: usersReducer
});

export default rootReducer;
