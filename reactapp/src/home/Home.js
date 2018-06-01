import React from 'react';
import ReactDOM from 'react-dom'
import './Home.css';

class Home extends React.Component {
    render() {
        return (
            <div className="Home">
                <div id="home-container">
                    <h1 id="home-title">Welcome to the LabSecurity</h1>
                    <h3>In this app you'll be able to improve your hacking skills, learn about some cyberattacks and even compete against other people to see which is the fastest </h3>
                </div>
            </div>
        );
    }
}

export default Home;