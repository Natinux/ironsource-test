import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import {ConfigHelper} from '../helpers';
import { UserService } from '../services';

const di = {
    userService: new UserService()
};

const inject = deps => store => next => action => {
    return next(typeof action === 'function' ? action({...deps, store}) : action);
};

let middlewares = ConfigHelper.get('env.name') == 'prod' ? [] : [createLogger()];
middlewares.push(inject(di));
middlewares.push(routerMiddleware(browserHistory));
middlewares.push(thunk);

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(reducers, initialState);
}