import React, { Component } from 'react';
import './noAuthority.css';

class noAuthority extends Component {
    render() {
        return (
            <div id= "outerUnauthorizedDiv">
            <h1>Unauthorized Area!!</h1>
                <h1>You don't have permissions to enter in this section of the application!</h1>
            </div>
        );
    }
}

export default noAuthority;