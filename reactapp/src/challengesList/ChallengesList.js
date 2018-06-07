import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import ReactDOM from 'react-dom';

class ChallengesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            challenges: []
        }
        this.fetchChallenges = this.fetchChallenges.bind(this);
        this.redirectF = this.redirectF.bind(this);
    }

    componentDidMount() {
        this.fetchChallenges();
    }

    fetchChallenges() {
        fetch(URL + ':8080/api/challenges/View').then(res => res.json()).
            then(data => this.setState({ challenges: data.challenges }));
    }

    redirectF(challengeName){
        var attackName = challengeName.replace(/ +/g,"");
        window.location.href = URL + ":3000/attack/"+ attackName;
    }

    render() {
        return (
            <div>
                {this.state.challenges.map((challenges, challengesIndex) => (
                    <div className="btncontainer" >
                        <button type="submit" value={'challenge_'+ challengesIndex} className="acceptbtn" onClick={() => {this.redirectF(challenges.name)}} >{challenges.name}</button>
                    </div>
                ))}
            </div>
        );
    }
}

export default ChallengesList;