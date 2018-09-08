import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import './CompetitionsList.css';
import { Route, Redirect } from 'react-router-dom';
let localUser = JSON.parse(localStorage.getItem('userData'));

class CompetitionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competitions: [],
            myCompetitions: [],
            competitionToEnter: null,
            redirectToCompetitionChallenges: false,
            redirectToLeaderBoard: false,
            leaderboardToEnter:null

        }
        this.fetchCompetitions = this.fetchCompetitions.bind(this);
        this.fetchUserRegistrations = this.fetchUserRegistrations.bind(this);
        this.registerCompetition = this.registerCompetition.bind(this);
        this.enterCompetition = this.enterCompetition.bind(this);
        this.enterLeaderboard = this.enterLeaderboard.bind(this);
    }


    componentDidMount() {
        window.registrationsListener = setInterval(() => this.fetchUserRegistrations(), 1000);
        window.competitionsListener = setInterval(() => this.fetchCompetitions(), 1000);
        this.fetchCompetitions();
        this.fetchUserRegistrations();

    }

    componentWillUnmount() {
        clearInterval(this.interval);
      }

    fetchCompetitions() {
        fetch(URL + ':8080/api/competitions/View').then(res => res.json()).
            then(data => this.setState({ competitions: data.competitions }));
    }

    fetchUserRegistrations() {
        let userID = localUser.id;
        const getUserCompetitions = URL + ':8080/api/userRegistrations/' + userID;
        fetch(getUserCompetitions).then(res => res.json())
            .then(data => {
                this.setState({ myCompetitions: data.registrations })
            });
    }

    isRegistered = (currentCompetition) => {

        let userCompetitions = this.state.myCompetitions.filter(c => c.competitionID === currentCompetition.id);

        if (userCompetitions.length > 0) {
            return true;
        }
        return false;

    }

    registerCompetition(competitionID){
        let userID = localUser.id;
        fetch(URL + ':8080/api/registrations/Add', {
            method: 'POST',
            body: JSON.stringify({
                userID: userID,
                competitionID: competitionID
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
    }

    enterCompetition(competitionID){
        this.setState({competitionToEnter: competitionID, redirectToCompetitionChallenges: true});

    }

    enterLeaderboard(competitionID){
        this.setState({leaderboardToEnter: competitionID, redirectToLeaderBoard: true});
    }



    render() {
        if(this.state.redirectToCompetitionChallenges == true) {
            this.setState({redirectToCompetitionChallenges: false});
            return <Redirect to={{
                pathname: '/competitionChallenges',
                state: {competitionID: this.state.competitionToEnter},
            }} />
        }

        else if(this.state.redirectToLeaderBoard == true) {
            this.setState({redirectToLeaderBoard: false});
            return <Redirect to={{
                pathname: '/leaderboard',
                state: {competitionID: this.state.leaderboardToEnter},
            }} />
        }

        return (
            
            <div>
                {this.state.competitions.map((competition, competitionIndex) => (
                    <div id="competitionBox" key={'competitionBox_' + competitionIndex}>
                        <div id="competitionName"><h2>{competition.name}</h2></div>
                        <div id="competitionParticipants"><h4>Participants: {competition.totalParticipants}/{competition.maxParticipants}</h4></div>
                        <div id="competitionDates"><h4>Competition Date: {competition.startDate} / {competition.endDate}</h4></div>
                        <div id="competitionStatus"><h4>Status: {competition.statusName}</h4></div>
                        <div id="buttonDiv">
                            {this.isRegistered(competition) ? <button type="submit" value="EnterInCompetition" className="EnterInCompetitionButton" id="enterButton" onClick={() => {this.enterCompetition(competition.id)}}  >Entrar</button>
                                : <button type="submit" value="RegisterInCompetition" className="RegisterInCompetitionButton" id="registerButton" onClick={() => {this.registerCompetition(competition.id)}} >Registar</button>}</div>
                                <div id="buttonDiv">{competition.statusName == 'Closed' ? <button type="submit" value="EnterLeaderboard" className="EnterLeaderboard" id="enterLeaderboard" onClick={() => {this.enterLeaderboard(competition.id)}}  >Leaderboard</button>
                                : <div></div>}</div>
                    </div>
                ))}
            </div>
        );
    }
}

export default CompetitionsList;