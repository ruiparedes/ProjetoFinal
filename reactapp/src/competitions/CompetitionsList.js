import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import './CompetitionsList.css';
let localUser = JSON.parse(localStorage.getItem('userData'));

class CompetitionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competitions: [],
            myCompetitions: []

        }
        this.fetchCompetitions = this.fetchCompetitions.bind(this);
        this.fetchUserRegistrations = this.fetchUserRegistrations.bind(this);
    }


    componentDidMount() {
        this.fetchCompetitions();
        this.fetchUserRegistrations();

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



    render() {

        return (
            <div>
                {this.state.competitions.map((competition, competitionIndex) => (
                    <div id="competitionBox" key={'competitionBox_' + competitionIndex}>
                        <div id="competitionName"><h2>{competition.name}</h2></div>
                        <div id="competitionParticipants"><h4>Participants: {competition.totalParticipants}/{competition.maxParticipants}</h4></div>
                        <div id="competitionDates"><h4>Competition Date: {competition.startDate} / {competition.endDate}</h4></div>
                        <div id="competitionStatus"><h4>Status: {competition.status}</h4></div>
                        <div id="buttonDiv">
                            {this.isRegistered(competition) ? <button type="submit" value="EnterInCompetition" className="EnterInCompetitionButton" id="enterButton" >Entrar</button>
                                : <button type="submit" value="RegisterInCompetition" className="RegisterInCompetitionButton" id="registerButton" >Registar</button>}</div>
                    </div>
                ))}
            </div>
        );
    }
}

export default CompetitionsList;