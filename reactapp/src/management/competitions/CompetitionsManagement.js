import React, { Component } from 'react';
import './CompetitionsManagement.css'
import { URL } from '../../shared/Constants';
import { Route, Redirect } from 'react-router-dom';

class Competitions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allCompetitions: [],
            redirectToAddCompetion: false,
            redirectToAlterStatus: false,
            redirectToAlterEndDate: false,
            redirectToAlterMaxParticipants: false,
            selectedCompetitionID:null,
            selectedCompetitionName:null,
            selectedCompetitionStatus:null
        }
        this.fetchAllCompetitions = this.fetchAllCompetitions.bind(this);
        this.redirectToAddCompetitionF = this.redirectToAddCompetitionF.bind(this);
        this.redirectToAlterStatusF = this.redirectToAlterStatusF.bind(this);
        this.redirectToAlterEndDateF = this.redirectToAlterEndDateF.bind(this);
        this.redirectToAltermaxParticipantsF = this.redirectToAltermaxParticipantsF.bind(this);
    }

    componentDidMount() {
        this.fetchAllCompetitions();
    }


    fetchAllCompetitions() {
        const getAllCompetitions = URL + ':8080/api/competitions/View';
        fetch(getAllCompetitions).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ allCompetitions: data.competitions })
            });
    }

    redirectToAddCompetitionF(){
        this.setState({redirectToAddCompetion: true});
    }
    redirectToAlterStatusF(competitionID, competitionName, competitionCurrentStatus){
        this.setState({redirectToAlterStatus: true, selectedCompetitionID: competitionID, selectedCompetitionName: competitionName, selectedCompetitionStatus: competitionCurrentStatus});
    }
    redirectToAlterEndDateF(competitionID, competitionName){
        this.setState({redirectToAlterEndDate: true, selectedCompetitionID: competitionID, selectedCompetitionName: competitionName});
    }
    redirectToAltermaxParticipantsF(competitionID){
        this.setState({redirectToAlterMaxParticipants: true, selectedCompetitionID: competitionID});
    }

    render() {

        if(this.state.redirectToAddCompetion == true) {
            this.setState({redirectToAddCompeition: false});
            return <Redirect to={{
                pathname: '/management/competitions/addCompetition'
            }} />
        }

        if(this.state.redirectToAlterStatus == true) {
            this.setState({redirectToAlterStatus: false});
            return <Redirect to={{
                pathname: '/management/competitions/alterCompetitionStatus',
                state: {competitionID: this.state.selectedCompetitionID, competitionName: this.state.selectedCompetitionName, competitionCurrentStatus: this.state.selectedCompetitionStatus}
            }} />
        }

        if(this.state.redirectToAlterEndDate == true) {
            this.setState({redirectToAlterEndDate: false});
            return <Redirect to={{
                pathname: '/management/competitions/alterCompetitionEndDate',
                state: {competitionID: this.state.selectedCompetitionID, competitionName: this.state.selectedCompetitionName}
            }} />
        }

        if(this.state.redirectToAlterMaxParticipants == true) {
            this.setState({redirectToAlterMaxParticipants: false});
            return <Redirect to={{
                pathname: '/management/competitions/alterCompetitionMaxParticipants',
                state: {competitionID: this.state.selectedCompetitionID, competitionName: this.state.selectedCompetitionName}
            }} />
        }





        return (
            <div id="competitionManContainer">
                <div id="outer-management-competition-div">
                    <h1 id="competitionManagementTitle">Competitions - Management</h1>
                    <div class="divTable">
                        <div class="divTableBody">
                            <div class="divTableRow">
                                <div id="managementCompetitionCompetitionNameTitle">Name</div>
                                <div id="managementCompetitionCompetitionStatusTitle">Status</div>
                                <div id="managementCompetitionCompetitionStartDateTitle">Start Date</div>
                                <div id="managementCompetitionCompetitionEndDateTitle">End Date</div>
                                <div id="managementCompetitionCompetitionMaxScoreTitle">Max Score</div>
                                <div id="managementCompetitionCompetitionMaxParticipantsTitle">Max Participants</div>
                                <div id="managementCompetitionCompetitionTotalParticipantsTitle">Number of Registrations</div>
                                <div id="managementCompetitionButtonsTitleDiv">Update Fields</div>
                            </div>
                            {this.state.allCompetitions.map((competition, competitionIndex) => (
                            <div class="divTableRow">
                                <div id="managementCompetitionCompetitionNameValue">{competition.name}</div>
                                <div id="managementCompetitionCompetitionStatusValue">{competition.statusName}</div>
                                <div id="managementCompetitionCompetitionStartDateValue">{competition.startDate}</div>
                                <div id="managementCompetitionCompetitionEndDateValue">{competition.endDate}</div>
                                <div id="managementCompetitionCompetitionMaxScoreValue">{competition.maxScore}</div>
                                <div id="managementCompetitionCompetitionMaxParticipantsValue">{competition.maxParticipants}</div>
                                <div id="managementCompetitionCompetitionTotalParticipantsValue">{competition.totalParticipants}</div>
                                <div id="managementCompetitionButtonsDiv">
                                <div id="managementCompetitionEndDateButtonDiv"><button type="submit" value="managementCompetitionEndDateButton" id="managementCompeEndDateButton" onClick={() =>{this.redirectToAlterEndDateF(competition.id, competition.name)}}>EndDate</button></div>
                                <div id="managementCompetitionMaxParticipantsButtonDiv"><button type="submit" value="managementCompetitionMaxParticipantsButton" id="managementCompMaxParticipantsButton" onClick={() =>{this.redirectToAltermaxParticipantsF(competition.id, competition.name)}}>Max Participants</button></div>
                                <div id="managementCompetitionStatusButtonDiv"><button type="submit" value="managementCompetitionStatusButton" id="managementCompStatusButton" onClick={() =>{this.redirectToAlterStatusF(competition.id, competition.name, competition.statusName)}} >Status</button></div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" value="managementCompetitionAddCompetition" id="managementCompAddCompetition" onClick={this.redirectToAddCompetitionF}>Add New Competition</button>
                </div>
            </div>
        );
    }
}

export default Competitions;