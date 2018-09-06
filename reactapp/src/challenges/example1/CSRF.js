import React, { Component } from 'react';
import { URL } from '../../shared/Constants';
import './CSRF.css';
import CSRFProcess from "./CSRFProcessing";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

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

        if (this.state.CSRFAttack) {
            this.setState({ redirect: true });
        }

    }


    render() {
        const link = "http://localhost:3000/attack/CSRFProcessing"

        if (this.state.redirect == true) {
            console.log(this.state.redirect);
            this.setState({ redirect: false });
            console.log(this.state.redirect);
            console.log("Link:" + this.state.CSRFAttack);
            return <Redirect to={{
                pathname: '/attack/CSRFProcessing',
                search: this.state.CSRFAttack,
            }} />



        }

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
            </div>
        );
    }
}

export default CSRF;