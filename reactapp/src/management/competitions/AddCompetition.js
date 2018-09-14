import React, { Component } from 'react';
import { URL } from '../../shared/Constants';
import './AddCompetition.css';
import Notifications, {notify} from 'react-notify-toast';
import { Route, Redirect } from 'react-router-dom';
let localUser = JSON.parse(localStorage.getItem('userData'));


class AddCompetition extends Component {


    constructor(props) {
        super(props);

        this.state = {
            competitionName: '',
            maxParticipants: 0,
            endDate: null,
            redirectCompetitionChallenges:false,
            competitionCreatedID: null
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
            }).then(res => res.json().then(data => ({status: res.status, body: data})))
            .then(obj =>{
                if(obj.status ===200){
                    notify.show('Competition Created Successfully!');
                    this.setState({competitionCreatedID: obj.body.insertedCompetitionID, redirectCompetitionChallenges: true});
                }
                else{
                    notify.show('Something went wrong, check the information provided! Competition name may already exist!');
                }
                console.log(obj);
                console.log(obj.body.insertedCompetitionID);
            })

        }

    }




    render() {
        console.log(this.state.competitionCreatedID);
        if(this.state.redirectCompetitionChallenges==true){
            this.setState({redirectCompetitionChallenges: false});
            return <Redirect
            to={{
              pathname: "/management/competitions/addCompetitionChallenges" ,
              state: {competitionID: this.state.competitionCreatedID}
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
                <div><Notifications /></div>
            </div>
        );
    }
}

export default AddCompetition;