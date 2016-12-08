import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkout from './presenter';
import {saveUser} from '../../actions';

const mapDispatchToProps = dispatch => ({
    saveUser: bindActionCreators(saveUser, dispatch)

});

export default connect(null, mapDispatchToProps)(Checkout);