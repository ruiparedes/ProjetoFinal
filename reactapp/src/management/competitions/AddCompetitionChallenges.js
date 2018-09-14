import React, { Component } from 'react';
import './AddCompetitionChallenges.css';
import { URL } from '../../shared/Constants';
import { Route, Redirect } from 'react-router-dom';
let localUser = JSON.parse(localStorage.getItem('userData'));

class AddCompetitionChallenges extends Component {
    constructor(props) {
        super(props);

        this.state = {
            competitionInfo: [],
            challenges: [],
            competitionChallenges: [],
            selectedChallenge: 0,
            challengeToInsertScore: 0,
            redirectToCompetitionStatus: false
        }

        this.fetchCompetitionInfo = this.fetchCompetitionInfo.bind(this);
        this.fetchAllChallenges = this.fetchAllChallenges.bind(this);
        this.fetchCompetitionChallenges = this.fetchCompetitionChallenges.bind(this);
        this.handleSelectedOption = this.handleSelectedOption.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addChallengeToCompetition = this.addChallengeToCompetition.bind(this);
        this.redirectToUpdateCompetitionStatus = this.redirectToUpdateCompetitionStatus.bind(this);
    }

    componentDidMount() {
        console.log('IN THE ADD COMPETITION CHALLENGES COMPONENT');
        console.log(this.props.location.state.competitionID);

        window.competitionInfoListener = setInterval(() => this.fetchCompetitionInfo(), 1000);
        window.competitionChallengesListener = setInterval(() => this.fetchCompetitionChallenges(), 1000);

        this.fetchCompetitionInfo();
        this.fetchAllChallenges();
        this.fetchCompetitionChallenges();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fetchCompetitionInfo() {
        const getCompetitionByID = URL + ':8080/api/getcompetitionByID/' + this.props.location.state.competitionID;

        console.log(getCompetitionByID);
        fetch(getCompetitionByID).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ competitionInfo: data.competition })
            });
    }
    fetchAllChallenges() {
        const getAllChallenges = URL + ':8080/api/challenges/View';
        fetch(getAllChallenges).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ challenges: data.challenges })
            });
    }

    fetchCompetitionChallenges() {
        const getCompetitionChallenges = URL + ':8080/api/challengesPerCompetition/getCompetitionChallenges/' + this.props.location.state.competitionID;
        fetch(getCompetitionChallenges).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ competitionChallenges: data.competitionChallenges });
            });
    }

    handleSelectedOption(e) {
        this.setState({ selectedChallenge: e.target.value });
    }

    onChange(e) {
        this.setState({ challengeToInsertScore: e.target.value });
        console.log({ challengeToInsertScore: e.target.value });
    }

    addChallengeToCompetition() {
        console.log('A ENVIAR');
        console.log(this.props.location.state.competitionID);
        console.log(this.state.selectedChallenge);
        console.log(this.state.challengeToInsertScore);
        fetch(URL + ':8080/api/challengesPerCompetition/Add', {
            method: 'POST',
            body: JSON.stringify({
                competitionID: this.props.location.state.competitionID,
                challengeID: Number(this.state.selectedChallenge),
                challengePoints: Number(this.state.challengeToInsertScore)
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
    }

    redirectToUpdateCompetitionStatus(){
        this.setState({redirectToCompetitionStatus: true});
    }



    render() {

        if(this.state.redirectToCompetitionStatus == true) {
            this.setState({redirectToCompetitionStatus: false});
            return <Redirect to={{
                pathname: '/management/competitions/alterCompetitionStatus',
                state: {competitionID: this.props.location.state.competitionID, competitionName: this.state.competitionInfo.name, competitionCurrentStatus: this.state.competitionInfo.statusName},
            }} />
        }
        else if(localStorage.getItem('userData') == null){
            return <Redirect to={{
                pathname: '/login'
            }} />
        }else if(localUser.role != 'admin'){
            return <Redirect to={{
                pathname: '/noAuthority'
            }} />
        }





        console.log(this.state.selectedChallenge);
        return (
            <div id="addChallengesToCompetitionOuterDiv">
                <div id="addChallengesToCompetitionInnerDiv">
                    <h1>{this.state.competitionInfo.name} - Add Challenges</h1>
                    <div id="addChallengesToCompetitionCompetitionChallenges">
                        <div id="table-div">
                            <div class="divTableRow">
                                <div id="divCompetitionChallengeName"><h2>Challenge Name</h2></div>
                                <div id="divCompetitionChallengeScore"><h2>Score</h2></div>
                            </div>
                            {this.state.competitionChallenges.map((competitionChallenge, competitionChallengeIndex) => (
                                <div class="divTableRow">
                                    <div id="divCompetitionChallengeNameValue"><h3>{competitionChallenge.name}</h3></div>
                                    <div id="divCompetitionChallengeScoreValue"><h3>{competitionChallenge.challengePoints}</h3></div>
                                </div>
                            ))}
                        </div>
                        <div id="newCompetitionChallengeInsert  ">
                            <div id="custom-select"><h3>Select new Challenge:</h3>
                                <select id="selectNewChallenge" onChange={this.handleSelectedOption}>
                                    <option disabled selected value> -- Select a Challenge -- </option>
                                    {this.state.challenges.map((challenge, challengeIndex) => (
                                        <option value={challenge.id}>{challenge.name}</option>
                                    ))}
                                </select>
                            </div>
                            <h3>Challenge Description: </h3>
                            <div id="selectedChallengeDescriptionDiv">
                                {this.state.challenges.map((challenge, challengeIndex) => (
                                    <div>
                                        {this.state.selectedChallenge == challenge.id ? <h3 id="selectedChallengeDescriptionTextArea">{challenge.description}</h3>
                                            : null}
                                    </div>
                                ))}
                            </div>
                            <div id="newCompetitionScoreDiv"><h3 id="newCompetitionScoreTitle">Score: </h3><input type="number" id="newCompetitionChallengeScoreInput" className="newCompetitionChallengeScore" onChange={this.onChange} required></input></div>
                            <div id="addChallengeToCompetitionButtonDiv"><button type="submit" value="addChallengeToCompetitionButton" id="addChallengeToCompButton" onClick={this.addChallengeToCompetition}>Add Challenge to Competition</button></div>
                            <div id="addChallengeToCompetitionNextStepDiv"><button type="submit" value="addChallengeToCompetitionNextStepButton" id="addChallengeToCompNextStepButton" onClick={this.redirectToUpdateCompetitionStatus}>Next Step >></button></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddCompetitionChallenges;