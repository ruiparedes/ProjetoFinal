import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import ReactDOM from 'react-dom';
import { Route, Redirect } from 'react-router-dom';

class ChallengesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            challenges: [],
            redirect: false,
            link: ''
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
        console.log(challengeName);
        var attackName = challengeName.replace(/ +/g,"");
        console.log(attackName);
        console.log(this.state.redirect);
        this.setState({link: challengeName});        
        this.setState({redirect: true});
        console.log(this.state.redirect);

        //window.location.href = URL + ":3000/attack/"+ attackName;
    }

    render() {
        if(this.state.redirect ==true){
            this.setState({redirect: false});
            return <Redirect
            to={{
              pathname: "/attack/" + this.state.link,
              state: { referrer: this.state.link }
            }}
          />  
        }

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