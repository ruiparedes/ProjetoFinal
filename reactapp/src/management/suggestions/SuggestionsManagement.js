import React, { Component } from 'react';
import './SuggestionsManagement.css'
import { URL } from '../../shared/Constants';
import { Route, Redirect } from 'react-router-dom';

class SuggestionsManagement extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allSuggestions: []

        }
        this.fetchAllSuggestions = this.fetchAllSuggestions.bind(this);
        this.denySuggestion = this.denySuggestion.bind(this);
        this.acceptSuggestion = this.acceptSuggestion.bind(this);
    }

    componentDidMount() {
        window.suggestionsInfoListener = setInterval(() => this.fetchAllSuggestions(), 1000);
        this.fetchAllSuggestions();
    }

    fetchAllSuggestions() {
        const getAllSuggestions = URL + ':8080/api/challengeSuggestions/View';
        fetch(getAllSuggestions).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ allSuggestions: data.challengeSuggestion })
            });
    }

    denySuggestion(suggestionID) {
        fetch(URL + ':8080/api/challengeSuggestions/Deny', {
            method: 'POST',
            body: JSON.stringify({
                id: suggestionID
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }

    acceptSuggestion(suggestionID, name, description, link, mainFile, solution, classificationID, difficultyID) {

        fetch(URL + ':8080/api/challengeSuggestions/Accept', {
            method: 'POST',
            body: JSON.stringify({
                challengeSuggestionID: suggestionID,
                name: name,
                description: description,
                link: link,
                mainFile: mainFile,
                solution: solution,
                classificationID: classificationID,
                difficultyID: difficultyID
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }


    render() {

         if(localStorage.getItem('userData') == null){
            return <Redirect to={{
                pathname: '/login'
            }} />
        }

        return (
            <div id="challengeManContainer">
                <div id="outer-management-challenge-div">
                    <h1 id="challengeManagementTitle">Challenges Suggestions - Management</h1>
                    <div class="divTable">
                        <div class="divTableBody">
                            <div class="divTableRow">
                                <div id="managementchallengechallengeNameTitle">User</div>
                                <div id="managementchallengechallengeNameTitle">Name</div>
                                <div id="managementchallengechallengeDescriptionTitle">Description</div>
                                <div id="managementchallengechallengeLinkTitle">Link</div>
                                <div id="managementchallengechallengeMainFileTitle">Main File</div>
                                <div id="managementchallengechallengeSolutionTitle">Solution</div>
                                <div id="managementchallengechallengeClassificationTitle">Classification</div>
                                <div id="managementchallengechallengeDifficultyTitle">Difficulty</div>
                                <div id="managementchallengechallengeStatusTitle">Status</div>
                                <div id="managementchallengeButtonsTitleDiv">Accept/Deny</div>
                            </div>
                            {this.state.allSuggestions.map((suggestion, suggestionIndex) => (
                                <div class="divTableRow">
                                    <div id="managementchallengechallengeNameValue">{suggestion.username}</div>
                                    <div id="managementchallengechallengeNameValue">{suggestion.name}</div>
                                    <div id="managementchallengechallengeDescriptionValue">{suggestion.description}</div>
                                    <div id="managementchallengechallengeLinkValue">{suggestion.link}</div>
                                    <div id="managementchallengechallengeMainFileValue">{suggestion.mainFile}</div>
                                    <div id="managementchallengechallengeSolutionValue">{suggestion.solution}</div>
                                    <div id="managementchallengechallengeClassificationValue">{suggestion.classification}</div>
                                    <div id="managementchallengechallengeDifficultyValue">{suggestion.level}</div>
                                    <div id="managementchallengechallengeStatusValue">{suggestion.status}</div>
                                    {suggestion.statusID == 1 ?
                                        <div id="managementchallengeButtonsDiv">
                                            <div id="managementchallengeAcceptButtonDiv"><button type="submit" value="managementchallengeAcceptButton" id="managementChallAcceptButton" onClick={() => { this.acceptSuggestion(suggestion.id, suggestion.name, suggestion.description, suggestion.link, suggestion.mainFile, suggestion.solution, suggestion.classificationID, suggestion.difficultyID) }}>Accept</button></div>
                                            <div id="managementchallengeDenyButtonDiv"><button type="submit" value="managementchallengeDenyButton" id="managementChallDenyButton" onClick={() => { this.denySuggestion(suggestion.id) }}>Deny</button></div>
                                        </div>
                                        : <div id="managementchallengechallengeStatusValue">{suggestion.status}</div>}


                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SuggestionsManagement;