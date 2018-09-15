import React, { Component } from 'react';
import importedComponent from 'react-imported-component';
import queryString from 'query-string';

class Challenge extends React.Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        if(this.props.location.state== undefined){
            window.location.href = "/errorHandler";
        }
        var challengeName = this.props.match.params.name;
        var challengeID = this.props.location.state.challengeID;
        var challengeLink = this.props.location.state.challengeLink;
        var competitionID = this.props.location.state.competitionID;
        var link =challengeLink.substr(14, challengeLink.length);


        const values = queryString.parse(this.props.location.search);

        const myImportFunction = () => import('../challenges/'+link);
        const Component = importedComponent(myImportFunction);
        return <Component challengeID={challengeID}  challengeName={challengeName} competitionID={competitionID} value={values}/>;
        
    }
}

export default Challenge;