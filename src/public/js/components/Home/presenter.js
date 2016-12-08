import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';
import {Glyphicon} from 'react-bootstrap';

export default class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    goToCheckout(){
        browserHistory.push(`/checkout`);
    }

    render(){

        let isLoading = this.state.isLoading;

        return (<div>
            <h1 className="display-3">Welcome to product page</h1>
            <p className="lead"><Link to="/checkout">Click here</Link> to continue to checkout.</p>

            <br/>
            <p>Developer? <a href="/docs" target="_blank">take a look here <Glyphicon glyph="book" /></a></p>
        </div>);
    }
}