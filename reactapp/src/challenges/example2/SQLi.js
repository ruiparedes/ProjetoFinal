import React, { Component } from 'react';
import { URL } from '../../shared/Constants';
import './SQLi.css';
class SQLi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username:'',
            password:'',
            challenge: []
        }

        this.sendAttack = this.sendAttack.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        let challengeID = this.props.challengeID;
        const getChallenge = URL + ':8080/api/challengeById/' + challengeID;
        fetch(getChallenge).then(res => res.json())
            .then(data => {
                this.setState({ challenge: data.challenge[0] })
            })
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }

    sendAttack() {
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        fetch(URL + ':8080/api-vulnerable/users/Login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

    }


    render() {
        return (
            <div>
                <div id="challengeBox">
                <h2 id="challengeName">{this.state.challenge.name}</h2>
                <h4>{this.state.challenge.description}</h4>
                <div id="attackContainer">
                <div id = "attackLogin"><h3>Login</h3></div>
                    <div id="insertField"><input type="text" placeholder="username" className="username" id="attackField" onChange={this.onChange} required></input></    div>
                    <div id="insertField"><input type="password" placeholder="password" className="password" id="attackField" onChange={this.onChange} required></input></div>
                    <div id="attackButtonContainer" >
                        <button type="submit" value="Login" id= "attackButton" onClick={this.sendAttack}>Login</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SQLi;