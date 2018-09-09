import React, { Component } from 'react';
import { URL } from '../../shared/Constants';
import './AddCompetition.css';


class AddCompetition extends Component {


    constructor(props) {
        super(props);

        this.state = {
            competitionName: '',
            maxParticipants: 0,
            endDate: null
        }

        this.addCompetition = this.addCompetition.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }

    addCompetition() {
        if (this.state.competitionName && this.state.maxParticipants && this.state.endDate) {
            fetch(URL + ':8080/api/competitions/Add', {
                method: 'POST',
                body: JSON.stringify({
                    name: this.state.competitionName,
                    maxParticipants: this.state.maxParticipants,
                    endDate: this.state.endDate
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });

        }

    }




    render() {
        return (
            <div id="addCompetitionOuterDiv">
                <div id="addCompetitionInnerDiv"><h1>Create Competition</h1>
                    <div id="addCompetitionFormDiv">
                        <div id="addCompetitionNameTitle"><h2>Competition Name:</h2></div>
                        <div id="addCompetitionNameInput"> <input type="text" placeholder="Enter the Competition Name" id="competitionNameInput" className="competitionName" onChange={this.onChange} required></input></div>
                        <div id="addCompetitionMaxParticipantsTitle"><h2>Maximum Participants:</h2></div>
                        <div id="addCompetitionMaxParticipantsInput"> <input type="number" id="competitionMaximumParticipantsInput" onChange={this.onChange} className="maxParticipants" required></input></div>
                        <div id="addCompetitionEndDateTitle"><h2>End Date:</h2></div>
                        <div id="addCompetitionEndDateInput"> <input type="datetime-local" id="competitionEndDateInput" onChange={this.onChange} className="endDate" required></input></div>
                        <div id="addCompetitionButtonDiv"><button type="submit" value="addCompetitionButton" id="addCompButton" onClick={this.addCompetition}>Create Competition</button></div>

                    </div>
                </div>
            </div>
        );
    }
}

export default AddCompetition;