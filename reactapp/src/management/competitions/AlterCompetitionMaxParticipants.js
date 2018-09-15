import React, { Component } from 'react';
import Notifications, {notify} from 'react-notify-toast';
import { Route, Redirect } from 'react-router-dom';
import { URL } from '../../shared/Constants';
import './AlterCompetitionMaxParticipants.css';
let localUser = JSON.parse(localStorage.getItem('userData'));

class AlterCompetitionMaxParticipants extends Component {

    constructor(props) {
        super(props);

        this.state = {
            maxParticipants: null,
            redirectToCompetitionManagement: false
        }

        this.onChange = this.onChange.bind(this);
        this.updateMaxParticipants = this.updateMaxParticipants.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }

    updateMaxParticipants(){
        fetch(URL + ':8080/api/competitions/updateMaxParticipants', {
            method: 'POST',
            body: JSON.stringify({
                competitionID: this.props.location.state.competitionID,
                maxParticipants: Number(this.state.maxParticipants)
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json().then(data => ({status: res.status, body: data})))
        .then(obj =>{
            if(obj.status ===200){
                this.setState({redirectToCompetitionManagement: true})
            }
            else{
                notify.show('Something went wrong, check the value of Max Participants provided!');
            }
        })
    }


    render() {

        if(this.state.redirectToCompetitionManagement==true){
            this.setState({redirectToCompetitionManagement: false});
            return <Redirect
            to={{
              pathname: "/management/competitions"
            }}
          />  
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
        else if(this.props.location.state== undefined){
            window.location.href ="/errorManagementHandler";
        }



        return (
            <div id="alterCompetitionMaxParticipantsOuterDiv">
                <div id="alterCompetitionMaxParticipantsInnerDiv">
                    <h1>{this.props.location.state.competitionName}</h1>
                    <div id="alterCompetitionMaxParticipantsForm">
                        <div id="addCompetitionMaxParticipantsTitle"><h2>Max Participants:</h2></div>
                        <div id="addCompetitionMaxParticipantsInput"> <input type="number" id="competitionMaxParticipantsInput" onChange={this.onChange} className="maxParticipants" required></input></div>
                        <div id="addCompetitionButtonDiv"><button type="submit" value="addCompetitionButton" id="addCompButton" onClick = {this.updateMaxParticipants}>Alter Max Participants</button></div>
                    </div>
                </div>
                <div><Notifications /></div>
            </div>
        );
    }
}

export default AlterCompetitionMaxParticipants;