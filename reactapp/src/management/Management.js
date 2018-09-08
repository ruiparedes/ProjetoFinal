import React, { Component } from 'react';
import './Management.css';

class Management extends Component {
    render() {
        return (
            <div id="manContainer">
            <div id="outer-management-div">
            <h1 id="managementTitle">Management</h1>
                <div id="tabsDiv">
                    <div id="manCompetitionDiv"><h1>Competitions</h1></div>
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