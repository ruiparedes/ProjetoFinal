import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import NavBar from "./header/Navbar";

import Home from "./home/Home";
import Login from "./user/login/Login";
import Signup from "./user/signup/Signup";
import About from "./about/About";

import ChallengesList from "./challengesList/ChallengesList";
import AttackPage from "./challengesList/AttackPage";
import CompetitionsList from "./competitions/CompetitionsList";
import CompetitionChallenges from "./competitions/CompetitionChallenges";
import ChallengeSuggestion from "./suggestions/ChallengeSuggestion";
import Challenge from "./competitions/Challenge";
import Leaderboard from "./competitions/Leaderboard";

import Management from "./management/Management";
import CompetitionsManagement from "./management/competitions/CompetitionsManagement";
import AddCompetition from "./management/competitions/AddCompetition";
import AddCompetitionChallenges from "./management/competitions/AddCompetitionChallenges";
import AlterCompetitionStatus from "./management/competitions/AlterCompetitionStatus";
import AlterCompetitionEndDate from "./management/competitions/AlterCompetitionEndDate";
import AlterCompetitionMaxParticipants from "./management/competitions/AlterCompetitionMaxParticipants";


import ChallengesManagement from "./management/challenges/ChallengesManagement";
import AddChallenge from "./management/challenges/AddChallenge";

import ClassificationsManagement from './management/classifications/ClassificationsManagement';
import SuggestionsManagement from './management/suggestions/SuggestionsManagement';

import noAuthority from './supportComponents/noAuthority';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <div className="routes-container">
            <Switch>
              <Route exact path="/about" component={About} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/management/competitions" component={CompetitionsManagement} />
              <Route exact path="/challengesList" component={ChallengesList} />
              <Route exact path="/attack/:nameId/" component={AttackPage} />
              <Route exact path="/competitionsList" component={CompetitionsList} />
              <Route exact path="/challengeSuggestion" component={ChallengeSuggestion} />
              <Route exact path="/competitionChallenges" component={CompetitionChallenges} />
              <Route exact path="/challenge/:name/" component={Challenge} />
              <Route exact path="/leaderboard" component={Leaderboard} />
              <Route exact path="/management" component={Management} />
              <Route exact path="/management/competitions/addCompetition" component={AddCompetition} />
              <Route exact path="/management/competitions/addCompetitionChallenges" component={AddCompetitionChallenges} />
              <Route exact path="/management/competitions/alterCompetitionStatus" component={AlterCompetitionStatus} />
              <Route exact path="/management/competitions/alterCompetitionEndDate" component={AlterCompetitionEndDate} />
              <Route exact path="/management/competitions/alterCompetitionMaxParticipants" component={AlterCompetitionMaxParticipants} />

              <Route exact path="/management/challenges" component={ChallengesManagement} />
              <Route exact path="/management/challenges/addChallenge" component={AddChallenge} />

              <Route exact path="/management/classifications" component={ClassificationsManagement} />
              <Route exact path="/management/suggestions" component={SuggestionsManagement} />

              <Route exact path="/noAuthority" component={noAuthority} />

            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
