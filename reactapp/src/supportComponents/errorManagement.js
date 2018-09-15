import React, { Component } from 'react';
import './errorManagement.css';

class errorManagement extends Component {
    render() {
        return (
            <div id= "errorManagementDiv">
            <h1>Something went wrong!!</h1>
            <h3>If you are trying to access a subsection of the management section, please do it by accessing it through the Management Section.</h3>
        </div>
        );
    }
}

export default errorManagement;