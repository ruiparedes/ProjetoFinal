import React, { Component } from 'react';
import './AlterCompetitionEndDate.css';
import Notifications, {notify} from 'react-notify-toast';
import { Route, Redirect } from 'react-router-dom';
import { URL } from '../../shared/Constants';

class AlterCompetitionEndDate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            endDate: null,
            redirectToCompetitionManagement: false
        }

        this.onChange = this.onChange.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }

    updateEndDate(){
        fetch(URL + ':8080/api/competitions/updateEndDate', {
            method: 'POST',
            body: JSON.stringify({
                competitionID: this.props.location.state.competitionID,
                endDate: this.state.endDate
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
                notify.show('Something went wrong, check the date provided!');
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


        return (
            <div id="alterCompetitionEndDateOuterDiv">
                <div id="alterCompetitionEndDateInnerDiv">
                    <h1>{this.props.location.state.competitionName}</h1>
                    <div id="alterCompetitionStatusForm">
                        <div id="addCompetitionEndDateTitle"><h2>End Date:</h2></div>
                        <div id="addCompetitionEndDateInput"> <input type="datetime-local" id="competitionEndDateInput" onChange={this.onChange} className="endDate" required></input></div>
                        <div id="addCompetitionButtonDiv"><button type="submit" value="addCompetitionButton" id="addCompButton" onClick = {this.updateEndDate}>Alter End Date</button></div>
                    </div>
                </div>
                <div><Notifications /></div>
            </div>
        );
    }
}

export default AlterCompetitionEndDate;