import React, { Component } from 'react';
import './Management.css';
import { Route, Redirect } from 'react-router-dom';

class Management extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectToCompetitionsManagement: false 
        }

        this.redirectToCompetitionsManagementF = this.redirectToCompetitionsManagementF.bind(this);
    }

    redirectToCompetitionsManagementF(){
        this.setState({redirectToCompetitionsManagement: true});
    }


    render() {

        if(this.state.redirectToCompetitionsManagement==true){
            this.setState({redirectToCompetitionsManagement: false});
            return <Redirect
            to={{
              pathname: "/management/competitions"
            }}
          />  
        }

        return (
            <div id="manContainer">
            <div id="outer-management-div">
            <h1 id="managementTitle">Management</h1>
                <div id="tabsDiv">
                    <div id="manCompetitionDiv" onClick= {this.redirectToCompetitionsManagementF}><h1>Competitions</h1></div>
                    <div id="manChallengesDiv"><h1>Challenges</h1></div>
                    <div id="manClassificationsDiv"><h1>Classifications</h1></div>
                    <div id="manSuggestionsDiv"><h1>Suggestions</h1></div>
                </div>
            </div>
            </div>
        );
    }
}

export default Management;