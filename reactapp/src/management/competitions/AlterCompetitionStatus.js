import React, { Component } from 'react';
import './AlterCompetitionStatus.css';
import { URL } from '../../shared/Constants';
import { Route, Redirect } from 'react-router-dom';
import Notifications, { notify } from 'react-notify-toast';
let localUser = JSON.parse(localStorage.getItem('userData'));

class AlterCompetitionStatus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allStatus: [],
            selectedStatus: null,
            newStatus: null,
            redirectToManagementCompetition: false
        }

        this.fetchAllStatus = this.fetchAllStatus.bind(this);
        this.handleSelectedOption = this.handleSelectedOption.bind(this);
        this.addChallengeToCompetition = this.addChallengeToCompetition.bind(this);
        this.redirectToManagementCompetitionF = this.redirectToManagementCompetitionF.bind(this);
    }

    componentDidMount() {
        this.fetchAllStatus();
    }

    fetchAllStatus() {
        const getAllStatus = URL + ':8080/api/status/View';
        fetch(getAllStatus).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ allStatus: data.status })
            });
    }

    handleSelectedOption(e) {
        this.setState({ selectedStatus: e.target.value });
    }

    addChallengeToCompetition() {
        if (this.state.selectedStatus != null) {
            fetch(URL + ':8080/api/competitions/updateStatus', {
                method: 'POST',
                body: JSON.stringify({
                    competitionID: this.props.location.state.competitionID,
                    statusID: Number(this.state.selectedStatus)
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(res => res.json().then(data => ({ status: res.status, body: data })))
                .then(obj => {
                    if (obj.status === 200) {
                        notify.show('Competition Status Changed Successfully');
                        this.setState({ newStatus: this.state.selectedStatus, redirectToManagementCompetition: true });
                    }
                    else {
                        notify.show('Something went wrong, check the information provided!');
                    }
                })
        }
        else {
            notify.show('Select a status first please!');
        }

    }

    redirectToManagementCompetitionF(){
        this.setState({redirectToManagementCompetition: true});
    }




    render() {
        if(this.state.redirectToManagementCompetition == true) {
            this.setState({redirectToManagementCompetition: false});
            return <Redirect to={{
                pathname: '/management/competitions'
            }} />
        }
        else if(localStorage.getItem('userData') == null){
            return <Redirect to={{
                pathname: '/login'
            }} />
        }
        else if(localUser.role != 'admin'){
            return <Redirect to={{
                pathname: '/noAuthority'
            }} />
        }


        console.log(this.state.newStatus);
        return (
            <div id="alterCompetitionStatusOuterDiv">
                <div id="alterCompetitionStatusInnerDiv">
                    <h1>{this.props.location.state.competitionName} - Alter Competition Status</h1>
                    <div id="alterCompetitionStatusForm">
                        <div id="alterCompetitionStatusSelectForm">
                            <div id="competitionCurrentStatus">
                                {this.state.newStatus == null ? <h2>Competition Current Status: {this.props.location.state.competitionCurrentStatus}</h2>
                                    : <div>{this.state.allStatus.map((status, statusIndex) => (
                                        <div>
                                            {this.state.newStatus == status.id ? <h2>Competition Current Status: {status.statusName} </h2> :
                                                null}</div>
                                    ))}</div>}

                            </div>
                            <div id="alterCompetitionStatusTitleDiv"><h2>New Competition Status: </h2></div>
                            <div id="alterCompetitionStatusSelectDiv">
                                <select id="selectNewStatus" onChange={this.handleSelectedOption}>
                                    <option disabled selected value> -- Select a Status -- </option>
                                    {this.state.allStatus.map((status, statusIndex) => (
                                        <option value={status.id}>{status.statusName}</option>
                                    ))}
                                </select>
                            </div>
                            <div id="alterCompetitionStatusButtonDiv"><button type="submit" value="alterCompetitionStatusButton" id="alterCompStatusButtonDiv" onClick={this.addChallengeToCompetition}>Change Status</button></div>
                            <div id="alterCompetitionStatusKeepButtonDiv"><button type="submit" value="alterCompetitionStatusKeepButton" id="alterCompStatusKeepButtonDiv" onClick={this.redirectToManagementCompetitionF}>Keep Current Status</button></div>
                        </div>

                    </div>
                </div>
                <div><Notifications /></div>
            </div>
        );
    }
}

export default AlterCompetitionStatus;