import React, { Component } from 'react';
import importedComponent from 'react-imported-component';
import queryString from 'query-string';


//import Attack from "../challenges/CSRF";

class AttackPage extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const type = this.props.match.params.nameId;
        var name= type.substr(0, type.indexOf('_')); 
        var id = type.split('_').pop();
        console.log(type);
        console.log(name);
        const values = queryString.parse(this.props.location.search);
        const myImportFunction = () => import('../challenges/' + type);
        if(name !='') {
        const myImportFunction = () => import('../challenges/' + name);
        const Component = importedComponent(myImportFunction);
        return <Component id={id}  name={name} value={values}/>;
    }

        const Component = importedComponent(myImportFunction);
        return <Component id={id}  name={name} value={values}/>;
    }
}

export default AttackPage;