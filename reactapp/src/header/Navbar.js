import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
var floatRight = { float: 'right' };


class NavBar extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        localStorage.setItem("userData", '');
        localStorage.clear();
    }



    render() {
        if (localStorage.getItem('userData') != null) {
            return (
                <header>
                    <ul id="headerButtons">
                        <li className="navButton"><Link to="/home">HomePage</Link></li>
                        <li className="navButton" style={floatRight} onClick={this.logout}><Link to="/login">Logout</Link></li>
                        <li className="navButton" style={floatRight}><Link to="/about">About</Link></li>
                        <li className="navButton" style={floatRight}><Link to="/competitions">Management</Link></li>
                        <li className="navUsername" style={floatRight}>Welcome, {JSON.parse(localStorage.getItem('userData')).username}</li>
                    </ul>
                </header>
            )
        }
        else {
            return (
                <header>
                    <ul id="headerButtons">
                        <li className="navButton"><Link to="/home">HomePage</Link></li>
                        <li className="navButton" style={floatRight}><Link to="/about">About</Link></li>
                        <li className="navButton" style={floatRight}><Link to="/signup">Signup</Link></li>
                        <li className="navButton" style={floatRight}><Link to="/login">Login</Link></li>
                    </ul>
                </header>
            )
        }
    }
}
export default NavBar;