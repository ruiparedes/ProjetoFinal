import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import './CompetitionChallenges.css';
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
            participantInfo: []
        }
        this.fetchCompetitionChallenges = this.fetchCompetitionChallenges.bind(this);
        this.fetchAllChallenges = this.fetchAllChallenges.bind(this);
        this.fetchCompetitionInfo = this.fetchCompetitionInfo.bind(this);
        this.fetchParticipantInfo = this.fetchParticipantInfo.bind(this);
        this.fetchChallengesDone = this.fetchChallengesDone.bind(this);
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

    render() {
        console.log(this.state.challengesDone); 
        return (
            <div>
                <h1>{this.state.competitionInfo.name}</h1>
                <h3>Pontuação: {this.state.participantInfo.finalScore}/{this.state.competitionInfo.maxScore}</h3>
                {this.state.competitionChallenges.map((challenge, challengeIndex) => (
                    <div>
                        <div><p>{challenge.name}</p></div>
                        <div>
                        {this.state.challengesDone.length == 0 ? <div><div><p>Score: 0/{challenge.challengePoints}</p></div><div><p>Time: 0</p></div></div>
                                : <div>{this.state.challengesDone.map((challengeDone, challengeDoneIndex) => (
                                    <div> {challenge.id == challengeDone.id ? <div><div><p>Score: {challengeDone.score}/{challenge.challengePoints}</p></div> <div><p>Time: {challengeDone.time}</p></div></div>
                                        : <div><div><p>Score: 0/{challenge.challengePoints}</p></div> <div><p>Time: 0</p></div></div>}</div>
                                ))}</div>}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default CompetitionChallenges;