import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NavBar from "./header/Navbar";

import Home from "./home/Home";
import Login from "./user/login/Login";
import Signup from "./user/signup/Signup";
import About from "./about/About";
import Competitions from "./management/competitions/Competitions";


class App extends React.Component {
  render() {
    return (
        <Router>
          <div>
          <NavBar/>
              <div className="routes-container">
                <Route path="/about" component={About} />
                <Route path="/signup" component={Signup} />
                <Route path="/home" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/competitions" component={Competitions} />
              </div>
          </div>
        </Router>
    );
  }
}

export default App;
