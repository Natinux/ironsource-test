import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadUsers } from '../../actions';
import Users from './presenter';

const mapStateToProps = ({ Users }) => ({
    Users
});

const mapDispatchToProps = dispatch => ({
    loadUsers: bindActionCreators(loadUsers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);