import React from 'react';
import ReactDOM from 'react-dom'
import './Home.css';
import competitionIcon from '../images/competitionIcon.png';
import suggestionIcon from '../images/suggestions.png';


class Home extends React.Component {
    render() {
        return (
            <div id="home-outer-div">
                <div id="homeTitleDiv"><h1 id="home-title">Welcome to the LabSecurity!</h1></div>
                <div id="homeSubTitleDiv"><h3>In this app you'll be able to improve your hacking skills by competing against other people to see which is the fastest hacker</h3></div>
                <div id ="centerDiv">
                    <div id="home-container">
                        <div id="homeCompetitions">
                            <h1>Competitions</h1>
                            <img src={competitionIcon} id="homeCompetitionIcon" />
                            <h3>Compete against other players in each competition full of amazing challenges where you can test your hacking skills! Be The Hacker King!</h3>
                        </div>
                        <div id="homeSuggestions">
                            <h1>Suggestions</h1>
                            <img src={suggestionIcon} id="homeCompetitionIcon" />
                            <h3>If you are a programmer and want to help by creating new challenges to be implemented on competitions, give it a try and make a suggestion</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;