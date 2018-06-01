import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Navbar from "./header/Navbar";

import Home from "./App";
import Login from "./user/login/Login";
import Signup from "./user/signup/Signup";
import About from "./about/About";


class App extends Component {
  render() {
    return (
      <div className="Home">
        <Router>
          <div>
            <Navbar>
              <div className="routes-container">
                <Route path="/about" component={About} />
                <Route path="/signup" component={Signup} />
                <Route path="/" component={Home} />
                <Route path="/login" component={Login} />
              </div>
            </Navbar>
          </div>
        </Router>
          <div id="home-container">
              <h1 id="home-title">Welcome to the LabSecurity</h1>
              <h3>In this app you'll be able to improve your hacking skills, learn about some cyberattacks and even compete against other people to see which is the fastest </h3>
          </div>
      </div>
    );
  }
}

export default App;
