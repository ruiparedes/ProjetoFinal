import React, { Component } from 'react';
import './errorComponent.css';

class errorComponent extends Component {
    render() {
        return (
            <div id= "errorDiv">
                <h1>Something went wrong!!</h1>
                <h3>If you are trying to access a competition or a challenge, please do it by accessing it through the Competitions Section.</h3>
            </div>
        );
    }
}

export default errorComponent;