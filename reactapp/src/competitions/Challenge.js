import React, { Component } from 'react';
import importedComponent from 'react-imported-component';
import queryString from 'query-string';

class Challenge extends React.Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        var challengeName = this.props.match.params.name;
        var challengeID = this.props.location.state.challengeID;
        var challengeLink = this.props.location.state.challengeLink;
        var competitionID = this.props.location.state.competitionID;
        var link =challengeLink.substr(14, challengeLink.length);
        console.log(challengeName);
        console.log(challengeID);
        console.log(challengeLink);
        console.log(competitionID);
        console.log(link);

        const values = queryString.parse(this.props.location.search);

        const myImportFunction = () => import('../challenges/'+link);
        const Component = importedComponent(myImportFunction);
        return <Component challengeID={challengeID}  challengeName={challengeName} competitionID={competitionID} value={values}/>;
        
    }
}

export default Challenge;