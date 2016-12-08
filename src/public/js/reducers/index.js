import React from 'react';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import Users from './users';
import Alerts from './alert';

export default combineReducers({
    Users,
    Alerts,
    routing: routerReducer
});