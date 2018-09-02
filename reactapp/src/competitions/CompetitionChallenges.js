import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import './CompetitionChallenges.css';

class CompetitionChallenges extends Component {

    constructor(props) {
        super(props);
        this.state = {
            competitionChallenges: [],
            challengesDone: [],
            competitionID: ''
        }
        this.fetchCompetitionChallenges = this.fetchCompetitionChallenges.bind(this);
    }


    componentDidMount() {
        console.log(this.props.location.state.competitionID)
        this.setState({ competitionID: this.props.location.state.competitionID });
        this.fetchCompetitionChallenges();
    }


    fetchCompetitionChallenges() {
        const getCompetitionChallenges = URL + ':8080/api/challengesPerCompetition/getCompetitionChallenges/' + this.props.location.state.competitionID;
        fetch(getCompetitionChallenges).then(res => res.json())
            .then(data => {
                this.setState({ competitionChallenges: data.competitionChallenges });
            })
    }

    render() {
        return (
            <div>
                {this.state.competitionChallenges.map((challenge, challengeIndex) => (
                    <div id="challengeBox" key={'challengeBox_' + challengeIndex}>
                        <div id="challengeName"><h2>{challenge.id}</h2></div>
                    </div>
                ))}
            </div>
        );
    }
}

export default CompetitionChallenges;