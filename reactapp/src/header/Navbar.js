import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
var floatRight = { float: 'right' };

class NavBar extends Component {

    render() {
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
export default NavBar;