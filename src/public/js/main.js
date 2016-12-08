import React from 'react';
import {render} from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { LocalStorageHelper, LogHelper } from './helpers';
import MainContainer from './containers/main';
import Home from './components/Home';
import Checkout from './components/Checkout';
import ThankYou from './components/ThankYou';
import Users from './components/Users';

const store = configureStore(LocalStorageHelper.get('state') || {});
const history = syncHistoryWithStore(browserHistory, store);

const routes = (
    <Route path="/" component={MainContainer}>
        <IndexRoute component={Home} />
        <Route path="/" component={Home} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/thankyou" component={ThankYou} />
        <Route path="/users" component={Users} />
    </Route>
);

function run(){
    let state = store.getState();
    LogHelper.debug("updating local storage");
    LocalStorageHelper.set('state', state);

    render((
        <Provider store={store}>
            <Router history={history} routes={routes} />
        </Provider>
    ), document.querySelector('#app'));
}

export function startApplication() {
    store.subscribe(run);
    run();
}