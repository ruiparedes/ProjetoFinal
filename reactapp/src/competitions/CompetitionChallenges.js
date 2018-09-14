import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import './CompetitionChallenges.css';
import { Route, Redirect } from 'react-router-dom';
let localUser = JSON.parse(localStorage.getItem('userData'));


class CompetitionChallenges extends Component {

    constructor(props) {
        super(props);
        this.state = {
            competitionChallenges: [],
            challengesDone: [],
            competitionID: '',
            challenges: [],
            competitionInfo: [],
            participantInfo: [],
            redirectToChallenge: false,
            challengeToEnterID:'',
            challengeToEnterLink:'',
            challengeToEnterName:''
        }
        this.fetchCompetitionChallenges = this.fetchCompetitionChallenges.bind(this);
        this.fetchAllChallenges = this.fetchAllChallenges.bind(this);
        this.fetchCompetitionInfo = this.fetchCompetitionInfo.bind(this);
        this.fetchParticipantInfo = this.fetchParticipantInfo.bind(this);
        this.fetchChallengesDone = this.fetchChallengesDone.bind(this);
        this.enterChallenge = this.enterChallenge.bind(this);
    }


    componentDidMount() {
        console.log(this.props.location.state.competitionID)
        this.setState({ competitionID: this.props.location.state.competitionID });
        this.fetchCompetitionChallenges();
        this.fetchAllChallenges();
        this.fetchCompetitionInfo();
        this.fetchParticipantInfo();
        this.fetchChallengesDone();
    }

    fetchParticipantInfo() {
        let userID = localUser.id;
        const getParticipantFinalScore = URL + ':8080/api/registrations/participantInfo/' + this.props.location.state.competitionID + '/' + userID;
        fetch(getParticipantFinalScore).then(res => res.json())
            .then(data => {
                this.setState({ participantInfo: data.participantInfo });
            })

    }

    fetchCompetitionInfo() {
        const getCompetitionInfo = URL + ':8080/api/getcompetitionByID/' + this.props.location.state.competitionID;
        fetch(getCompetitionInfo).then(res => res.json())
            .then(data => {
                this.setState({ competitionInfo: data.competition });
            })
    }

    fetchAllChallenges() {
        fetch(URL + ':8080/api/challenges/View').then(res => res.json()).
            then(data => this.setState({ challenges: data.challenges }));
    }

    fetchCompetitionChallenges() {
        const getCompetitionChallenges = URL + ':8080/api/challengesPerCompetition/getCompetitionChallenges/' + this.props.location.state.competitionID;
        fetch(getCompetitionChallenges).then(res => res.json())
            .then(data => {
                this.setState({ competitionChallenges: data.competitionChallenges });
            })
    }

    fetchChallengesDone() {
        let userID = localUser.id;
        const getChallengesDone = URL + ':8080/api/scorePerChallengePerCompetition/challengesDone/' + this.props.location.state.competitionID + '/' + userID;
        console.log(URL + ':8080/api/scorePerChallengePerCompetition/challengesDone/' + this.props.location.state.competitionID + '/' + userID);
        fetch(getChallengesDone).then(res => res.json())
            .then(data => {
                this.setState({ challengesDone: data.challengesDone });
            })
    }


    enterChallenge(challengeID, challengeName, challengeLink){
        this.setState({challengeToEnterID: challengeID});
        this.setState({challengeToEnterName: challengeName});  
        this.setState({challengeToEnterLink: challengeLink});        
        this.setState({redirectToChallenge: true});
    }


    render() {
        if(this.state.redirectToChallenge==true){
            this.setState({redirectToChallenge: false});
            return <Redirect
            to={{
              pathname: "/challenge/" + this.state.challengeToEnterName,
              state: {challengeID: this.state.challengeToEnterID, challengeLink: this.state.challengeToEnterLink, competitionID: this.props.location.state.competitionID}
            }}
          />  
        }



        console.log(this.state.competitionChallenges);
        return (
            <div id="outer-div">
                <div id="competitionNameDiv"><h1 id ="competitionChallengesCompetitionName">{this.state.competitionInfo.name}</h1></div>
                <div id="competitionStatusDiv"><h2>Status: {this.state.competitionInfo.statusName}</h2></div>
                <div id="competitionScoreDiv"><h3>Total Score: {this.state.participantInfo.finalScore}/{this.state.competitionInfo.maxScore}</h3></div>
                {this.state.competitionChallenges.map((challenge, challengeIndex) => (
                    <div id="challengeInfoDiv" onClick = {() => {this.enterChallenge(challenge.challengeID, challenge.name, challenge.link)}}>
                        <div id="challengeNameDiv"><p>{challenge.name}</p></div>
                        {this.state.challengesDone.length == 0 ? <div id="ScoreAndTimeDiv"><div id="challengeScoreDiv"><p>Score: 0/{challenge.challengePoints}</p></div><div id="challengeTimeDiv"><p>Time: 0</p></div></div>
                            : <div>{this.state.challengesDone.map((challengeDone, challengeDoneIndex) => (
                                <div> {challenge.id == challengeDone.id ? <div id="ScoreAndTimeDiv"><div id="challengeScoreDiv"><p>Score: {challengeDone.score}/{challenge.challengePoints}</p></div> <div id="challengeTimeDiv"><p>Time: {challengeDone.time}</p></div></div>
                                    : <div id="ScoreAndTimeDiv"><div id="challengeScoreDiv"><p>Score: 0/{challenge.challengePoints}</p></div> <div id="challengeTimeDiv"><p>Time: 0</p></div></div>}</div>
                            ))}</div>}
                        <div id="challengeDifficultyDiv"><p>Difficulty: {challenge.level}</p></div>
                        <div id="challengeTypeDiv"><p>Type: {challenge.classification}</p></div>
                    </div>
                ))}
            </div>
        );
    }
}

export default CompetitionChallenges;