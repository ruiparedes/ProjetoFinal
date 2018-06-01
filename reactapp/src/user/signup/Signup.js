import React from 'react';
import ReactDOM from 'react-dom'
import './Signup.css';

class Signup extends React.Component {
    render() {
        return (
            <div className="signup">
                <div id="signup-container">
                    <div className="block">
                        <label>Username: </label>
                        <input type="text" placeholder="Enter the Username" id="username" required></input>
                    </div>
                    <div className="block">
                        <label>Password: </label>
                        <input type="password" placeholder="Enter the Password" id="password" required></input>
                    </div>
                    <div className="block">
                        <label>Name: </label>
                        <input type="text" placeholder="First and Last name" id="name" required></input>
                    </div>
                    <div className="block">
                        <label>Email: </label>
                        <input type="text" placeholder="Enter your Email" id="email" required></input>
                    </div>
                    <div className="block">
                        <label>Date of Birth: </label>
                        <input type="date" id="birthday" required></input>
                    </div>
                    <div className="btncontainer" >
                        <button type="submit" value="Signup" className="acceptbtn">Signup</button>
                    </div>

                </div>
            </div>
        );
    }
}

export default Signup;