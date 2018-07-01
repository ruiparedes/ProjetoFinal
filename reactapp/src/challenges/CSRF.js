import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import CSRFProccess from "./CSRFProccessing.js";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

class CSRF extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            CSRFAttack: '',
            redirect: false
        }

        this.sendAttack = this.sendAttack.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }

    sendAttack() {

        if(this.state.CSRFAttack){
            this.setState({redirect: true});
        }

    }


    render() {

        if(this.state.redirect == true){
            console.log(this.state.redirect);
            this.setState({redirect: false});
            console.log(this.state.redirect);
            console.log("Link:"+ this.state.CSRFAttack);
            return <Redirect
            to={{
              pathname: ""+ this.state.CSRFAttack
            }}
          />  
        }
        
        return (
            <div>
                <div className="block">
                    <label>Attack: </label>
                    <input type="text" placeholder="Enter the Attack" className="CSRFAttack" onChange={this.onChange} required></input>
                </div>
                <div className="btncontainer" >
                    <button type="submit" value="Attack" className="acceptbtn" onClick={this.sendAttack}>Attack</button>
                </div>
                <Router>
                    <div className="routes-container">
                            <Route exact path="/bankTransfer" component={CSRFProccess} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default CSRF;