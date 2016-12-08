import React, {Component} from 'react';
import Spinner from 'react-spinkit';
import {Link} from 'react-router';

export default class Users extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount(){
        const { loadUsers } = this.props;
        loadUsers().then(() => this.setState({isLoading: false}));
    }

    render(){
        const { Users } = this.props;
        const { isLoading } = this.state;

        return (
            <div>
                <h3>Users</h3>

                {
                    isLoading ? <Spinner spinnerName='three-bounce' /> : null
                }

                <div className="table">
                    <table className="table table-striped table-hover table-bordered">
                        <thead className="thead-inverse">
                        <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Country</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            Users.map((user, key) => {
                                return (
                                    <tr key={key}>
                                        <th scope="row">{key}</th>
                                        <td><Link to={`#`}>{user.email}</Link></td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.country}</td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>

                </div>
            </div>
        );
    }
}