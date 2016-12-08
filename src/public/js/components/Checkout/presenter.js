import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import {FormGroup, FormControl, ControlLabel, InputGroup, Glyphicon} from 'react-bootstrap';
import Select from 'react-select';
import Countries from 'iso-countries';
import selectn from 'selectn';
import {GeneralHelper} from '../../helpers';
import './checkout.css';

export default class Checkout extends Component{

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            country: ''
        };
    }

    validateFirstName(){
        if(this.state.firstName.length > 0) return 'success';
    }

    validateLastName(){
        if(this.state.lastName.length > 0) return 'success';
    }

    validateEmail(){
        if(this.state.email.length < 1) return null;
        return GeneralHelper.isEmail(this.state.email) ? 'success' : 'error';
    }

    validateCountry(){
        if(selectn('state.country.name', this)) return 'success';
        // if(this.state.country) return 'success';
    }

    onSelectCountry(country){
        // this.setState({country: country.name});
        this.setState({country});
    }

    handleSubmit(e){

        e.preventDefault();

        if(this.validateEmail() != 'success') return;
        if(this.validateFirstName() != 'success') return;
        if(this.validateLastName() != 'success') return;
        if(this.validateCountry() != 'success') return;

        this.props.saveUser({
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            country: this.state.country.name
        }).then(() => browserHistory.push(`/thankyou`))
    }

    render(){

        return (<div>
            <div className="row">
                <div className="form-box">
                    <h1>Checkout</h1>
                    
                    <form role="form" onSubmit={::this.handleSubmit}>
                        <FormGroup controlId="formEmail" validationState={::this.validateEmail()}>
                            <ControlLabel>Email *</ControlLabel>
                            <InputGroup>
                                <div className="input-group-addon"><Glyphicon glyph="envelope" /></div>
                                <FormControl
                                    ref="email"
                                    type="email"
                                    onChange={e => this.setState({ email: e.target.value })}
                                    placeholder="Enter email"/>
                                <FormControl.Feedback />
                            </InputGroup>
                        </FormGroup>


                        <FormGroup controlId="formFirstName" validationState={::this.validateFirstName()}>
                            <ControlLabel>Fisrt Name *</ControlLabel>
                            <InputGroup>
                                <div className="input-group-addon"><Glyphicon glyph="user" /></div>
                                <FormControl
                                    ref="firstName"
                                    type="text"
                                    onChange={e => this.setState({ firstName: e.target.value })}
                                    placeholder="First Name"/>
                                <FormControl.Feedback />
                            </InputGroup>
                        </FormGroup>

                        <FormGroup controlId="formLastName" validationState={::this.validateLastName()}>
                            <ControlLabel>Last Name *</ControlLabel>
                            <InputGroup>
                                <div className="input-group-addon"><Glyphicon glyph="user" /></div>
                                <FormControl
                                    ref="lastName"
                                    type="text"
                                    onChange={e => this.setState({ lastName: e.target.value })}
                                    placeholder="Last Name"/>
                                <FormControl.Feedback />
                            </InputGroup>
                        </FormGroup>

                        <FormGroup controlId="formCountry" validationState={::this.validateCountry()}>
                            <ControlLabel>Country *</ControlLabel>
                            <InputGroup>
                                <div className="input-group-addon"><Glyphicon glyph="flag" /></div>
                                <Select
                                    labelKey="name"
                                    value={this.state.country}
                                    placeholder="Select Country..."
                                    options={Countries.getSimpleCountryList()}
                                    onChange={::this.onSelectCountry}/>
                                <FormControl.Feedback />
                            </InputGroup>
                        </FormGroup>

                        <button type="submit" className="btn btn-default">Checkout</button>
                    </form>

                </div>
            </div>
        </div>);
    }
}