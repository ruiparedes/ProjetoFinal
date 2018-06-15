import React, { Component } from 'react';
import importedComponent from 'react-imported-component';


//import Attack from "../challenges/CSRF";

class AttackPage extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const type = this.props.match.params.name;
        const myImportFunction = () => import('../challenges/' + type);
        const Component = importedComponent(myImportFunction);
        return <Component />;
    }
}

export default AttackPage;