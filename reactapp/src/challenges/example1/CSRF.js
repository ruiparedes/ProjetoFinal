import React, { Component } from 'react';
import { URL } from '../../shared/Constants';
import './CSRF.css';
import CSRFProcess from "./CSRFProcessing";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import Notifications, {notify} from 'react-notify-toast';
let localUser = JSON.parse(localStorage.getItem('userData'));

class CSRF extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            CSRFAttack: '',
            redirect: false,
            challenge: [],
            parameters:''
        }

        this.sendAttack = this.sendAttack.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        let challengeID = this.props.challengeID;
        const getChallenge = URL + ':8080/api/challengeById/'+ challengeID;
        fetch(getChallenge).then(res => res.json())
        .then(data => {
          this.setState({ challenge: data.challenge[0]})
        })
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        this.setState({ parameters: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }

    sendAttack() {
        const amountAndReceptorAccount = this.state.parameters;
        if(amountAndReceptorAccount.substr(1, 6) =='amount' && amountAndReceptorAccount.substr(13, 15)=='receptorAccount'){
            var amount = amountAndReceptorAccount.substr(8, 4);
            var receptorAccount = amountAndReceptorAccount.substr(29, 4);
        }
        else if(amountAndReceptorAccount.substr(1, 15)=='receptorAccount' && amountAndReceptorAccount.substr(22, 6)=='amount'){
            var receptorAccount = amountAndReceptorAccount.substr(17, 4);
            var amount = amountAndReceptorAccount.substr(29, 4);
        }
        else{
            notify.show('Your attack failed. Check everything so see if somethings wrong!');
        }

        const checkAttack = URL + ':8080/api-vulnerable/CSRF/'+amount+'/'+receptorAccount;

        fetch(checkAttack).then((object) =>{
            console.log(object);
                console.log(object.status);
            if(object.status ==200){
                notify.show('Congratulations, your attack was a success!!');

                var challengeID = this.props.challengeID;
                var competitionID = this.props.competitionID;
                var userID = localUser.id;

                console.log(challengeID);
                console.log(competitionID);
                console.log(userID);

                fetch(URL + ':8080/api/scorePerChallengePerCompetition/getScore', {
                    method: 'POST',
                    body: JSON.stringify({
                        challengeID: challengeID,
                        competitionID: competitionID,
                        userID: userID
                    }),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });

            }
            else {
                notify.show('Your attack failed. Check everything so see if somethings wrong!');
            }
        })

    }


    render() {
        const link = "http://RichPeopleBank/YourAccount/TransferMoney"


        return (
            <div>
                <div id="challengeBox">
                <h2 id="challengeName">{this.state.challenge.name}</h2>
                <h4 id="challengeDescription">{this.state.challenge.description}</h4>
                <div className="attackContainer" >
                    <label>Attack: </label>
                    <input type="text" placeholder="Enter the Attack here" className="CSRFAttack" id="attackBox" onChange={this.onChange} required></input>
                    <button type="submit" value="Attack" className="attackButton" id="CSRFAttackButton" onClick={this.sendAttack}>Attack</button>
                </div>
                <div>
                    <h4><b>Attack URL:</b> {link}{this.state.parameters}</h4>
                </div>
                </div>
                <div><Notifications /></div>
            </div>
        );
    }
}

export default CSRF;