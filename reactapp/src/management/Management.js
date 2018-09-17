import React, { Component } from 'react';
import './Management.css';
import { Route, Redirect } from 'react-router-dom';
let localUser = JSON.parse(localStorage.getItem('userData'));

class Management extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectToCompetitionsManagement: false,
            redirectToChallengesManagement: false, 
            redirectToClassificationsManagement: false, 
            redirectToSuggestionsManagement: false  
        }

        this.redirectToCompetitionsManagementF = this.redirectToCompetitionsManagementF.bind(this);
        this.redirectToChallengesManagementF = this.redirectToChallengesManagementF.bind(this);
        this.redirectToClassificationsManagementF = this.redirectToClassificationsManagementF.bind(this);
        this.redirectToSuggestionsManagementF = this.redirectToSuggestionsManagementF.bind(this);
    }

    redirectToCompetitionsManagementF(){
        this.setState({redirectToCompetitionsManagement: true});
    }
    redirectToChallengesManagementF(){
        this.setState({redirectToChallengesManagement: true});
    }
    redirectToClassificationsManagementF(){
        this.setState({redirectToClassificationsManagement: true});
    }
    redirectToSuggestionsManagementF(){
        this.setState({redirectToSuggestionsManagement: true});
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
        else if(this.state.redirectToChallengesManagement==true){
            this.setState({redirectToChallengesManagement: false});
            return <Redirect
            to={{
              pathname: "/management/challenges"
            }}
          />  
        }
        if(this.state.redirectToClassificationsManagement==true){
            this.setState({redirectToClassificationsManagement: false});
            return <Redirect
            to={{
              pathname: "/management/classifications"
            }}
          />  
        }
        if(this.state.redirectToSuggestionsManagement==true){
            this.setState({redirectToSuggestionsManagement: false});
            return <Redirect
            to={{
              pathname: "/management/suggestions"
            }}
          />  
        }
        else if(localStorage.getItem('userData') == null){
            return <Redirect to={{
                pathname: '/login'
            }} />
        }
        else if(localUser.role != 'admin'){
            return <Redirect to={{
                pathname: '/noAuthority'
            }} />
        }

        

        return (
            <div id="manContainer">
            <div id="outer-management-div">
            <h1 id="managementTitle">Management</h1>
                <div id="tabsDiv">
                    <div id="manCompetitionDiv" onClick= {this.redirectToCompetitionsManagementF}><h1>Competitions</h1></div>
                    <div id="manChallengesDiv" onClick= {this.redirectToChallengesManagementF}><h1>Challenges</h1></div>
                    <div id="manClassificationsDiv" onClick= {this.redirectToClassificationsManagementF}><h1>Classifications</h1></div>
                    <div id="manSuggestionsDiv" onClick= {this.redirectToSuggestionsManagementF}><h1>Suggestions</h1></div>
                </div>
            </div>
            </div>
        );
    }
}

export default Management;