import './main.less';
import {Link} from 'react-router';
import {Navbar} from 'react-bootstrap';
import React, { Component } from 'react';
import Alert from '../components/Alert';

const Home = ({ children }) => {
    return <div>
        <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to="/">Home</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <ul className="nav navbar-nav">
                    <li className="presentation">
                        <Link to="/checkout">Checkout</Link>
                    </li>
                    <li className="presentation">
                        <Link to="/users">Users</Link>
                    </li>
                </ul>
            </Navbar.Collapse>
        </Navbar>
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <Alert/>
                {children}
            </div>
        </div>
    </div>;

};

export default Home;