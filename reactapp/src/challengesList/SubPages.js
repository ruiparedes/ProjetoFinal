import React, { Component } from 'react';
import importedComponent from 'react-imported-component';


class SubPages extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {

        const type = this.props.match.params.name;
        const pageN = this.props.match.params.page;
        const myImportFunction = () => import('../challenges/' + pageN);
        const Component = importedComponent(myImportFunction);
        return <Component />;

    }
}

export default SubPages;