import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import './CompetitionsList.css';

class CompetitionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competitions: []

        }
        this.fetchCompetitions = this.fetchCompetitions.bind(this);
    }


    componentDidMount() {
        this.fetchCompetitions();
    }

    fetchCompetitions() {
        fetch(URL + ':8080/api/competitions/View').then(res => res.json()).
            then(data => this.setState({ competitions: data.competitions }));
    }


    render() {
        return (
            <div>
            {this.state.competitions.map((competition,competitionIndex) =>(
                <div id="competitionBox" key={'competitionBox_' + competitionIndex}>
                <div id="competitionName"><h2>{competition.name}</h2></div>
                <div id="competitionParticipants"><h4>Participants: {competition.totalParticipants}/{competition.maxParticipants}</h4></div> 
                <div id="competitionDates"><h4>Competition Date: {competition.startDate} / {competition.endDate}</h4></div>    
                <div id="competitionStatus"><h4>Status: {competition.status}</h4></div>
                <div id="buttonDiv"><button type="submit" value="RegisterInCompetition" className="RegisterInCompetitionButton" id="registerButton" >Register</button></div>         
                </div>
                ))}
            </div>
        );
    }
}

export default CompetitionsList;