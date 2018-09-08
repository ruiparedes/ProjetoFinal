import React, { Component } from 'react';
import './Leaderboard.css';
import { URL } from '../shared/Constants';

class Leaderboard extends Component {


    constructor(props) {
        super(props);
            this.state = {
                registrations:[],
                competitionName:''
            }

            this.fetchAllCompetitionRegistrations = this.fetchAllCompetitionRegistrations.bind(this);
        }

        componentDidMount() {
            this.fetchAllCompetitionRegistrations();
        }
        

        fetchAllCompetitionRegistrations(){
            const competitionID = this.props.location.state.competitionID;
            const getCompetitionRegistrations = URL + ':8080/api/registrations/getCompetitionRegistrations/'+competitionID;
            fetch(getCompetitionRegistrations).then(res => res.json())
            .then(data => {
                this.setState({registrations: data.registrations});
            })
            
        }



    render() {
        return (
            <div id="leaderboard-div">
            <div id="divCompetitionName"><h1>Competition Name</h1></div>
                <div id="table-div">
                    <div class="divTableRow">
                        <div id="divPartPlace"><h3>Place</h3></div>
                        <div id="divPartName"><h3>Participant</h3></div>
                        <div id="divPartScore"><h3>Final Score</h3></div>
                        <div id="divPartTime"><h3>Final Time</h3></div>
                    </div>
                    {this.state.registrations.map((registration, registrationIndex) => (
                    <div class="divTableRow">
                        <div id="divParticipantPlace">{registration.place}</div>
                        <div id="divParticipantName">{registration.username}</div>
                        <div id="divParticipantScore">{registration.finalScore}</div>
                        <div id="divParticipantTime">{registration.finalTime}</div>
                    </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Leaderboard;