import React, { Component } from 'react';
import './CompetitionsManagement.css'

class Competitions extends Component {
    render() {
        return (
            <div id="competitionManContainer">
            <div id="outer-management-competition-div">
            <h1 id="competitionManagementTitle">Competitions - Management</h1>
                <div id="competitionTabsDiv">
                    <div id="manAddCompetitionDiv"><h1>Add Competition</h1></div>
                    <div id="manAlterCompetitionChallengesDiv"><h1>Alter Competition' Challenges</h1></div>
                    <div id="manAlterCompetitionDiv"><h1>Alter Competition</h1></div>
                    <div id="manDeleteCompetitionDiv"><h1>Delete Competition</h1></div>
                </div>
            </div>
            </div>
        );
    }
}

export default Competitions;