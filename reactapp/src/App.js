import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import NavBar from "./header/Navbar";

import Home from "./home/Home";
import Login from "./user/login/Login";
import Signup from "./user/signup/Signup";
import About from "./about/About";
import Competitions from "./management/competitions/Competitions";
import ChallengesList from "./challengesList/ChallengesList";
import AttackPage from "./challengesList/AttackPage";
import CompetitionsList from "./competitions/CompetitionsList";
import CompetitionChallenges from "./competitions/CompetitionChallenges";
import ChallengeSuggestion from "./suggestions/ChallengeSuggestion";

class App extends React.Component {
  render() {
    return (
      <Router>
          <div>
          <NavBar/>
              <div className="routes-container">
              <Switch>
                <Route exact path="/about" component={About} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/competitions" component={Competitions} />
                <Route exact path="/challengesList" component={ChallengesList} />
                <Route exact path="/attack/:nameId/" component={AttackPage} />
                <Route exact path="/competitionsList" component={CompetitionsList} />
                <Route exact path="/challengeSuggestion" component={ChallengeSuggestion} />
                <Route exact path="/competitionChallenges/:name/" component={CompetitionChallenges} />
                </Switch>
              </div>
          </div>
        </Router>
    );
  }
}

export default App;
