import React, { Component } from 'react';
import './ChallengesManagement.css'
import { URL } from '../../shared/Constants';
import { Route, Redirect } from 'react-router-dom';
import Notifications, {notify} from 'react-notify-toast';

class ChallengesManagement extends Component {


    constructor(props) {
        super(props);

        this.state = {
            allChallenges: [],
            redirectToAddNewChallenge:false
            
        }
        this.fetchAllChallenges = this.fetchAllChallenges.bind(this);
        this.addNewChallenge = this.addNewChallenge.bind(this);
        this.deleteChallenge = this.deleteChallenge.bind(this);
    }


    componentDidMount() {
        window.challengesInfoListener = setInterval(() => this.fetchAllChallenges(), 1000);
        this.fetchAllChallenges();
    }


    fetchAllChallenges() {
        const getAllChallenges = URL + ':8080/api/challenges/View';
        fetch(getAllChallenges).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ allChallenges: data.challenges })
            });
    }

    addNewChallenge(){
        this.setState({redirectToAddNewChallenge: true});
    }

    deleteChallenge(challengeID){
        console.log('On Delete')
        fetch(URL + ':8080/api/challenges/Delete', {
            method: 'POST',
            body: JSON.stringify({
                id: challengeID
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json().then(data => ({status: res.status, body: data})))
        .then(obj =>{
            if(obj.status ===400){
                notify.show('Challenge cannot be deleted (In-use)');
            }
        })

    }

    render() {

        if(this.state.redirectToAddNewChallenge==true){
            this.setState({redirectToAddNewChallenge: false});
            return <Redirect
            to={{
              pathname: "/management/challenges/addChallenge"
            }}
          />  
        }

        return (
            <div id="challengeManContainer">
                <div id="outer-management-challenge-div">
                    <h1 id="challengeManagementTitle">Challenges - Management</h1>
                    <div class="divTable">
                        <div class="divTableBody">
                            <div class="divTableRow">
                                <div id="managementchallengechallengeNameTitle">Name</div>
                                <div id="managementchallengechallengeDescriptionTitle">Description</div>
                                <div id="managementchallengechallengeLinkTitle">Link</div>
                                <div id="managementchallengechallengeMainFileTitle">Main File</div>
                                <div id="managementchallengechallengeSolutionTitle">Solution</div>
                                <div id="managementchallengechallengeClassificationTitle">Classification</div>
                                <div id="managementchallengechallengeDifficultyTitle">Difficulty</div>
                                <div id="managementchallengeButtonsTitleDiv">Update Fields</div>
                            </div>
                            {this.state.allChallenges.map((challenge, challengeIndex) => (
                            <div class="divTableRow">
                                <div id="managementchallengechallengeNameValue">{challenge.name}</div>
                                <div id="managementchallengechallengeDescriptionValue">{challenge.description}</div>
                                <div id="managementchallengechallengeLinkValue">{challenge.link}</div>
                                <div id="managementchallengechallengeMainFileValue">{challenge.mainFile}</div>
                                <div id="managementchallengechallengeSolutionValue">{challenge.solution}</div>
                                <div id="managementchallengechallengeClassificationValue">{challenge.classification}</div>
                                <div id="managementchallengechallengeDifficultyValue">{challenge.level}</div>
                                <div id="managementchallengeButtonsDiv">
                                <div id="managementchallengeDeleteButtonDiv"><button type="submit" value="managementchallengeDeleteButton" id="managementChallDeleteButton" onClick = { () => {this.deleteChallenge(challenge.id)}}>Delete</button></div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" value="managementchallengeAddchallenge" id="managementChallengeAddchallenge"  onClick = {this.addNewChallenge}>Add New Challenge</button>
                </div>
            </div>
        );
    }
}

export default ChallengesManagement;