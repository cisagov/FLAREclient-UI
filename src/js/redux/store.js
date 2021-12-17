/* eslint-disable import/prefer-default-export */
import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import {ENABLE_REDUX_DEBUG_LOGGING} from '../config/appConfig';

const loggerMiddleware = createLogger();

export function configureStore(preloadedState = {}) {
    const middlewares = [thunkMiddleware];

    if (ENABLE_REDUX_DEBUG_LOGGING) {
        middlewares.push(loggerMiddleware);
    }

    const middlewareEnhancer = composeWithDevTools(
        applyMiddleware(...middlewares)
    );

    const enhancers = [middlewareEnhancer];
    const composedEnhancers = compose(...enhancers);

    const store = createStore(rootReducer, preloadedState, composedEnhancers);

    return store;
}
