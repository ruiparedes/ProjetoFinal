import React, { Component } from 'react';
import CSRF from "../challenges/CSRF";
import SQLi from "../challenges/SQLi";


//import Attack from "../challenges/CSRF";

class AttackPage extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        var Attack = this.props.location.state.referrer;
        return <Attack />;
    }
}

export default AttackPage;